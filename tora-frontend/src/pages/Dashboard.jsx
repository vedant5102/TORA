// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import CameraFeed from "../components/CameraFeed";
import UploadPanel from "../components/UploadPanel";
import GestureOverlay from "../components/GestureOverlay";
import OnboardingOverlay from "../components/OnboardingOverlay";
import { SocketContext } from "../socketContext.js";

export default function Dashboard() {
  const socket = useContext(SocketContext);

  // Gesture logic
  const [gesture, setGesture] = useState("no_gesture");
  const [locked, setLocked] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");

  // Zoom & Gallery
  const [scale, setScale] = useState(1);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [numPages, setNumPages] = useState(1);

  // UI
  const [theme, setTheme] = useState("dark");
  const [connected, setConnected] = useState(false);
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [cameraOn, setCameraOn] = useState(false);

  // Socket connection state
  useEffect(() => {
    if (!socket) return;
    setConnected(socket.connected);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  // 🔥 Main gesture listener
  useEffect(() => {
    if (!socket) return;

    const handler = ({ gesture: g }) => {
      console.log("Gesture Received:", g);
      setGesture(g);

      // ========= LOCK / UNLOCK =========
      if (g === "fist") {
        setLocked(true);
        setOverlayMessage("🔒 Locked — Swipes Disabled");
        setTimeout(() => setOverlayMessage(""), 1500);
        return;
      }

      if (g === "thumbs_up") {
        setLocked(false);
        setOverlayMessage("🔓 Unlocked");
        setTimeout(() => setOverlayMessage(""), 1500);
        return;
      }

      // ========= LOCKED MODE =========
      if (locked) {
        if (g === "zoom_in") setScale(s => Math.min(s + 0.12, 3));
        if (g === "zoom_out") setScale(s => Math.max(s - 0.12, 0.4));
        return; // block swipes
      }

      // ========= NORMAL MODE =========
      if (g === "zoom_in") setScale(s => Math.min(s + 0.12, 3));
      if (g === "zoom_out") setScale(s => Math.max(s - 0.12, 0.4));

      if (g === "swipe_left")
        setPage(prev => (files.length ? Math.min(prev + 1, files.length - 1) : prev));

      if (g === "swipe_right")
        setPage(prev => Math.max(prev - 1, 0));
    };

    socket.on("gesture", handler);
    return () => socket.off("gesture", handler);
  }, [socket, locked, files]);

  // Theme switch
  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  // Page renderer
  function renderContent() {
    if (selectedPage === "dashboard") {
      return (
        <div className="grid grid-cols-2 gap-6">
          <CameraFeed setCameraOnParent={setCameraOn} />
          <UploadPanel
            files={files}
            setFiles={setFiles}
            scale={scale}
            page={page}
            setPage={setPage}
            numPages={numPages}
            setNumPages={setNumPages}
          />
        </div>
      );
    }

    if (selectedPage === "upload")
      return (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Upload</h2>
          <UploadPanel
            files={files}
            setFiles={setFiles}
            scale={scale}
            page={page}
            setPage={setPage}
            numPages={numPages}
            setNumPages={setNumPages}
          />
        </div>
      );

    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-slate-400">Theme & Connection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar
        connected={connected}
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === "dark" ? "light" : "dark"))
        }
      />

      <div className="flex">
        <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      <GestureOverlay gesture={gesture} overlayMessage={overlayMessage} />
      <OnboardingOverlay cameraOn={cameraOn} />
    </div>
  );
}
