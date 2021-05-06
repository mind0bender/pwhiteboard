let pointer = () => {
  noStroke();
  fill(poiC.levels[0], poiC.levels[1], poiC.levels[2], 150);
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
