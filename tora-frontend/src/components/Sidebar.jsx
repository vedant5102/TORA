import React from "react";

export default function Sidebar({ selectedPage, setSelectedPage }) {
  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Upload", key: "upload" },
    { name: "Settings", key: "settings" }
  ];

  return (
    <aside className="w-56 bg-slate-900 min-h-screen border-r border-slate-800 p-4">
      <h2 className="text-emerald-400 text-xl font-bold mb-6">Menu</h2>

      <nav className="flex flex-col gap-3">
        {menu.map(m => (
          <button
            key={m.key}
            onClick={() => setSelectedPage(m.key)}
            className={`px-3 py-2 rounded-md text-left transition ${
              selectedPage === m.key
                ? "bg-emerald-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {m.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
