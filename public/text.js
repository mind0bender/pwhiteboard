let txtFun = () => {
  cursor("Text");
  layer.textSize(txtSize);
};

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
      color: [penC.levels[0], penC.levels[1], penC.levels[2]],
      size: sizeSlider.value(),
    };
    texts.push(data);
    socket.emit("newTxt", data);
    currTxt = "";
    focusStealer.focus();
  }
};

let showTxt = () => {
  txtLayer.clear();
  for (ele of texts) {
    let txtCol = color(ele.color[0], ele.color[1], ele.color[2]);
    txtLayer.textSize(ele.size);
    txtLayer.fill(txtCol);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
  for (ele of otherTxt) {
    let txtCol = color(ele.color[0], ele.color[1], ele.color[2]);
    txtLayer.textSize(ele.size);
    txtLayer.fill(txtCol);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
};
