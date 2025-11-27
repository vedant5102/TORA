// src/components/GestureOverlay.jsx
import React, { useEffect, useState } from "react";

function Icon({ name }) {
  const common = {
    width: 38,
    height: 38,
    stroke: "white",
    strokeWidth: 1.5,
    fill: "none"
  };

  // 🔍 ZOOM IN
  if (name === "zoom_in") {
    return (
      <svg {...common}>
        <circle cx="17" cy="17" r="14" />
        <line x1="17" y1="12" x2="17" y2="22" />
        <line x1="12" y1="17" x2="22" y2="17" />
      </svg>
    );
  }

  // 🔍 ZOOM OUT
  if (name === "zoom_out") {
    return (
      <svg {...common}>
        <circle cx="17" cy="17" r="14" />
        <line x1="12" y1="17" x2="22" y2="17" />
      </svg>
    );
  }

  // ✊ FIST (LOCK)
  if (name === "fist") {
    return (
      <svg {...common}>
        <rect x="7" y="10" width="22" height="18" rx="4" />
        <line x1="10" y1="10" x2="10" y2="18" />
        <line x1="15" y1="10" x2="15" y2="18" />
        <line x1="20" y1="10" x2="20" y2="18" />
      </svg>
    );
  }

  // 👍 THUMBS UP (UNLOCK)
  if (name === "thumbs_up") {
    return (
      <svg {...common}>
        <path d="M12 20 L12 10 L17 4 L19 6 L17 10 L26 10 L26 20 Z" />
      </svg>
    );
  }

  // ↔ SWIPE LEFT
  if (name === "swipe_left") {
    return (
      <svg {...common}>
        <line x1="26" y1="17" x2="10" y2="17" />
        <polygon points="10,17 15,12 15,22" fill="white" />
      </svg>
    );
  }

  // ↔ SWIPE RIGHT
  if (name === "swipe_right") {
    return (
      <svg {...common}>
        <line x1="8" y1="17" x2="24" y2="17" />
        <polygon points="24,17 19,12 19,22" fill="white" />
      </svg>
    );
  }

  return null;
}

export default function GestureOverlay({ gesture, overlayMessage }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("no_gesture");

  useEffect(() => {
    if (!gesture || gesture === "no_gesture") {
      setVisible(false);
      setCurrent("no_gesture");
      return;
    }

    setCurrent(gesture);
    setVisible(true);

    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [gesture]);

  // No gesture → no icon
  if (!visible || current === "no_gesture") return null;

  return (
    <div style={{ position: "fixed", right: 22, bottom: 22, zIndex: 60 }}>
      {/* Gesture Icon */}
      <div className="gesture-icon gesture-fade-enter-active flex items-center justify-center">
        <Icon name={current} />
      </div>

      {/* Lock / Unlock Message Overlay */}
      {overlayMessage && (
        <div className="mt-2 px-3 py-1 rounded-md bg-black/70 text-white text-sm shadow-lg">
          {overlayMessage}
        </div>
      )}
    </div>
  );
}
