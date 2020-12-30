/*
 * @Author: songyzh
 * @Date: 2020-12-30 10:16:43
 * @LastEditors: songyzh
 * @LastEditTime: 2020-12-30 13:55:41
 */
const GETPARENT = Symbol("get parent");
const GETLEFTCHILD = Symbol("get left child");
const GETRIGHTCHILD = Symbol("get right child");
const CHECKDOWN = Symbol("check down");
const CHECKUP = Symbol("check up");
const SWAP = Symbol("swap");

class binaryHeap {
  constructor(array, compare) {
    this.compare = compare ? compare : (a, b) => a - b;
    this.array = array && Array.isArray(array) ? array : [];
  }
  pop() {
    if (this.length <= 0) {
      console.log("heap is empty.");
      return null;
    }
    if (this.length == 1) {
      return this.array[0];
    }
    let root = this.array[0];
    this[SWAP](0, this.length - 1);
    this.array.pop();
    this[CHECKDOWN](0);
    return root;
  }
  push(data) {
    this.array.push(data);
    this[CHECKUP](this.length - 1);
  }
  buildHeap() {}
  get length() {
    return this.array.length;
  }
  // 下滤操作
  [CHECKDOWN](index) {
    if (index > this.length - 1) {
      return;
    }
    let smallIndex = index;
    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;

    if (leftChildIndex < this.length) {
      let leftChild = this[GETLEFTCHILD](index);
      if (this.compare(leftChild, this.array[smallIndex]) < 0) {
        smallIndex = leftChildIndex;
      }
    }

    if (rightChildIndex < this.length) {
      let rightChild = this[GETRIGHTCHILD](index);
      if (this.compare(rightChild, this.array[smallIndex]) < 0) {
        smallIndex = rightChildIndex;
      }
    }

    if (smallIndex !== index) {
      this[SWAP](index, smallIndex);
      this[CHECKDOWN](smallIndex);
    }
  }
  // 上滤操作
  [CHECKUP](index) {
    if (index === 0) {
      return;
    }
    let current = this.array[index];
    let parent = this[GETPARENT](index);
    let parentIndex = Math.floor((index - 1) / 2);
    if (this.compare(current, parent) < 0) {
      this[SWAP](index, parentIndex);
      this[CHECKUP](parentIndex);
    }
  }
  [SWAP](i, j) {
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
  }
  [GETPARENT](index) {
    return this.array[Math.floor((index - 1) / 2)] || null;
  }
  [GETLEFTCHILD](index) {
    return this.array[2 * index + 1] || null;
  }
  [GETRIGHTCHILD](index) {
    return this.array[2 * index + 2] || null;
  }
}
let heap = new binaryHeap();

// test
heap.push(95);
heap.push(23);
heap.push(47);
heap.push(36);
heap.push(75);

let root;
console.log(heap);
root = heap.pop();
console.log(root);
console.log(heap);
root = heap.pop();
console.log(root);
console.log(heap);
