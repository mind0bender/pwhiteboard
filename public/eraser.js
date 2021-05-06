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
      size: erSize,
    };
    socket.emit("erase", data);
    last = current;
  } else {
    last = null;
  }
};
