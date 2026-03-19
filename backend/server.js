const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
console.log("DEBUG: Welchen Port liest du? ->", process.env.PORT);

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();

const PORT = process.env.PORT || 3000;
const dbURL = process.env.MONGO_URL || process.env.MONGO_URI;

mongoose.connect(dbURL)
  .then(() => console.log("MongoDB ist verbunden Hallelujah!"))
  .catch(err => {
    console.error("MongoDB Fehler:", err.message);
    console.log("DEBUG: Wurde die URL geladen?", dbURL ? "JA" : "NEIN (Prüfe Variablen-Name in .env)");
  });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", async (socket) => {
  console.log("Ein Client hat sich verbunden WUUUUH", socket.id);

  const oldMessages = await Message.find().sort({ createdAt: 1 });
  socket.emit("oldMessages", oldMessages);

  socket.on("chat_nachricht", async (msg) => {
    console.log("Nachricht ist angekommen:", msg);

    const savedMessage = await Message.create({
      username: msg.username || "Anonym",
      text: msg.text
    });

    io.emit("chat_nachricht", savedMessage);
  });
}); 

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});