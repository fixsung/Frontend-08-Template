/*
 * @Author: songyzh
 * @Date: 2021-03-03 14:01:24
 * @LastEditors: songyzh
 * @LastEditTime: 2021-03-05 17:30:51
 */
const css = require("css");
const layout = require("./layout");
const EOF = Symbol("EFO");
let currentToken = null;
let currentAttribute = null;

let stack = [{ type: "document", children: [] }];
let currentTextNode = null;

const rules = [];
// @see https://github.com/keeganstreet/specificity/blob/master/specificity.js
function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  sp1[3] - sp2[3];
}
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  }
  if (selector.charAt(0) === ".") {
    let attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
}
function addCSSRules(text) {
  let ast = css.parse(text);
  console.log(JSON.stringify(ast, null, " "));
  rules.push(...ast.stylesheet.rules);
}

function computedCSS(element) {
  let elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }

    if (matched) {
      let sp = specificity(rule.selectors[0]);
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
      console.log(element.computedStyle);
    }
  }
}
function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p !== "type" && p !== "tagName") {
        element.attributes.push({ name: p, value: token[p] });
      }
    }
    computedCSS(element);
    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match");
    } else {
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}
// 初始状态
function data(char) {
  if (char === "<") {
    return tagOpen;
  } else if (char == EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: char,
    });
    return data; //文本节点后续处理
  }
}

// 解析标签 开始标签 结束标签 自封闭标签

// 标签开始
function tagOpen(char) {
  if (char === "/") {
    //是否为结束标签 </
    return endTagOpen;
  } else if (char.match(/^[A-Za-z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(char);
  } else {
    return;
  }
}

function endTagOpen(char) {
  if (char.match(/^[A-Za-z]$/)) {
    // </xxx
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(char);
  } else if (char === ">") {
    // <>
    // throw error
  } else if (char === EOF) {
    // < EOF
    // throw error
  } else {
  }
}

function tagName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    //tagname后遇到空格 <a ...
    return beforeAttributeName;
  } else if (char === "/") {
    // <a/ 自封闭标签
    return selfClosingStartTag;
  } else if (char.match(/^[A-Za-z]$/)) {
    currentToken.tagName += char;
    return tagName;
  } else if (char === ">") {
    // <a> 解析下一个标签
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    // <a
    return beforeAttributeName;
  } else if (char == "/" || char === ">" || char === EOF) {
    return afterAttributeName(char);
  } else if (char === "=") {
    return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(char);
  }
}
function attributeName(char) {
  if (char.match(/^[\t\f\n ]$/) || char == "/" || char == ">" || char == EOF) {
    return afterAttributeName(char);
  } else if (char == "=") {
    return beforeAttirbuteValue;
  } else if (char == "\u0000") {
  } else if (char == '"' || char == "'" || char == "<") {
  } else {
    currentAttribute.name += char;
    return attributeName;
  }
}
function afterAttributeName(char) {
  if (char === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  }
}
function beforeAttirbuteValue(char) {
  if (char.match(/^[\t\f\n ]$/) || char == "/" || char == ">" || char == EOF) {
    return beforeAttirbuteValue(char);
  } else if (char == '"') {
    return doubleQuotedAttributeValue;
  } else if (char == "'") {
    return singleQuotedAttributeValue;
  } else if (char == ">") {
  } else {
    return unQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(char) {
  if (char == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (char === "\u0000") {
  } else if (char === EOF) {
  } else {
    currentAttribute.value += char;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(char) {
  if (char == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (char === "\u0000") {
  } else if (char === EOF) {
  } else {
    currentAttribute.value += char;
    return singleQuotedAttributeValue;
  }
}
function unQuotedAttributeValue(char) {
  if (char.match(/^[\t\f\n ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (char == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (char === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char === "\u0000") {
  } else if (
    char === '"' ||
    char === "'" ||
    char === "`" ||
    char == "<" ||
    char == "="
  ) {
  } else if (char === EOF) {
  } else {
    currentAttribute.value += char;
    return unQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(char) {
  if (char.match(/^[/t/n/f ]$/)) {
    return beforeAttributeName;
  } else if (char == "/") {
    return selfClosingStartTag;
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char === EOF) {
  } else {
    currentAttribute.value += char;
    return doubleQuotedAttributeValue;
  }
}
function selfClosingStartTag(char) {
  // 只有>是有效的其他字符均为无效字符
  if (char === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (char === EOF) {
  } else {
  }
}
module.exports.parseHTML = function parseHTML(html) {
  let state = data; // 状态机初始状态
  for (let char of html) {
    state = state(char);
  }
  state = state(EOF);
  return stack[0];
};
