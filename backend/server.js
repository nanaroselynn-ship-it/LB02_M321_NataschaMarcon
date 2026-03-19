const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
console.log("DEBUG: Welchen Port liest du? ->", process.env.PORT);

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000; 

const dbURL = process.env.MONGO_URL || process.env.MONGO_URI;

mongoose.connect(dbURL)
  .then(() => console.log(" MongoDB ist verbunden Hallelujah!"))
  .catch(err => {
    console.error(" MongoDB Fehler:", err.message);
    console.log("DEBUG: Wurde die URL geladen?", dbURL ? "JA" : "NEIN (Prüfe Variablen-Name in .env)");
  });

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const server = http.createServer(app);
const io = new Server(server); 

io.on("connection", (socket) => {
    console.log("Ein Client hat sich verbunden WUUUUH");
    
    socket.on('chat_nachricht', (msg) => {
        console.log('Nachricht ist angekommen: ' + msg);
        io.emit('chat_nachricht', msg);
    });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
