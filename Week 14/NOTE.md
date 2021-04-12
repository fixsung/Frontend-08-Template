# 学习笔记

## ES6 Class 继承相关

> In a child class constructor, this cannot be used until super is called.
> ES6 class constructors MUST call super if they are subclasses, or they must explicitly return some object to take the place of the one that was not initialized.

## Tips

- 1~n 直接无限循环 只需要当前 index 对 n 取余即可
