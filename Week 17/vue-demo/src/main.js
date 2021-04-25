/*
 * @Author: songyzh
 * @Date: 2021-04-25 10:57:34
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-25 15:25:13
 * @Description:o
 */
import HelloWorld from "./helloworld.vue";
import Vue from "vue";
var app = new Vue({
  el: "#app",
  render: (h) => h(HelloWorld),
});
