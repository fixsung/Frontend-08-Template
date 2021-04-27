/*
 * @Author: songyzh
 * @Date: 2021-04-26 13:22:09
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-26 14:46:44
 * @Description:
 */
import { add, mul } from "../src/cal.js";
import assert from "assert";

it("1 plus 2 should be 3", function () {
  assert.strictEqual(add(1, 2), 3);
});

it("1 mul 2 should be 2", function () {
  assert.strictEqual(mul(1, 2), 2);
});
