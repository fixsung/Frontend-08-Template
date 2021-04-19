/*
 * @Author: songyzh
 * @Date: 2021-04-19 20:46:26
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-19 20:46:27
 * @Description:
 */
import { Component, STATE, ATTRIBUTE, createElement } from "./framework.js";
import { enableGesture } from "./gesture.js";
export { STATE, ATTRIBUTE } from "./framework.js";

export class List extends Component {
  constructor() {
    super();
  }

  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = child;
    // render();
  }
}
