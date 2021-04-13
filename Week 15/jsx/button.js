/*
 * @Author: songyzh
 * @Date: 2021-04-12 17:38:39
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-12 17:40:20
 * @Description:
 */
import { Component } from "./framework";

export { STATE, ATTRIBUTE } from "./framework";

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
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}
