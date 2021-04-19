/*
 * @Author: songyzh
 * @Date: 2021-04-16 15:47:17
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-16 17:30:26
 * @Description:
 */

import { Component } from "@lib/framework";
import { enableGesture } from "@lib/gesture";
import { Timeline, Animation } from "@lib/animation";
import { ease } from "@lib/ease";
export default class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    let children = this.root.children;
    let position = 0;

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();
    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX;
      let current = position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    this.root.addEventListener("panend", (event) => {
      let x = event.clientX - event.startX;
      position = position - Math.round(x / 500);
      for (let offset of [
        0,
        -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
      ]) {
        let pos = position + offset;
        pos = (pos + children.length) % children.length;
        children[pos].style.transition = "";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500
        }px)`;
      }
    });
    // this.root.addEventListener("mousedown", (event) => {
    //   let startX = event.clientX;
    //   let up = (event) => {
    //     let x = event.clientX - startX;
    //     position = position - Math.round(x / 500);
    //     for (let offset of [
    //       0,
    //       -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
    //     ]) {
    //       let pos = position + offset;
    //       pos = (pos + children.length) % children.length;
    //       children[pos].style.transition = "";
    //       children[pos].style.transform = `translateX(${
    //         -pos * 500 + offset * 500
    //       }px)`;
    //     }
    //     document.removeEventListener("mousemove", move);
    //     document.removeEventListener("mouseup", up);
    //   };
    //   let move = (event) => {
    //     let x = event.clientX - startX;
    //     position = position - (x - (x % 500)) / 500;
    //     for (let offset of [-1, 0, 1]) {
    //       let pos = position + offset;
    //       pos = (pos + children.length) % children.length;
    //       children[pos].style.transition = "none";
    //       children[pos].style.transform = `translateX(${
    //         -pos * 500 + offset * 500 + (x % 500)
    //       }px)`;
    //     }
    //     for (let child of children) {
    //     }
    //   };
    //   document.addEventListener("mouseup", up);
    //   document.addEventListener("mousemove", move);
    // });

    setInterval(() => {
      let nextIndex = (position + 1) % children.length;
      let currentChild = children[position];
      let nextChild = children[nextIndex];

      nextChild.style.transition = "none";
      nextChild.style.transform = `translateX(${500 - nextIndex * 500}px)`;

      setTimeout(() => {
        nextChild.style.transition = "";
        currentChild.style.transform = `translateX(${-500 - position * 500}px)`;
        nextChild.style.transform = `translateX(${-nextIndex * 500}px)`;
        position = nextIndex;
      }, 16);
    }, 3000);

    return this.root;
  }
  mountToParent(parent) {
    parent.appendChild(this.render());
  }
}
