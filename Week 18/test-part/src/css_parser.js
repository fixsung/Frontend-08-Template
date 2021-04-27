import css from "css";

let rules = [];

export function addCSSRules(text) {
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }

  // 支持复合选择器
  // tag selector
  let tag = selector.match(/^[^.#]+/);
  if (tag) {
    tag = tag[0];
    if (element.tagName !== tag) {
      return false;
    }
  }
  // id selector
  let id = selector.match(/#([^.#]+)/);
  if (id) {
    id = id[1];
    let attr = element.attributes.find((attr) => attr.name === "id");
    if (!attr || attr.value !== id) {
      return false;
    }
  }
  // class selectors
  let classes = selector.match(/\.([^.#]+)/g);
  if (classes) {
    classes = classes.map((cl) => cl.replace(".", ""));
    let attr = element.attributes.find((attr) => attr.name == "class");
    if (!attr) {
      return false;
    }
    // 只要有一个类没有，则不匹配
    if (classes.some((item) => !attr.value.includes(item))) {
      return false;
    }
  }

  return true;
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    // if (part.charAt(0) === '#') {
    //   p[1] += 1
    // } else if(part.charAt(0) === '.') {
    //   p[2] += 1
    // } else {
    //   p[3] += 1
    // }
    // 支持复合选择器
    // id selector
    if (part.match(/#[^.#]+/)) {
      p[1] += 1;
    }
    // class selectors
    let classes = part.match(/\.([^.#]+)/g);
    if (classes) {
      p[2] += classes.length;
    }
    // tag selector
    if (part.match(/^[^.#]+/)) {
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

  return sp1[3] - sp2[3];
}

export function computeCSS(stack, element) {
  let elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) continue;

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

        if (
          !computedStyle[declaration.property].specificity ||
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
      console.log(rule.selectors[0], element.computedStyle);
    }
  }
}
