/*
 * @Author: songyzh
 * @Date: 2021-04-26 14:43:52
 * @LastEditors: songyzh
 * @LastEditTime: 2021-04-26 17:49:22
 * @Description:
 */
import { parseHTML } from "../src/html_parser";
import assert from "assert";

describe("parse html", function () {
  it("<a></a>", function () {
    let tree = parseHTML("<a></a>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it('<a href="//time.geekbang.org"></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it("<a href ></a>", function () {
    let tree = parseHTML("<a href ></a>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it("<a href id ></a>", function () {
    let tree = parseHTML("<a href id ></a>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it('<a href="//time.geekbang.org" id></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org" id ></a>');
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it('<a href="//time.geekbang.org" id=abc ></a>', function () {
    let tree = parseHTML('<a href="//time.geekbang.org" id=abc ></a>');
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it("<a style=\"color:'#fff'\" />", function () {
    let tree = parseHTML("<a style=\"color:'#fff'\" />");
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it(`<a id='color' />`, function () {
    let tree = parseHTML(`<a id='color' />`);
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it(`<a id = 'color'/>`, function () {
    let tree = parseHTML(`<a id = 'color'/>`);
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it(`<a id = 'color'tee />`, function (done) {
    assert.throws(() => parseHTML(`<a id = 'color'tee />`));
    done();
  });
  it(`<a id =a>`, function () {
    let tree = parseHTML(`<a id =a>`);
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it("<a/>", function () {
    let tree = parseHTML("<a />");
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it("<a>test</a>", function () {
    let tree = parseHTML("<a>test</a>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it("<a>test</span>", function (done) {
    assert.throws(() => parseHTML("<a>test</span>"), {
      name: "Error",
      message: "Tag start end doesn't match!",
    });
    done();
  });

  it('<style>#test{color:"#fff"}</style>', function () {
    let tree = parseHTML('<style>#test{color:"#fff"}</style>');
    assert.strictEqual(tree.children[0].tagName, "style");
  });

  it("<A/>", function () {
    let tree = parseHTML("<A/>");
    assert.strictEqual(tree.children[0].tagName, "A");
  });
  it("<>", function () {
    let tree = parseHTML("<>");
    assert.strictEqual(tree.children[0].type, "text");
  });
  it("</>", function (done) {
    assert.throws(() => parseHTML("</>"));
    done();
  });
  it("</", function (done) {
    assert.throws(() => parseHTML("</"));
    done();
  });
  it("<a id='color'/", function (done) {
    assert.throws(() => parseHTML("<a id='color'/"));
    done();
  });
  it("<a id=/>", function () {
    let tree = parseHTML("<a id=a/>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it("<a*>", function () {
    let tree = parseHTML("<a*>");
    assert.strictEqual(tree.children[0].tagName, "a");
  });
  it(`<a id ="a "  >`, function () {
    let tree = parseHTML(`<a id ="a "  >`);
    assert.strictEqual(tree.children[0].tagName, "a");
  });

  it(`<div id="test" class="color"></div><style>span{color:'blue'} #test .color { color:'red'} </style>`, function () {
    let tree = parseHTML(
      `<div id="test" class="color"></div><style>span {color:'blue'}  #test .color { color:'red'} </style>`
    );
    assert.strictEqual(tree.children[0].tagName, "div");
  });
});
