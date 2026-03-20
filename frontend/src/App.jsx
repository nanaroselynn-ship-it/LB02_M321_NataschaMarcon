import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// create a socket connection to the server via ngingx proxy
const socket = io("/", {
  transports: ["websocket", "polling"],
});

function App() {
  // state for username input
  const [username, setUsername] = useState("");
  // currenty active user after joining
  const [currentUser, setCurrentUser] = useState("");
  // message input field
  const [message, setMessage] = useState("");
  // all chat messages
  const [messages, setMessages] = useState([]);
  // list of currently online users
  const [users, setUsers] = useState([]);
  // connection status to the server
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // triggered when socket connects
    socket.on("connect", () => {
      setConnected(true);
    });
    // triggered when socket is disconnected
    socket.on("disconnect", () => {
      setConnected(false);
    });
     // receive previously stored messages from server
    socket.on("oldMessages", (msgs) => {
      setMessages(msgs);
    });
     // receive new messages from server in real time
    socket.on("chat_nachricht", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
     // receive updated list of online users
    socket.on("user_list", (userList) => {
      setUsers(userList);
    });
     // cleanup remove all listeners when component unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("oldMessages");
      socket.off("chat_nachricht");
      socket.off("user_list");
    };
  }, []);
    // function to join the chat with a username
  const joinChat = () => {
    // prevent joining if username is empty or not connected
    if (!username.trim() || !connected) return;

    const cleanName = username.trim();
    // set current user locally
    setCurrentUser(cleanName);
    // notify backend that user join
    socket.emit("join", cleanName);
  };
    // function to send a message
  const sendMessage = (e) => {
    e.preventDefault();
    // prevent sending empty messages of if not connected
    if (!message.trim() || !connected) return;
     // user current user or fallback to anonym
    const activeUser = currentUser || "Anonym";
     // send message to backend
    socket.emit("chat_nachricht", {
      username: activeUser,
      text: message,
    });
    // clear input field
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffd6e8, #f8c8ff, #e6ccff)",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff0f6",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(180, 80, 140, 0.25)",
          padding: "30px",
          border: "2px solid #f7b6d2",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#c2185b",
            marginBottom: "10px",
            fontSize: "2.2rem",
          }}
        >
          💮💮💮 Nanao's Chat-App District 💮💮💮
        </h1>

        <p style={{ textAlign: "center", marginBottom: "20px", color: "#7a2c5b" }}>
          Status:{" "}
          <strong style={{ color: connected ? "#2e7d32" : "#c62828" }}>
            {connected ? "Verbunden" : "Nicht verbunden"}
          </strong>
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#ffe3f1",
              borderRadius: "18px",
              padding: "20px",
              border: "1px solid #f4a7c4",
            }}
          >
            <h3 style={{ color: "#ad1457", marginTop: 0 }}>😎 Benutzer</h3>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Dein Benutzername"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #e9a3c9",
                marginBottom: "10px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={joinChat}
              style={{
                width: "100%",
                padding: "12px",
                background: "#ec4899",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Name setzen
            </button>

            <p style={{ color: "#7a2c5b" }}>
              Aktueller Benutzer:{" "}
              <strong>{currentUser || "Noch kein Benutzer"}</strong>
            </p>

            <h3 style={{ color: "#ad1457", marginTop: "20px" }}> 🟢 Online Benutzer</h3>
            <ul style={{ paddingLeft: "20px", color: "#5c2345" }}>
              {users.map((user, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  {user}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: "#fff8fc",
              borderRadius: "18px",
              padding: "20px",
              border: "1px solid #f4a7c4",
              display: "flex",
              flexDirection: "column",
              height: "70vh",
            }}
          >
            <h3 style={{ color: "#ad1457", marginTop: 0 }}> Nachrichten</h3>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "14px",
                padding: "15px",
                border: "1px solid #f5c2d7",
                marginBottom: "15px",
              }}
            >
              {messages.map((msg, index) => {
                const isOwnMessage = msg.username === currentUser;

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        background: isOwnMessage ? "#f472b6" : "#fce7f3",
                        color: isOwnMessage ? "white" : "#5c2345",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "4px" }}>
                        {msg.username}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Schreib eine Nachricht..."
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid #e9a3c9",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "14px 20px",
                  background: "#db2777",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Senden
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;