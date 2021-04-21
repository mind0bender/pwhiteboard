const bg = 220;
let layer;
let mode = "pen";
let last = null;
let erSize;
let penSize;
let socket;
let poiC;

function setup() {
  socket = io.connect("http://localhost:8080");
  poiC = color(random(255), random(255), random(255), 150);
  createCanvas(window.innerWidth - 60, window.innerHeight);
  layer = createGraphics(width, height);
  background(bg);
  erSize = width / 10;
  penSize = width / 1000;
  socket.on("pen", (data) => {
    layer.stroke(0);
    layer.strokeWeight(penSize);
    layer.line(
      data.last.x * width,
      data.last.y * height,
      data.curr.x * width,
      data.curr.y * height
    );
  });
  socket.on("cls", () => {
    layer.clear();
  });
  socket.on("erase", (data) => {
    layer.stroke(bg);
    layer.strokeWeight(erSize);
    layer.line(
      data.last.x * width,
      data.last.y * height,
      data.curr.x * width,
      data.curr.y * height
    );
  });
  let penbtn = createButton("Pen");
  penbtn.position(width, 0);
  penbtn.mousePressed(() => {
    if (mode !== "pen") {
      mode = "pen";
      print("Pen Mode!");
    }
  });
  let poibtn = createButton("Pointer");
  poibtn.position(width, 20);
  poibtn.mousePressed(() => {
    if (mode !== "poi") {
      mode = "poi";
      print("Pointer Mode!");
    }
  });
  let erbtn = createButton("Eraser");
  erbtn.position(width, 40);
  erbtn.mousePressed(() => {
    if (mode !== "er") {
      mode = "er";
      console.log("Eraser mode!");
    }
  });
  let clsbtn = createButton("Clear");
  clsbtn.position(width, 60);
  clsbtn.mousePressed(() => {
    layer.clear();
    socket.emit("cls");
    console.log("Cleared the Background!");
  });
}

function draw() {
  background(bg);
  image(layer, 0, 0);
  if (mode === "pen") {
    pen();
  } else if (mode === "poi") {
    pointer();
  } else if (mode === "er") {
    eraser();
  }
}

let pen = () => {
  if (mouseIsPressed) {
    let current = createVector(mouseX, mouseY);
    if (!last) {
      last = current;
    }
    layer.stroke(0);
    layer.strokeWeight(penSize);
    layer.line(last.x, last.y, current.x, current.y);
    let data = {
      last: {
        x: last.x / width,
        y: last.y / height,
      },
      curr: {
        x: current.x / width,
        y: current.y / height,
      },
    };
    socket.emit("pen", data);
    last = current;
  } else {
    last = null;
  }
};

let pointer = () => {
  noStroke();
  fill(poiC);
  ellipse(mouseX, mouseY, 20, 20);
  socket.emit("poi", {
    x: mouseX,
    y: mouseY,
  });
};

let eraser = () => {
  let current = createVector(mouseX, mouseY);
  stroke(50, 100);
  fill(255);
  ellipse(current.x, current.y, erSize);
  if (mouseIsPressed) {
    layer.stroke(bg);
    layer.strokeWeight(erSize);
    if (!last) {
      last = current;
    }
    layer.line(last.x, last.y, current.x, current.y);
    let data = {
      last: {
        x: last.x / width,
        y: last.y / height,
      },
      curr: {
        x: current.x / width,
        y: current.y / height,
      },
    };
    socket.emit("erase", data);
    last = current;
  } else {
    last = null;
  }
};
