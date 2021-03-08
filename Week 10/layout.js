/*
 * @Author: songyzh
 * @Date: 2021-03-04 15:12:44
 * @LastEditors: songyzh
 * @LastEditTime: 2021-03-08 14:07:49
 */
function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  const elementStyle = getStyle(element);
  if (elementStyle.display != "flex") {
    return;
  }
  let items = element.children.filter((e) => e.type === "element");
  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  let style = element.style;

  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] == "") {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.alginItems || style.alginItems === "auto") {
    style.alginItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap) {
    style.flexWrap = "nowrap";
  }

  if (!style.alginContent || style.alginContent === "auto") {
    style.alginContent = "stretch";
  }

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = 1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === "wrap-reverse") {
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = -1;
  }

  let isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  let flexLine = [];
  let flexLines = [flexLine];
  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace = itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] != void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        flexLine.push(item);
      }
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [];
        flexLines.push(flexLine);
        flexLine.push(item);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace = itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;

  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] != void 0 ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((items) => {
      let mainSpace = items.mainSpace;
      let flexTotal = 0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        if (itemStyle.flex !== null && itemStyle.flex != void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      if (flexTotal > 0) {
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        if (style.justifyContent == "flex-start") {
          let currentMain = mainBase;
          let step = 0;
        }
        if (style.justifyContent == "flex-end") {
          let currentMain = mainSpce * mainSign + mainBase;
          let step = 0;
        }
        if (style.justifyContent == "center") {
          let currentMain = (mainSpce / 2) * mainSign + mainBase;
          let step = 0;
        }
        if (style.justifyContent == "space-between") {
          let currentMain = mainBase;
          let step = (mainSpace / (items.length - 1)) * mainSign;
        }
        if (style.justifyContent == "space-around") {
          let currentMain = step / 2 + mainBase;
          let step = (mainSpace / items.length) * mainSign;
        }

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }

  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] =
        elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length;

  let step;

  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  }

  if (style.alignContent == "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  }

  if (style.alignContent == "center") {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  }
  if (style.alignContent == "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }

  if (style.alginContent == "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  }

  if (style.alignContent === "stretch") {
    crossBase += 0;
    step = 0;
  }

  flexLines.forEach((items) => {
    let lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      let align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] == null) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }

      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === "center") {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0
              ? itemStyle[crossSize]
              : lineCrossSize);
        itemStyle[crossSize] =
          crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
}

function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    let p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9/.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

module.exports = layout;
