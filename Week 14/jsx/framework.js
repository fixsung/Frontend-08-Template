/*
 * @Author: songyzh
 * @Date: 2021-04-09 13:37:43
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-09 14:04:38
 * @Description:
 */
export function createElement(type, props, ...children) {
  let element;
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (let name in props) {
    element.setAttribute(name, props[name]);
  }

  for (let child of children) {
    if (typeof child === "string") {
      child = new TextWrapper(child);
    }

    element.appendChild(child.root);
  }

  return element;
}
export class Component {
  constructor() {}
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    this.root.appendChild(child);
  }
  mountToParent(parent) {
    parent.appendChild(this.root);
  }
}
class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}
