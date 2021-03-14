/*
 * @Author: songyzh
 * @Date: 2021-03-08 16:13:21
 * @LastEditors: songyzh
 * @LastEditTime: 2021-03-09 14:05:08
 * @Description: 元素是否能够匹配到选择器
 */
function match(selector, element) {
  let selectors = [];
  directSelectorParts = selector.split(">");
  if (directSelectorParts.length === 1) {
    selectors = selector.split(" ").map((singleSelecor) => {
      return {
        selectorString: singleSelecor,
        isDirect: false,
      };
    });
  } else {
    directSelectorParts.forEach((directSelector) => {
      let parts = directSelector.split(" ");
      parts.forEach((singleSelecor, index) => {
        selectors.push({
          selectorString: singleSelecor,
          isDirect: index === parts.length - 1 ? true : false,
        });
      });
    });
  }
  let elements = getParentNode(element).reverse().push(element);
  let matched = true;
  while (selectors.length > 0 && matched) {
    matched = false;
    let currentSelector = selectors.pop();
    let elementNode = null;
    if (currentSelector.isDirect) {
      elementNode = elements.pop();
    } else {
      let tempMatched = false;
      while (elements.length > 0 && !tempMatched) {
        let currentElementNode = elements.pop();
        tempMatched = matchSingle(currentSelector, currentElementNode);
      }
      // 父级未匹配
      if (!tempMatched) {
        return false;
      }
    }

    matched = matchSingle(currentSelector, elementNode);
  }

  return matched;
}
let parents = [];
function getParentNode(element) {
  if (element.parentNode) {
    parents.push(element.parentNode);
    getParentNode(element.parentNode);
  } else {
    return parents;
  }
}
function matchSingle(selector, element) {
  let idMatched = false,
    classMatched = false,
    tagMatched = false;
  let idRegex = /(#[^\#\s\+>~\.\[:\)]+)/g,
    classRegex = /(\.[^\s\+>~\.\[:\)]+)/g,
    elementRegex = /([^\s\+>~\.\[:]+)/g;

  if (selector.match(elementRegex)) {
    let tag = RegExp.$1;
    if (tag !== element.tagName) {
      return false;
    }
  }
  tagMatched = true;
  if (selector.match(idRegex)) {
    let id = RegExp.$1.replace("#", "");
    if (element.id !== id) {
      return false;
    }
  }
  idMatched = true;

  if (selector.match(classRegex)) {
    classList = selector.match(classRegex);
    let inarr = classList.filter((val) => {
      return selector.className.indexOf(val) > -1;
    });
    if (inarr.length === 0) {
      return false;
    }
  }
  classMatched = true;

  if (tagMatched && idMatched && classMatched) {
    return true;
  }
}
