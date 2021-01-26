/*
 * @Author: songyzh
 * @Date: 2021-01-05 13:12:33
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-06 18:48:23
 */
class GridNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cost = 0;
    this.parent = null;
  }
}
class PathFinder {
  constructor(gridSize) {
    this.numCols = gridSize[0];
    this.numRows = gridSize[1];
    this.grid = new Array(this.numCols * this.numRows).fill(1);
  }

  findPath(start, end) {
    this.map = Object.create(this.grid);
    this.start = new GridNode(start[0], start[1]);
    this.end = new GridNode(end[0], end[1]);
    this.openList = new BinaryHeap([this.start], (p1, p2) => {
      return this.distance(p1) - this.distance(p2);
    });

    while (!this.openList.empty()) {
      let current = this.openList.pop();
      current.closed = true;
      if (this.equal(current, this.end)) {
        return this.backtrace(current);
      }
      let neighbors = this.getNeighbors(current);
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!neighbor || neighbor.closed) {
          continue;
        }
        let cost =
          current.cost +
          (current.x - neighbor.x === 0 || current.y - neighbor.y === 0
            ? 1
            : 1.4);

        if (!neighbor.opened || cost < neighbor.cost) {
          neighbor.parent = current;
          neighbor.cost = cost;
          if (!neighbor.opened) {
            neighbor.opened = true;
            this.openList.push(neighbor);
            this.map[this.getIndex(neighbor.x, neighbor.y)] = neighbor;
          }
        }
      }
    }
    console.log("test");
    return [];
  }
  getNeighbors({ x, y }) {
    let points = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
    ];
    return points.map((point) => {
      let walkable = true,
        node;
      if (
        point[0] < 0 ||
        point[0] > this.numCols ||
        point[1] < 0 ||
        point[1] > this.numRows
      ) {
        return null;
      } else {
        let temp = this.map[this.getIndex(point[0], point[1])];
        if (typeof temp === "number") {
          walkable = Boolean(temp);
        } else if (typeof temp === "object") {
          node = temp;
          return node;
        }
      }
      node = new GridNode(point[0], point[1]);
      if (!walkable) {
        node.closed = true;
      }
      return node;
    });
  }
  getIndex(x, y) {
    return y * this.numCols + x;
  }
  equal(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
  }
  backtrace(node) {
    let path = [[node.x, node.y]];
    while (node.parent) {
      node = node.parent;
      path.push([node.x, node.y]);
    }
    return path.reverse();
  }
  setWalkableAt(gridX, gridY, value) {
    let flag = value ? 1 : 0;
    // if (gridX == this.start.x && gridY == this.start.y) {
    //   return;
    // }
    // if (gridX == this.end.x && gridY == this.end.y) {
    //   return;
    // }
    this.grid[gridY * this.numCols + gridX] = flag;
  }
  isWalkableAt(gridX, gridY) {
    return this.grid[gridY * this.numCols + gridX];
    y;
  }
  distance(point) {
    return (point.x - this.end.x) ** 2 + (point.y - this.end.y) ** 2;
  }
}
