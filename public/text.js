let txtFun = () => {
  cursor("Text");
  layer.textSize(txtSize);
};

function mousePressed() {
  newTxt();
}

let newTxt = (
  initPos = createVector(mouseX / width, mouseY / height),
  initTxt = ""
) => {
  if (mode === "txt" && isInside) {
    txtPos = initPos;
    let data = {
      pos: {
        x: txtPos.x,
        y: txtPos.y,
      },
      txt: initTxt,
      h: colorSlider.value(),
      b: brighSlider.value(),
      size: sizeSlider.value(),
    };
    texts.push(data);
    socket.emit("newTxt", data);
    currTxt = "";
  }
};

let showTxt = () => {
  txtLayer.clear();
  for (ele of texts) {
    txtLayer.textSize(ele.size);
    txtLayer.colorMode(HSB);
    txtLayer.fill(ele.h, 255, ele.b);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
  for (ele of otherTxt) {
    txtLayer.textSize(ele.size);
    txtLayer.colorMode(HSB);
    txtLayer.fill(ele.h, 255, ele.b);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
};
