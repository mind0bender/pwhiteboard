const chalk = require("chalk");
const express = require("express");
const socket = require("socket.io");

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

io.sockets.on("connection", (soc) => {
  console.log(chalk.bgCyan(chalk.black(chalk.bold(`Got a new Connection`))));
  console.log("id :", soc.id);
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
});
