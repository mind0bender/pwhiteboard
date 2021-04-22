const bg = 220;
let layer;
let mode = "pen";
let last = null;
let erSize;
let penSize;
let penC;
let socket;
let poiC;
let poiLayer;
let poiSize;
let cnv;
let controlZone;
let isInside = false;

function setup() {
  // socket = io.connect("https://pwhiteboard.herokuapp.com/");
  socket = io.connect("http://localhost:8080");
  colorMode(HSB);
  poiC = color(random(255), 100, 100, 150);
  penC = color(0);
  colorMode(RGB);
  cnv = createCanvas(window.innerWidth, (window.innerHeight * 2) / 3 - 100);
  controlZone = document.getElementById("defaultCanvas0");
  controlZone.addEventListener(
    "mouseenter",
    function (event) {
      console.log("Enter the zone!");
      isInside = true;
    },
    false
  );
  controlZone.addEventListener(
    "mouseleave",
    function (event) {
      console.log("Leave the zone!");
      isInside = false;
    },
    false
  );
  layer = createGraphics(width, height);
  poiLayer = createGraphics(width, height);
  background(bg);
  erSize = width / 20;
  penSize = width / 500;
  poiSize = width / 20;
  if (poiSize > 30) poiSize = 30;
  socket.on("connection", (data) => {
    let showImg = createImg(data, "");
    showImg.hide();
    layer.image(showImg, 0, 0, width, height);
  });
  socket.on("pen", (data) => {
    colorMode(HSB);
    let pcol = color(data.color.h, 100, data.color.b, 1);
    colorMode(RGB);
    // console.log(pcol);
    layer.stroke(pcol);
    layer.strokeWeight(data.size);
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
    poiLayer.strokeWeight(4);
    if (data.last.x !== data.x || data.last.y !== data.y) {
      poiLayer.line(
        data.last.x * width,
        data.last.y * height,
        data.x * width,
        data.y * height
      );
    }
    poiLayer.noStroke();
    poiLayer.fill(
      data.color.levels[0],
      data.color.levels[1],
      data.color.levels[2],
      150
    );
    poiLayer.ellipse(data.x * width, data.y * height, data.size * width);
  });
  socket.on("poicls", () => {
    poiLayer.clear();
  });

  sizeSlider = createSlider(2, 100, penSize, 2);
  let penbtn = createButton("Pen");
  penbtn.mousePressed(() => {
    if (mode !== "pen") {
      mode = "pen";
      print("Pen Mode!");
    }
    sizeSlider.value(penSize);
  });
  let poibtn = createButton("Pointer");
  poibtn.mousePressed(() => {
    if (mode !== "poi") {
      mode = "poi";
      print("Pointer Mode!");
    }
  });
  let erbtn = createButton("Eraser");
  erbtn.mousePressed(() => {
    if (mode !== "er") {
      mode = "er";
      console.log("Eraser mode!");
      sizeSlider.value(erSize);
    }
  });
  let clsbtn = createButton("Clear");
  clsbtn.mousePressed(() => {
    layer.clear();
    socket.emit("cls");
    console.log("Cleared the Background!");
  });
  createElement("p", "<b>Size</b>").position(
    penbtn.width + erbtn.width + poibtn.width + clsbtn.width + 10,
    height - 12
  );
  sizeSlider.position(
    penbtn.width + erbtn.width + poibtn.width + clsbtn.width + 40,
    height
  );
  sizeSlider.changed(() => {
    if (mode === "pen") {
      penSize = sizeSlider.value();
      console.log("pen :", penSize);
    } else if (mode === "er") {
      erSize = sizeSlider.value();
      console.log("eraser :", erSize);
    }
  });
  createElement("p", "<b>Pen Color</b>").position(
    penbtn.width +
      erbtn.width +
      poibtn.width +
      clsbtn.width +
      50 +
      sizeSlider.width,
    height - 12
  );
  colorSlider = createSlider(0, 360, 0, 30).position(
    penbtn.width +
      erbtn.width +
      poibtn.width +
      clsbtn.width +
      120 +
      sizeSlider.width,
    height
  );
  colorSlider.changed(() => {
    if (brighSlider.value() == 0) {
      alert("You must increase Pen Brightness to see color.");
    }
  });

  createElement("p", "<b>Pen Brightness</b>").position(
    penbtn.width +
      erbtn.width +
      poibtn.width +
      clsbtn.width +
      130 +
      sizeSlider.width +
      colorSlider.width,
    height - 12
  );
  brighSlider = createSlider(0, 100, 0, 5).position(
    penbtn.width +
      erbtn.width +
      poibtn.width +
      clsbtn.width +
      130 +
      sizeSlider.width +
      colorSlider.width +
      110,
    height
  );
  setInterval(() => {
    let imageBase64String = layer.elt.toDataURL();
    socket.emit("layer", imageBase64String);
    console.log("Saved", frameCount);
  }, 5000);
}

function draw() {
  background(bg);
  image(layer, 0, 0);
  image(poiLayer, 0, 0);
  if (isInside) {
    if (mode === "pen") {
      cursor("./pen_cursor.png", -10, -10);
      pen();
    } else if (mode === "poi") {
      cursor("pointer");
      pointer();
    } else if (mode === "er") {
      eraser();
      cursor("./er_cursor.png");
    }
  } else {
    cursor();
    last = null;
    if (mode === "poi") {
      socket.emit("poicls");
    }
  }
}

let pen = () => {
  if (mouseIsPressed) {
    let current = createVector(mouseX, mouseY);
    if (!last) {
      last = current;
    }
    colorMode(HSB);
    penC = color(colorSlider.value(), 100, brighSlider.value());
    colorMode(RGB);
    layer.stroke(penC);
    layer.strokeWeight(penSize);
    layer.line(last.x, last.y, current.x, current.y);
    // console.log(colorSlider.value(), brighSlider.value());
    let data = {
      last: {
        x: last.x / width,
        y: last.y / height,
      },
      curr: {
        x: current.x / width,
        y: current.y / height,
      },
      color: {
        h: colorSlider.value(),
        b: brighSlider.value(),
      },
      size: penSize,
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
  if (last.x !== mouseX || last.y !== mouseY) {
    line(last.x, last.y, mouseX, mouseY);
  }
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
