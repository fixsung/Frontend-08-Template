<!--
 * @Author: songyzh
 * @Date: 2020-12-21 15:35:43
 * @LastEditors: songyzh
 * @LastEditTime: 2020-12-22 15:30:02
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
