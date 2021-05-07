let pen = () => {
  if (mouseIsPressed) {
    let current = createVector(mouseX, mouseY);
    if (!last) {
      last = current;
      lLast = current;
    }
    colorMode(HSB);
    penC = color(colorSlider.value(), 100, brighSlider.value());
    colorMode(RGB);
    layer.stroke(penC);
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
      color: {
        h: colorSlider.value(),
        b: brighSlider.value(),
      },
      size: penSize,
    };
    socket.emit("pen", data);
    lLast = last.copy();
    last = current.copy();
  } else {
    last = null;
  }
};

let getPoints = (p1, p2, p3) => {
  let points = [];
  let p4 = p1.copy().add(p2).div(2);
  let p5 = p2.copy().add(p3).div(2);
  let p6 = p1.copy().add(p4).div(2);
  let p8 = p5.copy().add(p3).div(2);
  let p7 = p5.copy().add(p4).div(2);
  let p9 = p6.copy().add(p7).div(2);
  let p10 = p7.copy().add(p8).div(2);
  points = [p1, p6, p9, p10, p8, p3];
  return points;
};

let showLines = (arr) => {
  layer.line(arr[0].x, arr[0].y, arr[1].x, arr[1].y);
  layer.line(arr[1].x, arr[1].y, arr[2].x, arr[2].y);
  layer.line(arr[2].x, arr[2].y, arr[3].x, arr[3].y);
  layer.line(arr[3].x, arr[3].y, arr[4].x, arr[4].y);
  layer.line(arr[4].x, arr[4].y, arr[5].x, arr[5].y);
};
