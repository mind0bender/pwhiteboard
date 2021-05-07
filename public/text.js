let txtFun = () => {
  cursor("Text");
  layer.textSize(txtSize);
  print(texts);
};

function mousePressed() {
  if (mode === "txt" && isInside) {
    txtPos = createVector(mouseX / width, mouseY / height);
    let data = {
      pos: {
        x: txtPos.x,
        y: txtPos.y,
      },
      txt: "",
      h: colorSlider.value(),
      b: brighSlider.value(),
      size: sizeSlider.value(),
    };
    texts.push(data);
    socket.emit("newText", data);
    currTxt = "";
  }
}

let showTxt = () => {
  txtLayer.clear();
  for (ele of texts) {
    txtLayer.textSize(ele.size);
    txtLayer.colorMode(HSB);
    txtLayer.fill(ele.h, 255, ele.b);
    txtLayer.text(ele.txt, ele.pos.x * width, ele.pos.y * height);
  }
};

function keyPressed() {
  if (mode === "txt" && txtPos != null) {
    if (key == "Backspace") {
      poiLayer.clear();
      if (emojis.includes(currTxt.slice(currTxt.length - 2, currTxt.length))) {
        currTxt = currTxt.slice(0, currTxt.length - 2);
      } else {
        currTxt = currTxt.slice(0, currTxt.length - 1);
      }
    } else if (bannedKeys.includes(key)) {
    } else if (key === "Enter") {
      currTxt += "\n";
    } else {
      currTxt += key;
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-)") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "🙂";
      poiLayer.clear();
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-(") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "🙁";
      poiLayer.clear();
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-|") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "😐";
      poiLayer.clear();
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ";-)") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "😉";
      poiLayer.clear();
    }
    if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-\\") {
      currTxt = currTxt.slice(0, currTxt.length - 3) + "😕";
      poiLayer.clear();
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
