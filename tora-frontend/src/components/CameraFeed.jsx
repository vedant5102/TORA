// src/components/CameraFeed.jsx
import React, { useRef, useEffect, useState, useContext } from "react";
import { Hands } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";
import { SocketContext } from "../socketContext.js";

export default function CameraFeed({ setCameraOnParent }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const socket = useContext(SocketContext);

  const [cameraOn, setCameraOn] = useState(false);

  // Throttle sending landmarks (only every X ms)
  const lastSendRef = useRef(0);
  const SEND_INTERVAL = 70; // Faster gesture response

  // Smoothening buffer
  const smoothBuffer = useRef([]);
  const SMOOTH_WINDOW = 3; // (3-frame rolling average)

  // Trigger dashboard onboarding
  useEffect(() => {
    if (setCameraOnParent) setCameraOnParent(cameraOn);
  }, [cameraOn, setCameraOnParent]);


  useEffect(() => {
    if (!cameraOn) return;

    let hands = null;
    let cam = null;

    async function startCam() {
      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext("2d");

      // Auto match canvas to video size
      canvasEl.width = 640;
      canvasEl.height = 480;

      // Initialize Mediapipe Hands
      hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
        smoothLandmarks: true,
      });

      // -------- PROCESS RESULTS --------
      hands.onResults((results) => {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

        // Draw camera image
        if (results.image) {
          ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);
        }

        // If hand detected
        if (results.multiHandLandmarks?.length) {
          let lm = results.multiHandLandmarks[0];

          // ---- 1) Smoothening Landmarks ----
          smoothBuffer.current.push(lm);
          if (smoothBuffer.current.length > SMOOTH_WINDOW) {
            smoothBuffer.current.shift();
          }

          const smoothLm = lm.map((p, i) => {
            let avgX = 0, avgY = 0, avgZ = 0;
            smoothBuffer.current.forEach((frame) => {
              avgX += frame[i].x;
              avgY += frame[i].y;
              avgZ += frame[i].z;
            });
            let l = smoothBuffer.current.length;
            return { x: avgX / l, y: avgY / l, z: avgZ / l };
          });

          // ---- 2) Draw Hand with Glow ----
          drawConnectors(ctx, smoothLm, HAND_CONNECTIONS, {
            color: "#00ffaa",
            lineWidth: 3,
          });
          drawLandmarks(ctx, smoothLm, {
            color: "#00ffaa",
            radius: 3,
          });

          // ---- 3) Send to backend (throttled) ----
          const now = performance.now();
          if (
            now - lastSendRef.current > SEND_INTERVAL &&
            socket &&
            socket.connected
          ) {
            socket.emit("landmarks", {
              landmarks: smoothLm.map((p) => ({
                x: p.x,
                y: p.y,
                z: p.z,
              })),
            });

            lastSendRef.current = now;
          }
        }
      });

      // -------- START CAMERA STREAM --------
      cam = new Camera(videoEl, {
        onFrame: async () => {
          await hands.send({ image: videoEl });
        },
        width: 640,
        height: 480,
      });

      await cam.start();
    }

    startCam();

    return () => {
      try {
        if (cam) cam.stop();
        if (hands) hands.close();
        smoothBuffer.current = [];
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [cameraOn, socket]);

  return (
    <div className="card">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-lg">Camera</h3>

        {!cameraOn ? (
          <button
            onClick={() => setCameraOn(true)}
            className="px-3 py-1 bg-emerald-600 rounded-md"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setCameraOn(false)}
            className="px-3 py-1 bg-red-600 rounded-md"
          >
            Stop
          </button>
        )}
      </div>

      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full rounded-lg bg-black"
      />
    </div>
  );
}
