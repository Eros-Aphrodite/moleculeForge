import { useEffect, useMemo, useRef } from "react";
import { useSimulationStore } from "../store/simulationStore";

function getWsUrl() {
  const host = import.meta.env.VITE_BACKEND_HOST ?? "localhost:8000";
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${host}/ws/sim`;
}

export function useSimulation() {
  const wsUrl = useMemo(() => getWsUrl(), []);
  const wsRef = useRef<WebSocket | null>(null);

  const setConnected = useSimulationStore((s) => s.setConnected);
  const setFrame = useSimulationStore((s) => s.setFrame);
  const temperature_k = useSimulationStore((s) => s.temperature_k);
  const pressure_atm = useSimulationStore((s) => s.pressure_atm);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setConnected(false);
    };

    ws.onmessage = (evt) => {
      try {
        const frame = JSON.parse(evt.data);
        setFrame(frame);
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      ws.close();
    };
  }, [setConnected, setFrame, wsUrl]);

  // Send control updates (throttled by rAF)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ temperature_k, pressure_atm }));
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [temperature_k, pressure_atm]);
}

