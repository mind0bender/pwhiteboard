let pointer = () => {
  if (!lazy) {
    lazy = new LazyBrush({
      radius: 20,
      enabled: true,
      initialPoint: { x: mouseX, y: mouseY },
    });
  }
  noStroke();
  fill(poiC.levels[0], poiC.levels[1], poiC.levels[2], 150);
  lazy.update({ x: mouseX, y: mouseY });
  lazy.setRadius(
    parseInt(
      createVector(mouseX, mouseY).dist(createVector(pmouseX, pmouseY))
    ) * 2
  );
  cords = lazy.getBrushCoordinates();
  poiPos.push({
    x: cords.x / width,
    y: cords.y / height,
  });
  if (!mouseIsPressed) {
    while (poiPos.length > 10) {
      poiPos.shift();
    }
  }

  ellipse(cords.x, cords.y, poiSize);
  showPois();
  socket.emit("poi", {
    x: cords.x / width,
    y: cords.y / height,
    color: poiC,
    size: poiSize / width,
    arr: poiPos,
  });
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
