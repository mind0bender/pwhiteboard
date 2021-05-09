const chalk = require("chalk");
const express = require("express");
const socket = require("socket.io");
let layer = {
  img: null,
  txt: [],
};
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
  if (layer.img !== null) {
    soc.emit("connection", layer);
  }
  soc.on("pen", (data) => {
    soc.broadcast.emit("pen", data);
  });
  soc.on("poi", (data) => {
    soc.broadcast.emit("poi", data);
  });
  soc.on("cls", () => {
    soc.broadcast.emit("cls");
  });
  soc.on("erase", (data) => {
    soc.broadcast.emit("erase", data);
  });
  soc.on("newData", (data) => {
    layer = data;
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
});
