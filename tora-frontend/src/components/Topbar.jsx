import React from "react";

export default function Topbar({ connected, theme, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-extrabold text-emerald-400">TORA</div>
        <div className="text-sm text-slate-300">Touchless Assistant</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connected ? "bg-emerald-400" : "bg-red-500"}`}></div>
          <span className="text-slate-300 text-sm">{connected ? "Connected" : "Offline"}</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}
