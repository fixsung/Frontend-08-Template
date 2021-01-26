<!--
 * @Author: songyzh
 * @Date: 2020-12-21 15:35:43
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-21 15:16:15
-->

# 学习笔记

### 什么是 Proxy

> Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等） ----MDN

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

要使得 Proxy 起作用，必须针对 Proxy 实例进行操作，而不是针对目标对象进行操作。

Proxy 有两种使用方式，可以通过 new 关键词调用，或者使用 Proxy.revocable 的静态方法。

```javascript
const target = {};
 ​
 const proxy = new Proxy(target, {
     get (target, key, receiver) {
         return 123;
     }
 })
 ​
 console.log(proxy.getData) // 123 通过 proxy 获取任何的属性的值,这里都会输出123

 let revocable = Proxy.revocable({}, {
  get(target, name) {
    return "[[" + name + "]]";
  }
});
var proxy = revocable.proxy;
proxy.foo;              // "[[foo]]"

revocable.revoke();

console.log(proxy.foo); // 抛出 TypeError
```

## 查缺补漏

- Symbol.for

  如果要重新使用同一个 Symbol 值，可以使用 Symbol.for()方法。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

  ```javascript
  Symbol.for("bar") === Symbol.for("bar");
  // true
  Symbol("bar") === Symbol("bar");
  // false
  ```

  Symbol.for()为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。

- Reflect
  (1) 将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。

  (2) 修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc)则会返回 false。

  (3) Object 操作都变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name)和 Reflect.deleteProperty(obj, name)让它们变成了函数行为。

  (4) Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

- Map
  Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

- CSSOM

> CSS Object Model 是一组允许用 JavaScript 操纵 CSS 的 API。 它是继 DOM 和 HTML API 之后，又一个操纵 CSS 的接口，从而能够动态地读取和修改 CSS 样式。 -MDN

[标准](https://www.w3.org/TR/cssom-view-1/#background)

## Tips

- 当 move 事件挂载在 drag 节点上，拖动过快时容易脱离挂掉。应该挂载在 document 上。
