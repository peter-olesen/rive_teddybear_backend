const express = require("express");
const app = express();
const http = require("http");
const PORT = 3000;

// Create Express http server
const server = http.createServer(app);

// Server listens on port
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// Initialize Socket IO on server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

// Here we need to create the states for the rive animation and
// set up an interval that updates the values

let hungerLevel = 100;
let isSad = false;

setInterval(() => {
  if (hungerLevel > 0) {
    hungerLevel = hungerLevel - 0.2;
    if (hungerLevel < 70) {
      isSad = true;
    } else {
      isSad = false;
    }

    io.sockets.emit("status", { hunger: hungerLevel, isSad: isSad });
  }
}, 1000);

io.sockets.on("connection", function (socket) {
  socket.on("feed", (data) => {
    if (hungerLevel <= 90) {
      hungerLevel = hungerLevel + 10;
    } else {
      hungerLevel = 100;
    }
    // console.log("Recieved feed ping: ", data);
    io.sockets.emit("feed", { hunger: hungerLevel, isSad: isSad });
  });
});
