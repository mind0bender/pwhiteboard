var sendNewData = () => {
  let imageBase64String = layer.elt.toDataURL();
  socket.emit("newData", imageBase64String);
  console.log("Saved", frameCount);
};
