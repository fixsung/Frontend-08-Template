/*
 * @Author: songyzh
 * @Date: 2021-04-12 13:42:49
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-12 14:19:34
 * @Description:
 */
import { Timeline, Animation } from "./animation";
let timeline = new Timeline();
timeline.add(new Animation({}, "A", 0, 100, 1000));
timeline.start();
