let myCls = () => {
  layer.clear();
  poiLayer.clear();
  otherTxt = [];
  texts = [];
};
let sendCls = () => {
  myCls();
  socket.emit("cls");
};
