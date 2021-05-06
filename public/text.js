let txtFun = () => {
  cursor("Text");
  layer.textSize(txtSize);
  if (mouseIsPressed) {
    txtPos = createVector(mouseX / width, mouseY / height);
    let data = {
      pos: txtPos,
      txt: "",
      h: colorSlider.value(),
      b: brighSlider.value(),
      size: sizeSlider.value(),
    };
    texts.push(data);
    // socket.emit("newText", data)
    currTxt = "";
  }
};

let showTxt = () => {
  txtLayer.clear();
  poiLayer.clear();
  for (ele of texts) {
    txtLayer.textSize(ele.size);
    txtLayer.colorMode(HSB);
    txtLayer.fill(ele.h, 255, ele.b);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
  // print(texts);
};

function keyPressed() {
  if (mode === "txt" && txtPos != null) {
    if (key == "Backspace") {
      currTxt = currTxt.slice(0, currTxt.length - 1);
    } else if (bannedKeys.includes(key)) {
    } else if (key === "Enter") {
      currTxt += "\n";
    } else {
      currTxt += key;
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-)") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "🙂";
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-(") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "🙁";
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-|") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "😐";
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ";-)") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "😉";
    }
    texts[texts.length - 1] = {
      ...texts[texts.length - 1],
      txt: currTxt,
    };
    if (key === "Escape") {
      txtPos = null;
      currTxt = "";
    }
  }
}
