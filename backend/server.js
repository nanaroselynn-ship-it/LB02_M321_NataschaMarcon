
const path = require("path"); // node.js module to work with file paths
let users = []; // array to store currently online users

require("dotenv").config({ path: path.join(__dirname, "..", ".env") }); // load env variables from env file

const express = require("express"); // import express framework
console.log("DEBUG: Welchen Port liest du? ->", process.env.PORT); // debug check which port is loaded

const http = require("http"); // HTTP module needed for socket.io
const { Server } = require("socket.io"); // import socket.io server
const mongoose = require("mongoose"); // mongodb ORM
const Message = require("./models/Message"); // message model monogDB
const User = require("./models/User"); // user model mongoDB
const app = express(); // create express app

const PORT = process.env.PORT || 3000; // define serever port from env or fallback
const dbURL = process.env.MONGO_URL || process.env.MONGO_URI; // get mongoDB connecion string from env

mongoose.connect(dbURL) // connect to mongoDB
  .then(() => console.log("MongoDB ist verbunden Hallelujah!")) // success message
  .catch(err => {
    console.error("MongoDB Fehler:", err.message);  // error message
    console.log("DEBUG: Wurde die URL geladen?", dbURL ? "JA" : "NEIN");
  });

const server = http.createServer(app); // create HTTP server from express app 

const io = new Server(server, {  // cteate socket.io sever with CORS settings
  cors: {
    origin: "*",   // allow all origins
    methods: ["GET", "POST"]
  }
});

io.on("connection", async (socket) => { // when a client connects
  console.log("Ein Client hat sich verbunden WUUUUH", socket.id);

  const oldMessages = await Message.find().sort({ createdAt: 1 }); // load old messages from database
  socket.emit("oldMessages", oldMessages); // send old messages to the connection client

  socket.on("join", async (username) => {  // when user joins the chat
  socket.username = username || "Anonym";  // save username on socket

  try {
   
    let existingUser = await User.findOne({ username: socket.username }); // check if user already in databse

    if (!existingUser) { // if not create new user
      await User.create({ username: socket.username });
      console.log("User gespeichert:", socket.username);
    }
  } catch (err) {
    console.error("Fehler beim Speichern des Users:", err.message);
  }

  if (!users.includes(socket.username)) {  // add user to online list if not already include
    users.push(socket.username);
  }
 
  io.emit("user_list", users);   // send update user list to all clients
  console.log("Online Benutzer:", users);
});

  socket.on("chat_nachricht", async (msg) => {   // when message is sent
    console.log("Nachricht ist angekommen:", msg);

    const savedMessage = await Message.create({  // save message in mongoDB
      username: msg.username || "Anonym",
      text: msg.text
    });

    io.emit("chat_nachricht", savedMessage);    // send message ton all connected clients
  });

  socket.on("disconnect", () => {    // when user is disconnected
    users = users.filter((u) => u !== socket.username);  // remove user from online list
    io.emit("user_list", users);  //  update all clients
    console.log("Benutzer getrennt, online:", users);
  });
});

server.listen(PORT, () => {   // start server 
  console.log(`Server läuft auf http://localhost:${PORT}`);
});