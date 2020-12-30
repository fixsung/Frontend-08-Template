/*
 * @Author: songyzh
 * @Date: 2020-12-28 16:45:45
 * @LastEditors: songyzh
 * @LastEditTime: 2020-12-28 17:12:38
 */
class Sorted {
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare ? compare : (a, b) => a - b;
  }
  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }
    // O(1)相较于slice效率更高
    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }
  give(v) {
    this.data.push(v);
  }

  get length() {
    return this.data.length;
  }
}

function test() {
  let testArr = new Sorted([1, 2, 3, 4, 5, 6]);
  let length = testArr.length;
  for (let i = 0; i < length; i++) {
    console.log(testArr.take());
  }
}
test();
