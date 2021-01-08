<!--
 * @Author: songyzh
 * @Date: 2020-12-21 15:35:43
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-07 15:44:02
-->

# 学习笔记

## 产生式

语法定义多数采用 BNF,JavaScript 标准里面就是一种跟 BNF 类似的自创语法。不过语法定义的核心思想不会变，都是几种结构的组合产生一个新的结构，所以语法定义也叫语法产生式。

## RegExp.prototype.exec()

exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。在设置了 global 或 sticky 标志位的情况下（如 /foo/g or /foo/y），JavaScript RegExp 对象是有状态的。他们会将上次成功匹配后的位置记录在 lastIndex 属性中。使用此特性，exec() 可用来对单个字符串中的多次匹配结果进行逐条的遍历（包括捕获到的匹配），而相比之下， String.prototype.match() 只会返回匹配到的结果。

## 有限状态机

有限状态机是一种用来进行对象行为建模的工具，其作用主要是描述对象在它的生命周期内所经历的状态序列，以及如何响应来自外界的各种事件。
