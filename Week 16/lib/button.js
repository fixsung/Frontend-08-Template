/*
 * @Author: songyzh
 * @Date: 2021-04-19 20:45:04
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-19 20:45:49
 * @Description:
 */
import { Component } from "@lib/framework.js";

export { STATE, ATTRIBUTE } from "@lib/framework.js";

export class Button extends Component {
  constructor() {
    super();
  }

  render() {
    this.childContainer = <span />;
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childContainer) this.render();
    this.childContainer.appendChild(child);
  }
}
