require("dotenv").config();
const chalk = require("chalk");
const express = require("express");
const socket = require("socket.io");
const blankCanvas = require("./blankCanvas");
let layers = [];

let layer = {
  img: blankCanvas,
  txt: [],
};
let index = -1;
let clients = [];

let PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));

let server = app.listen(PORT, () => {
  console.clear();
  console.log(
    chalk.bold(chalk.cyanBright(`Server started on PORT ${PORT} at ${Date()}`))
  );
});

let io = socket(server);

let showAllClients = () => {
  console.clear();
  console.log();
  for (let i = 0; i < clients.length; i++) {
    if (!clients[i].disconnected) {
      if (i == clients.length - 1) {
        console.log(chalk.yellowBright(chalk.bold(`• ${clients[i].id} `)));
      } else {
        console.log(chalk.cyanBright(chalk.bold(`• ${clients[i].id} `)));
      }
    }
  }
  console.log(
    chalk.cyanBright(chalk.bold(`\n  Total connections: ${clients.length} `))
  );
};

io.sockets.on("connection", (soc) => {
  clients.push(soc);
  showAllClients();
  if (layer.img !== blankCanvas) {
    soc.emit("connection", layer);
  }
  soc.on("pen", (data) => {
    soc.broadcast.emit("pen", data);
  });
  soc.on("poi", (data) => {
    soc.broadcast.emit("poi", data);
  });
  soc.on("cls", () => {
    layers.push(JSON.stringify(layer));
    soc.broadcast.emit("cls");
    layer = {
      img: blankCanvas,
      txt: [],
    };
    layers.push(JSON.stringify(layer));
    index = layers.length;
  });
  soc.on("erase", (data) => {
    soc.broadcast.emit("erase", data);
  });
  soc.on("newData", (data) => {
    layer.img = data;
    layers.push(JSON.stringify(layer));
    index = layers.length;
    console.log("NewData", index);
  });
  soc.on("poicls", () => {
    soc.broadcast.emit("poicls");
  });
  soc.on("mic", (data) => {
    soc.broadcast.emit("mic", data);
  });
  soc.on("newTxt", (data) => {
    soc.broadcast.emit("newTxt", data);
    layer.txt.push(data);
  });
  soc.on("txtData", (data) => {
    soc.broadcast.emit("txtData", data);
    layer.txt[layer.txt.length - 1] = {
      ...layer.txt[layer.txt.length - 1],
      txt: data,
    };
  });
  soc.on("disconnect", () => {
    clients.splice(clients.indexOf(soc), 1);
    showAllClients();
  });
  soc.on("undo", () => {
    if (index > 0) {
      index--;
      console.log(layers[index] == layers[index - 1]);
      soc.emit("undo", JSON.parse(layers[index]));
      soc.broadcast.emit("undo", JSON.parse(layers[index]));
      console.log("Undoing", index);
    }
  });
});
