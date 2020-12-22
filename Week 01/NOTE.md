<!--
 * @Author: songyzh
 * @Date: 2020-12-21 15:35:43
 * @LastEditors: songyzh
 * @LastEditTime: 2020-12-22 16:38:21
-->

# 学习笔记

## 编码 Tips

### CSS

- 水平垂直居中(不定宽高)：

```css
// 父级元素必须设置height属性
.center {
  text-align: center;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
```

### JavaScript

- for 循环中 `var` 及 `let`的区别

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  // 作用域a
  a[i] = function () {
    // 作用域b
    console.log(i);
  };
}
a[6](); // 10
```

```javascript
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```

具体原因：
在后面的代码片段中，for 循环头部的`let`不仅把 i 绑定到了 for 循环的块中，事实上他将其重新绑定到了循环的每一个迭代中，确保使用上一个循环结束时的值重新进行赋值类似下面这种方式

```javascript
{
  let j;
  for(j=0;j<10;j++>){
    //创建一个新变量
    let i = j;
    a[i] = function () {
       console.log(i);
    };
  }
}
```

### Tips

- 满足交换律的运算都可以采用最终计算结果来控制变量的值交替变化

```
let color = 1;
while(true){
  color = 3 - color; // 2->1->2->1-> ……
}

```

## 个人思考

以往写代码一直采用的是线性的思维方式，不自觉的会采用最省脑力的方式去实现功能，拿变量由 2 变 1 由 1 变 2 来举例，按自己的思维方式肯定是采用`if else`的方式来进行赋值，而不会想到这个变换时符合交换律的可以采用更取巧的方式来实现。在后续编码过程中，要时刻提醒自己，是不是又更好的解决思路，多动动脑筋，不至思维变得僵化。

另外基础性知识还需要时时刻刻去复习，用惯了框架，很多底层的内容全部被框架屏蔽掉了，许久不用导致很多基础知识变得生疏，`cssList`这个属性相关的`api`都有点陌生。
