const path = require("path");
let users = [];

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
console.log("DEBUG: Welchen Port liest du? ->", process.env.PORT);

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const User = require("./models/User");
const app = express();

const PORT = process.env.PORT || 3000;
const dbURL = process.env.MONGO_URL || process.env.MONGO_URI;

mongoose.connect(dbURL)
  .then(() => console.log("MongoDB ist verbunden Hallelujah!"))
  .catch(err => {
    console.error("MongoDB Fehler:", err.message);
    console.log("DEBUG: Wurde die URL geladen?", dbURL ? "JA" : "NEIN");
  });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", async (socket) => {
  console.log("Ein Client hat sich verbunden WUUUUH", socket.id);

  const oldMessages = await Message.find().sort({ createdAt: 1 });
  socket.emit("oldMessages", oldMessages);

  socket.on("join", async (username) => {
  socket.username = username || "Anonym";

  try {
   
    let existingUser = await User.findOne({ username: socket.username });

    if (!existingUser) {
      await User.create({ username: socket.username });
      console.log("User gespeichert:", socket.username);
    }
  } catch (err) {
    console.error("Fehler beim Speichern des Users:", err.message);
  }

  if (!users.includes(socket.username)) {
    users.push(socket.username);
  }

  io.emit("user_list", users);
  console.log("Online Benutzer:", users);
});

  socket.on("chat_nachricht", async (msg) => {
    console.log("Nachricht ist angekommen:", msg);

    const savedMessage = await Message.create({
      username: msg.username || "Anonym",
      text: msg.text
    });

    io.emit("chat_nachricht", savedMessage);
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u !== socket.username);
    io.emit("user_list", users);
    console.log("Benutzer getrennt, online:", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});