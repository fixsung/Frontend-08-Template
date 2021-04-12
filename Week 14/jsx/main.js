/*
 * @Author: songyzh
 * @Date: 2021-04-09 10:02:41
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-09 16:15:37
 * @Description:
 */
import { createElement, Component } from "./framework";

class Carousel extends Component {
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
    this.root.addEventListener("mousedown", (event) => {
      let startX = event.clientX;
      let up = (event) => {
        let x = event.clientX - startX;
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
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      let move = (event) => {
        let x = event.clientX - startX;
        position = position - (x - (x % 500)) / 500;
        for (let offset of [-1, 0, 1]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = "none";
          children[pos].style.transform = `translateX(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`;
        }
        for (let child of children) {
        }
      };
      document.addEventListener("mouseup", up);
      document.addEventListener("mousemove", move);
    });
    /***
    let children = this.root.children;
    let currentIndex = 0;
    setInterval(() => {
      let nextIndex = (currentIndex + 1) % children.length;
      let currentChild = children[currentIndex];
      let nextChild = children[nextIndex];

      nextChild.style.transition = "none";
      nextChild.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        nextChild.style.transition = "";
        currentChild.style.transform = `translateX(${
          -100 - currentIndex * 100
        }%)`;
        nextChild.style.transform = `translateX(${-nextIndex * 100}%)`;
        currentIndex = nextIndex;
      }, 16);
    }, 3000);
    */
    return this.root;
  }
  mountToParent(parent) {
    parent.appendChild(this.render());
  }
}

let source = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let element = <Carousel src={source} />;
element.mountToParent(document.body);
