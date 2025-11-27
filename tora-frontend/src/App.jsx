// src/App.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { SocketContext } from "./socketContext.js";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const s = io(url, { transports: ["websocket", "polling"] });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Dashboard />
    </SocketContext.Provider>
  );
}
