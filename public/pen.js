let pen = () => {
  if (mouseIsPressed || penHolded) {
    if (!penHolded) {
      if (!lazy) {
        lazy = new LazyBrush({
          radius: 20,
          enabled: true,
          initialPoint: { x: mouseX, y: mouseY },
        });
      }
      colorMode(HSB);
      penC = color(colorSlider.value(), 100, brighSlider.value());
      colorMode(RGB);
      layer.stroke(penC);
      layer.strokeWeight(penSize);

      // Lazy Brush
      lastCords = lazy.getBrushCoordinates();
      let currCords = createVector(mouseX, mouseY);
      if (keysPressed.includes("x") || keysPressed.includes("X")) {
        currCords.y = lastCords.y;
      }
      if (keysPressed.includes("y") || keysPressed.includes("Y")) {
        currCords.x = lastCords.x;
      }
      lazy.update(currCords);
      lazy.setRadius(
        parseInt(
          createVector(mouseX, mouseY).dist(createVector(pmouseX, pmouseY))
        ) * 2
      );
      cords = lazy.getBrushCoordinates();
      layer.line(lastCords.x, lastCords.y, cords.x, cords.y);

      let data = {
        last: {
          x: lastCords.x / width,
          y: lastCords.y / height,
        },
        curr: {
          x: cords.x / width,
          y: cords.y / height,
        },
        color: {
          h: colorSlider.value(),
          b: brighSlider.value(),
        },
        size: penSize / height,
      };
      socket.emit("pen", data);
      last = cords;
      wasActive = isActive;
      isActive = true;
      if (wasActive) {
        sendUserData();
      }
    }
  } else {
    if (wasActive) {
      sendUserData();
    }
    lazy = null;
    isActive = false;
    if (wasActive) {
      setTimeout(() => {
        wasActive = false;
        socket.emit("poicls");
      }, 1000);
    }
  }
};
