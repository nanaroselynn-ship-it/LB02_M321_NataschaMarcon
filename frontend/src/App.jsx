import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5005", {
  transports: ["websocket", "polling"],
});

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("oldMessages");
      socket.off("chat_nachricht");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !connected) return;

    socket.emit("chat_nachricht", {
      username: username.trim() || "Anonym",
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

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Dein Benutzername"
        style={{ marginBottom: "10px", display: "block" }}
      />

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