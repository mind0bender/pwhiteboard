const bg = 220;
let layer;
let mode = "pen";
let last = null;
let erSize;
let penSize;
let socket;
let poiC;
let poiLayer;
let poiSize;

function setup() {
  socket = io.connect("https://pwhiteboard.herokuapp.com/");
  poiC = color(random(255), random(255), random(255), 150);
  let cnv = createCanvas(window.innerWidth - 60, window.innerHeight);
  layer = createGraphics(width, height);
  poiLayer = createGraphics(width, height);
  background(bg);
  erSize = width / 10;
  penSize = width / 1000;
  poiSize = width / 20;
  if (poiSize > 30) poiSize = 30;
  socket.on("connection", (data) => {
    let showImg = createImg(data, "");
    console.log(data);
    showImg.hide();
    layer.image(showImg, 0, 0, width, height);
  });
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

  socket.on("poi", (data) => {
    poiLayer.stroke(
      data.color.levels[0],
      data.color.levels[1],
      data.color.levels[2],
      150
    );
    poiLayer.clear();
    console.log(data.last);
    poiLayer.strokeWeight(4);
    poiLayer.line(
      data.last.x * width,
      data.last.y * height,
      data.x * width,
      data.y * height
    );
    poiLayer.noStroke();
    poiLayer.fill(
      data.color.levels[0],
      data.color.levels[1],
      data.color.levels[2],
      150
    );
    poiLayer.ellipse(data.x * width, data.y * height, data.size * width);
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
  setInterval(() => {
    let imageBase64String = layer.elt.toDataURL();
    socket.emit("layer", imageBase64String);
  }, 10000);
}

function draw() {
  background(bg);
  image(layer, 0, 0);
  image(poiLayer, 0, 0);
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
  if (!last) {
    last = createVector(mouseX, mouseY);
  }
  ellipse(mouseX, mouseY, poiSize);
  stroke(poiC);
  strokeWeight(4);
  line(last.x, last.y, mouseX, mouseY);
  socket.emit("poi", {
    last: {
      x: last.x / width,
      y: last.y / height,
    },
    x: mouseX / width,
    y: mouseY / height,
    color: poiC,
    size: poiSize / width,
  });
  last = createVector(mouseX, mouseY);
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
