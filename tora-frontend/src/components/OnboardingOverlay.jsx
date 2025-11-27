// src/components/OnboardingOverlay.jsx
import React, { useEffect, useState } from "react";

export default function OnboardingOverlay({ cameraOn }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (cameraOn) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [cameraOn]);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]">
      <div className="bg-[#071421]/90 p-8 rounded-2xl border border-white/5 shadow-2xl w-[520px] animate-fadeUp">
        <h2 className="text-2xl font-bold text-emerald-400 mb-3 text-center">Welcome to TORA</h2>
        <p className="text-slate-300 text-sm text-center mb-5">Use these hand gestures to control the viewer — keep your hand centered & clearly visible to the camera.</p>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {/* gesture cards (same SVGs as earlier) */}
        </div>
        <div className="flex justify-end">
          <button onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Got it — Continue</button>
        </div>
      </div>
    </div>
  );
}
