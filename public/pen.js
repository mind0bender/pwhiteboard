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
