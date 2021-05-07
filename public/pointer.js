let pointer = () => {
  noStroke();
  fill(poiC.levels[0], poiC.levels[1], poiC.levels[2], 150);
  if (!last) {
    last = createVector(mouseX, mouseY);
  }
  poiPos.push({
    x: mouseX / width,
    y: mouseY / height,
  });
  if (mouseIsPressed) {
    thrs = 50;
  } else {
    thrs = 10;
  }
  while (poiPos.length > thrs) {
    poiPos.shift();
  }
  ellipse(mouseX, mouseY, poiSize);
  showPois();
  socket.emit("poi", {
    last: {
      x: last.x / width,
      y: last.y / height,
    },
    x: mouseX / width,
    y: mouseY / height,
    color: poiC,
    size: poiSize / width,
    arr: poiPos,
  });
  last = createVector(mouseX, mouseY);
};

let showPois = () => {
  beginShape();
  for (pos of poiPos) {
    stroke(poiC);
    strokeWeight(4);
    vertex(pos.x * width, pos.y * height);
  }
  endShape();
};
