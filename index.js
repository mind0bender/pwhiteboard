require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const blankCanvas = require("./blankCanvas");

let layer = {
  img: blankCanvas,
  txt: [],
};
let layers = [JSON.stringify(layer)];
let index = 0;
let clients = [];

let PORT = process.env.PORT || 8080;
let isDev = process.env.NODE_ENV !== "production";
const app = express();

app.use(express.static("public"));
app.use(cors({}));

let server = app.listen(PORT, () => {
  console.clear();
  console.log(`  Server started on PORT ${PORT} at ${Date()}`);
});

let io = socket(server, { cors: true });

let showAllClients = () => {
  console.clear();
  console.log(`\nServer started on PORT ${PORT} at ${Date()}`);
  console.log();

  if (clients.length > 0) {
    console.log("  Clients connected");
  } else {
    console.log("  No  Clients connected");
  }
  console.log();

  for (let i = 0; i < clients.length; i++) {
    if (!clients[i].disconnected) {
      if (i == clients.length - 1) {
        console.log(`• ${clients[i].name ? clients[i].name : clients[i].id} `);
      } else {
        console.log(`• ${clients[i].name ? clients[i].name : clients[i].id} `);
      }
    }
  }
  console.log(`\n  Total connections: ${clients.length} `);
};

io.sockets.on("connection", (soc) => {
  clients.push(soc);
  showAllClients();
  soc.emit("connection", {
    prevData: JSON.parse(layers[index]),
    id: soc.id,
  });
  soc.broadcast.emit("newClient", soc.id);
  soc.on("pen", (data) => {
    soc.broadcast.emit("pen", {
      ...data,
      id: soc.id,
    });
  });
  soc.on("poi", (data) => {
    soc.broadcast.emit("poi", data);
  });
  soc.on("cls", () => {
    if (layers.length > 50) {
      layers.shift();
    }
    layers.push(JSON.stringify(layer));
    soc.broadcast.emit("cls");
    layer = {
      img: blankCanvas,
      txt: [],
    };
    if (layers.length > 50) {
      layers.shift();
    }
    layers.push(JSON.stringify(layer));
    index = layers.length - 1;
  });
  soc.on("erase", (data) => {
    soc.broadcast.emit("erase", data);
  });
  soc.on("newData", (data) => {
    layer.img = data;
    if (layers.length > 50) {
      layers.shift();
    }
    layers.push(JSON.stringify(layer));
    index = layers.length - 1;
  });
  soc.on("poicls", () => {
    soc.broadcast.emit("poicls");
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
    soc.broadcast.emit("userDisconnect", soc.name ? soc.name : soc.id);
  });
  soc.on("undo", () => {
    if (index > 0) {
      index--;
      soc.emit("undo", JSON.parse(layers[index]));
      soc.broadcast.emit("undo", JSON.parse(layers[index]));
    } else {
      console.log("Sending blankCanvas");
      soc.emit("undo", {
        img: blankCanvas,
        txt: [],
      });
      soc.broadcast.emit("undo", {
        img: blankCanvas,
        txt: [],
      });
    }
  });
  soc.on("redo", () => {
    if (index < layers.length - 1) {
      index++;
      soc.emit("redo", JSON.parse(layers[index]));
      soc.broadcast.emit("redo", JSON.parse(layers[index]));
    } else {
      console.log("Already at latest Canvas");
    }
  });
  soc.on("userData", (data) => {
    soc.broadcast.emit("userData", data);
  });
  soc.on("newName", (data) => {
    if (data && data !== "") {
      soc.name = data;
    }
    showAllClients();
    soc.broadcast.emit("newUser", soc.name ? soc.name : soc.id);
  });
});

module.exports = isDev;
