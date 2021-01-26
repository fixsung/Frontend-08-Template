/*
 * @Author: songyzh
 * @Date: 2021-01-04 16:33:08
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-05 15:42:47
 */
class View {
  nodeSize = 30;
  nodeStyle = {
    normal: {
      fill: "white",
      "stroke-opacity": 0.2, // the border
    },
    blocked: {
      fill: "grey",
      "stroke-opacity": 0.2,
    },
    start: {
      fill: "#0d0",
      "stroke-opacity": 0.2,
    },
    end: {
      fill: "#e40",
      "stroke-opacity": 0.2,
    },
    opened: {
      fill: "#98fb98",
      "stroke-opacity": 0.2,
    },
    closed: {
      fill: "#afeeee",
      "stroke-opacity": 0.2,
    },
    failed: {
      fill: "#ff8888",
      "stroke-opacity": 0.2,
    },
    tested: {
      fill: "#e5e5e5",
      "stroke-opacity": 0.2,
    },
  };
  nodeColorizeEffect = {
    duration: 50,
  };
  nodeZoomEffect = {
    duration: 200,
    transform: "s1.2", // scale by 1.2x
    transformBack: "s1.0",
  };
  pathStyle = {
    stroke: "yellow",
    "stroke-width": 3,
  };
  supportedOperations = ["opened", "closed", "tested"];
  constructor(
    numCols = 100, //列
    numRows = 100, //行
    ele = "draw_area",
    statsEle = "stats"
  ) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.paper = Raphael(ele);
    this.ele = document.getElementById(ele);
    this.statsEle = document.getElementById(statsEle);
  }

  async generateGrid() {
    let x,
      y,
      rect,
      createRowTask,
      sleep,
      nodeSize = this.nodeSize,
      normalStyle = this.nodeStyle.normal,
      numCols = this.numCols,
      numRows = this.numRows,
      paper = this.paper,
      rects = (this.rects = []),
      statsEle = this.statsEle;

    paper.setSize(numCols * nodeSize, numRows * nodeSize);

    createRowTask = function (rowId) {
      rects[rowId] = [];
      for (let j = 0; j < numCols; ++j) {
        x = j * nodeSize;
        y = rowId * nodeSize;

        rect = paper.rect(x, y, nodeSize, nodeSize);
        rect.attr(normalStyle);
        rects[rowId].push(rect);
      }
      statsEle.innerHTML = `generating grid  ${Math.round(
        ((rowId + 1) / numRows) * 100
      )}%`;
    };

    sleep = function (t = 0) {
      return new Promise((resolve) => {
        setTimeout(resolve, t);
      });
    };

    for (let i = 0; i < numRows; ++i) {
      createRowTask(i);
      await sleep();
    }
  }
  setStartPos(gridX, gridY) {
    var coord = this.toPageCoordinate(gridX, gridY);
    if (!this.startNode) {
      this.startNode = this.paper
        .rect(coord[0], coord[1], this.nodeSize, this.nodeSize)
        .attr(this.nodeStyle.normal)
        .animate(this.nodeStyle.start, 1000);
    } else {
      this.startNode.attr({ x: coord[0], y: coord[1] }).toFront();
    }
  }
  setEndPos(gridX, gridY) {
    var coord = this.toPageCoordinate(gridX, gridY);
    if (!this.endNode) {
      this.endNode = this.paper
        .rect(coord[0], coord[1], this.nodeSize, this.nodeSize)
        .attr(this.nodeStyle.normal)
        .animate(this.nodeStyle.end, 1000);
    } else {
      this.endNode.attr({ x: coord[0], y: coord[1] }).toFront();
    }
  }
  toPageCoordinate(gridX, gridY) {
    return [gridX * this.nodeSize, gridY * this.nodeSize];
  }
  toGridCoordinate(pageX, pageY) {
    return [
      Math.floor(pageX / this.nodeSize),
      Math.floor(pageY / this.nodeSize),
    ];
  }
  setAttributeAt(gridX, gridY, attr, value) {
    let color,
      nodeStyle = this.nodeStyle;
    switch (attr) {
      case "walkable":
        color = value ? nodeStyle.normal.fill : nodeStyle.blocked.fill;
        this.setWalkableAt(gridX, gridY, value);
        break;
      case "opened":
        this.colorizeNode(this.rects[gridY][gridX], nodeStyle.opened.fill);
        this.setCoordDirty(gridX, gridY, true);
        break;
      case "closed":
        this.colorizeNode(this.rects[gridY][gridX], nodeStyle.closed.fill);
        this.setCoordDirty(gridX, gridY, true);
        break;
      case "tested":
        color = value === true ? nodeStyle.tested.fill : nodeStyle.normal.fill;
        this.colorizeNode(this.rects[gridY][gridX], color);
        this.setCoordDirty(gridX, gridY, true);
        break;
      default:
        console.error(`unsupported operation: ${attr}:${value}`);
        return;
    }
  }
  setWalkableAt(gridX, gridY, value) {
    let node,
      blockedNodes = this.blockedNodes;
    if (!blockedNodes) {
      blockedNodes = this.blockedNodes = new Array(
        this.numRows * this.numCols
      ).fill(null);
    }
    node = blockedNodes[gridY * this.numCols + gridX];
    if (value) {
      // clear blocked node
      if (node) {
        this.colorizeNode(node, this.rects[gridY][gridX].attr("fill"));
        this.zoomNode(node);
        setTimeout(function () {
          node.remove();
        }, this.nodeZoomEffect.duration);
        blockedNodes[gridY * this.numCols + gridX] = null;
      }
    } else {
      // draw blocked node
      if (node) {
        return;
      }

      node = blockedNodes[gridY * this.numCols + gridX] = this.rects[gridY][
        gridX
      ].clone();
      this.colorizeNode(node, this.nodeStyle.blocked.fill);
      this.zoomNode(node);
    }
  }
  drawPath(path) {
    if (!path.length) {
      return;
    }
    var svgPath = this.buildSvgPath(path);
    this.path = this.paper.path(svgPath).attr(this.pathStyle);
  }
  buildSvgPath(path) {
    let strs = [],
      size = this.nodeSize;

    strs.push(
      "M" +
        (path[0][0] * size + size / 2) +
        " " +
        (path[0][1] * size + size / 2)
    );
    for (let i = 1; i < path.length; ++i) {
      strs.push(
        "L" +
          (path[i][0] * size + size / 2) +
          " " +
          (path[i][1] * size + size / 2)
      );
    }

    return strs.join("");
  }
  colorizeNode(node, color) {
    node.animate(
      {
        fill: color,
      },
      this.nodeColorizeEffect.duration
    );
  }
  zoomNode(node) {
    node
      .toFront()
      .attr({
        transform: this.nodeZoomEffect.transform,
      })
      .animate(
        {
          transform: this.nodeZoomEffect.transformBack,
        },
        this.nodeZoomEffect.duration
      );
  }
  clearPath() {
    if (this.path) {
      this.path.remove();
    }
  }
  get gridSize() {
    return [this.numCols, this.numRows];
  }
  get nodeSize() {
    return this.nodeSize;
  }
}
