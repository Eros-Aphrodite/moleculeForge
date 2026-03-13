import { useEffect, useMemo, useRef } from "react";
import { useSimulationStore } from "../store/simulationStore";

function getWsUrl() {
  const host = import.meta.env.VITE_BACKEND_HOST ?? "127.0.0.1:8000";
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${host}/ws/sim`;
}

const RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECT_DELAY_MS = 15000;

export function useSimulation() {
  const wsUrl = useMemo(() => getWsUrl(), []);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef(RECONNECT_DELAY_MS);

  const setConnected = useSimulationStore((s) => s.setConnected);
  const setFrame = useSimulationStore((s) => s.setFrame);
  const temperature_k = useSimulationStore((s) => s.temperature_k);
  const pressure_atm = useSimulationStore((s) => s.pressure_atm);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setConnected(true);
        reconnectDelayRef.current = RECONNECT_DELAY_MS;
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        wsRef.current = null;
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 1.5,
            MAX_RECONNECT_DELAY_MS
          );
          connect();
        }, reconnectDelayRef.current);
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
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [setConnected, setFrame, wsUrl]);

  // Send control updates only when temperature_k or pressure_atm change (not every frame)
  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ temperature_k, pressure_atm }));
    }
  }, [temperature_k, pressure_atm]);
}

