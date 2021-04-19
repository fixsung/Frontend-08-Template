/*
 * @Author: songyzh
 * @Date: 2021-04-16 16:25:42
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-16 16:30:12
 * @Description:
 */
import { liner } from "./ease";
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const STARTTIME = Symbol("start-time");
const PAUSE_STARTTIME = Symbol("pause_starttime");
const PAUSE_TIME = Symbol("pause_time");
export class Timeline {
  constructor() {
    this.state = "Inited";
    this[ANIMATIONS] = new Set();
    this[STARTTIME] = new Map();
  }
  start() {
    if (this.state !== "Inited") return;
    this.state = "Started";
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[STARTTIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        } else {
          t =
            now -
            this[STARTTIME].get(animation) -
            this[PAUSE_TIME] -
            animation.delay;
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        if (t > 0) animation.receive(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  pause() {
    if (this.state !== "Started") return;
    this.state = "Pause";
    this[PAUSE_STARTTIME] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    if (this.state !== "Pause") return;
    this.state = "Started";
    this[PAUSE_TIME] += Date.now() - this[PAUSE_STARTTIME];
    this[TICK]();
  }
  reset() {
    this.pause();
    this.state = "Inited";

    this[PAUSE_TIME] = 0;
    this[PAUSE_STARTTIME] = 0;
    this[ANIMATIONS] = new Set();
    this[STARTTIME] = new Map();
    this[TICK_HANDLER] = null;
  }
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[STARTTIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction = liner,
    template
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
    this.range = this.endValue - this.startValue;
  }

  receive(time) {
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(
      this.startValue + this.range * progress
    );
  }
}
