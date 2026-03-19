import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5011", {
  transports: ["websocket", "polling"],
});

function App() {
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("oldMessages", (msgs) => {
      setMessages(msgs);
    });

    socket.on("chat_nachricht", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_list", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("oldMessages");
      socket.off("chat_nachricht");
      socket.off("user_list");
    };
  }, []);

  const joinChat = () => {
    if (!username.trim() || !connected) return;

    const cleanName = username.trim();
    setCurrentUser(cleanName);
    socket.emit("join", cleanName);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !connected) return;

    const activeUser = currentUser || "Anonym";

    socket.emit("chat_nachricht", {
      username: activeUser,
      text: message,
    });

    setMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Chat App</h1>

      <p>
        Status: <strong>{connected ? "Verbunden" : "Nicht verbunden"}</strong>
      </p>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Dein Benutzername"
        />
        <button onClick={joinChat} style={{ marginLeft: "8px" }}>
          Name setzen
        </button>
      </div>

      <p>
        Aktueller Benutzer: <strong>{currentUser || "Noch nicht gesetzt"}</strong>
      </p>

      <h3>Online Benutzer:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>

      <h3>Nachrichten:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.username}: {msg.text}
          </li>
        ))}
      </ul>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nachricht..."
        />
        <button type="submit">Senden</button>
      </form>
    </div>
  );
}

export default App;