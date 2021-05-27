function keyPressed() {
  if (!keysPressed.includes(key)) {
    keysPressed.push(key);
  }
  if (
    keysPressed.includes("Control") &&
    (key == "z" || key == "Z" || key == "y" || key == "Y")
  ) {
    if (key == "y" || key == "Y") {
      lastKeys.push("Control");
      socket.emit("redo");
    } else {
      lastKeys.push("Control");
      socket.emit("undo");
    }
  } else {
    if (mode === "txt" && txtPos != null && isInside) {
      if (!willUpdate) {
        setTimeout(() => {
          sendNewData();
          willUpdate = false;
        }, 1000);
        willUpdate = true;
      }

      if (key == "Backspace") {
        poiLayer.clear();
        socket.emit("poicls");
        if (
          emojis.includes(currTxt.slice(currTxt.length - 2, currTxt.length))
        ) {
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
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-(") {
        currTxt = currTxt.slice(0, currTxt.length - 3) + "🙁";
        poiLayer.clear();
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-|") {
        currTxt = currTxt.slice(0, currTxt.length - 3) + "😐";
        poiLayer.clear();
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 3, currTxt.length) === ";-)") {
        currTxt = currTxt.slice(0, currTxt.length - 3) + "😉";
        poiLayer.clear();
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-\\") {
        currTxt = currTxt.slice(0, currTxt.length - 3) + "😕";
        poiLayer.clear();
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 2, currTxt.length) === ":P") {
        currTxt = currTxt.slice(0, currTxt.length - 2) + "🤪";
        poiLayer.clear();
        socket.emit("poicls");
      }
      if (currTxt.slice(currTxt.length - 3, currTxt.length) === ":-<") {
        currTxt = currTxt.slice(0, currTxt.length - 3) + "👿";
        poiLayer.clear();
        socket.emit("poicls");
      }
      texts[texts.length - 1] = {
        ...texts[texts.length - 1],
        txt: currTxt,
      };
      if (key === "Escape") {
        txtPos = null;
        currTxt = "";
      }
      socket.emit("txtData", currTxt);
      socket.emit("poicls");
    }
    lastKeys.push(key);
  }
}

function keyReleased() {
  indexOfKey = keysPressed.indexOf(key);
  keysPressed.splice(indexOfKey, 1);
}
