/*
 * @Author: songyzh
 * @Date: 2021-01-05 10:36:25
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-06 19:16:01
 */
const sleep = (t = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};
class Controller extends StateMachine {
  constructor(view, ...options) {
    super({
      init: "null",
      transitions: [
        {
          name: "init",
          from: "null",
          to: "ready",
        },
        {
          name: "search",
          from: "starting",
          to: "searching",
        },
        {
          name: "pause",
          from: "searching",
          to: "paused",
        },
        {
          name: "finish",
          from: "searching",
          to: "finished",
        },
        {
          name: "resume",
          from: "paused",
          to: "searching",
        },
        {
          name: "cancel",
          from: "paused",
          to: "ready",
        },
        {
          name: "modify",
          from: "finished",
          to: "modified",
        },
        {
          name: "reset",
          from: "*",
          to: "ready",
        },
        {
          name: "clear",
          from: ["finished", "modified"],
          to: "ready",
        },
        {
          name: "start",
          from: ["ready", "modified", "restarting"],
          to: "starting",
        },
        {
          name: "restart",
          from: ["searching", "finished"],
          to: "restarting",
        },
        {
          name: "dragStart",
          from: ["ready", "finished"],
          to: "draggingStart",
        },
        {
          name: "dragEnd",
          from: ["ready", "finished"],
          to: "draggingEnd",
        },
        {
          name: "drawWall",
          from: ["ready", "finished"],
          to: "drawingWall",
        },
        {
          name: "eraseWall",
          from: ["ready", "finished"],
          to: "erasingWall",
        },
        {
          name: "rest",
          from: ["draggingStart", "draggingEnd", "drawingWall", "erasingWall"],
          to: "ready",
        },
        {
          name: "goto",
          from: "*",
          to: function (s) {
            return s;
          },
        },
      ],
    });
    this.operationsPerSecond = options.operationsPerSecond || 300;
    this.view = view;
    this.gridSize = this.view.gridSize;
    this.pathFinder = new PathFinder(this.gridSize);
    this.buttons = document.getElementsByClassName("control_button");
  }
  // stateMachine instance protoType function
  onLeaveNull() {
    this.setDefaultStartEndPos();
    this.bindEvents();
    this.hookPathFinding(this);
  }
  onReady() {
    console.log("=> ready");
    this.setButtonStates(
      {
        id: 1,
        text: "Start Search",
        enabled: true,
        callback: () => {
          this.start();
        },
      },
      {
        id: 2,
        text: "Pause Search",
        enabled: false,
      },
      {
        id: 3,
        text: "Clear Walls",
        enabled: true,
        callback: () => {
          this.reset();
        },
      }
    );
    // => [starting, draggingStart, draggingEnd, drawingStart, drawingEnd]
  }
  async onStarting() {
    console.log("=> starting");
    // Clears any existing search progress
    // this.clearFootprints();
    this.setButtonStates({
      id: 2,
      enabled: true,
    });
    setTimeout(() => this.search(), 0);

    // => searching
  }
  onSearch({ event, from, to }) {
    console.log(event, from, to);
    let timeStart = window.performance ? performance.now() : Date.now();
    this.path = this.pathFinder.findPath(
      [this.startX, this.startY],
      [this.endX, this.endY]
    );
    console.log(this.path);
    this.operationCount = this.operations.length;
    let timeEnd = window.performance ? performance.now() : Date.now();
    this.timeSpent = (timeEnd - timeStart).toFixed(4);

    // this.loop();
    // => searching
  }
  hookPathFinding(controller) {
    let nodeMixin = {
  
      // get opened() {
      //   return this._opened;
      // },
      // set opened(v) {
      //   console.log("aaaa");
      //   this._opened = v;
      //   controller.operations.push({
      //     x: this.x,
      //     y: this.y,
      //     attr: "opened",
      //     value: v,
      //   });
      // },
      // get closed() {
      //   return this._closed;
      // },
      // set closed(v) {
      //   this._closed = v;
      //   controller.operations.push({
      //     x: this.x,
      //     y: this.y,
      //     attr: "closed",
      //     value: v,
      //   });
      // },
      // get tested() {
      //   return this._tested;
      // },
      // set tested(v) {
      //   this._tested = v;
      //   controller.operations.push({
      //     x: this.x,
      //     y: this.y,
      //     attr: "tested",
      //     value: v,
      //   });
      // },
    };

    debugger;
    Object.assign(GridNode.prototype, nodeMixin);
    let node = new GridNode(1, 1);
    node.test();
    this.operations = [];
  }
  onDrawWall({ event, from, to }, gridX, gridY) {
    this.setWalkableAt(gridX, gridY, false);
    // => drawingWall
  }
  setDefaultStartEndPos() {
    let nodeSize = this.view.nodeSize;
    let centerX = Math.ceil(document.body.clientWidth / 2 / nodeSize),
      centerY = Math.floor(document.body.clientHeight / 2 / nodeSize);

    this.setStartPos(centerX - 5, centerY);
    this.setEndPos(centerX + 5, centerY);
  }

  setStartPos(gridX, gridY) {
    this.startX = gridX;
    this.startY = gridY;
    this.view.setStartPos(gridX, gridY);
  }
  setEndPos(gridX, gridY) {
    this.endX = gridX;
    this.endY = gridY;
    this.view.setEndPos(gridX, gridY);
  }
  bindEvents() {
    this.view.ele.addEventListener("mousedown", (event) => {
      this.mousedown(event);
    });
    document.addEventListener("mousemove", (event) => {
      this.mousemove(event);
    });
    document.addEventListener("mouseup", (event) => {
      this.mouseup(event);
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("selectstart", (e) => {
      e.preventDefault();
    });
  }
  mousedown(event) {
    let coord = this.view.toGridCoordinate(event.pageX, event.pageY),
      gridX = coord[0],
      gridY = coord[1];

    if (this.can("dragStart") && this.isStartPos(gridX, gridY)) {
      this.dragStart();
      return;
    }
    if (this.can("dragEnd") && this.isEndPos(gridX, gridY)) {
      this.dragEnd();
      return;
    }
    if (this.can("drawWall") && this.pathFinder.isWalkableAt(gridX, gridY)) {
      this.drawWall(gridX, gridY);
      return;
    }
    if (this.can("eraseWall") && !this.pathFinder.isWalkableAt(gridX, gridY)) {
      this.eraseWall(gridX, gridY);
    }
  }
  mousemove(event) {
    let coord = this.view.toGridCoordinate(event.pageX, event.pageY),
      gridX = coord[0],
      gridY = coord[1];

    if (this.isStartOrEndPos(gridX, gridY)) {
      return;
    }

    switch (this.state) {
      case "draggingStart":
        if (grid.isWalkableAt(gridX, gridY)) {
          this.setStartPos(gridX, gridY);
        }
        break;
      case "draggingEnd":
        if (grid.isWalkableAt(gridX, gridY)) {
          this.setEndPos(gridX, gridY);
        }
        break;
      case "drawingWall":
        this.setWalkableAt(gridX, gridY, false);
        break;
      case "erasingWall":
        this.setWalkableAt(gridX, gridY, true);
        break;
    }
  }
  mouseup() {
    if (this.can("rest")) {
      this.rest();
    }
  }
  isStartPos(gridX, gridY) {
    return gridX === this.startX && gridY === this.startY;
  }
  isEndPos(gridX, gridY) {
    return gridX === this.endX && gridY === this.endY;
  }
  isStartOrEndPos(gridX, gridY) {
    return this.isStartPos(gridX, gridY) || this.isEndPos(gridX, gridY);
  }
  setWalkableAt(gridX, gridY, walkable) {
    this.pathFinder.setWalkableAt(gridX, gridY, walkable);
    this.view.setAttributeAt(gridX, gridY, "walkable", walkable);
  }

  loop() {}
  setButtonStates(...args) {
    Array.prototype.forEach.call(args, (opt) => {
      let button = this.buttons[opt.id - 1];
      if (opt.text) {
        button.innerHTML = opt.text;
      }
      if (opt.callback) {
        button.addEventListener("click", opt.callback);
      }
      if (opt.enabled === undefined) {
        return;
      } else if (opt.enabled) {
        button.removeAttribute("disabled");
      } else {
        button.setAttribute("disabled", "disabled");
      }
    });
  }
}
