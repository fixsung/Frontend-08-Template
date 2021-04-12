/*
 * @Author: songyzh
 * @Date: 2021-04-12 14:55:46
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-12 15:54:37
 * @Description:
 */
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease";
let element = document.getElementById("ele");
let timeline = new Timeline();
let animation = new Animation(
  element.style,
  "transform",
  0,
  500,
  3000,
  0,
  ease,
  (v) => `translateX(${v}%)`
);
timeline.add(animation);
timeline.start();
document.getElementById("btn-pause").addEventListener("click", () => {
  timeline.pause();
});
document.getElementById("btn-resume").addEventListener("click", () => {
  timeline.resume();
});
