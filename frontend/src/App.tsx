import { ControlPanel } from "./components/ControlPanel";
import { ReactorCanvas } from "./components/ReactorCanvas";
import { useSimulation } from "./hooks/useSimulation";
import { useSimulationStore } from "./store/simulationStore";

export function App() {
  useSimulation();
  const connected = useSimulationStore((s) => s.connected);
  const frame = useSimulationStore((s) => s.frame);

  return (
    <div className="app">
      <div className="panel">
        <div className="title">MoleculeForge</div>
        <p className="subtitle">
          Live reactor stream (demo). Next step is swapping the server generator with RDKit + ASE integration.
        </p>

        <div className="stat">
          <div className="statLabel">WebSocket</div>
          <div className="statValue">{connected ? "connected" : "disconnected"}</div>
        </div>
        <div className="stat">
          <div className="statLabel">t (ps)</div>
          <div className="statValue">{frame ? frame.t_ps.toFixed(3) : "—"}</div>
        </div>
        <div className="stat">
          <div className="statLabel">T (K)</div>
          <div className="statValue">{frame ? frame.temperature_k.toFixed(2) : "—"}</div>
        </div>
        <div className="stat">
          <div className="statLabel">P (atm)</div>
          <div className="statValue">{frame ? frame.pressure_atm.toFixed(2) : "—"}</div>
        </div>

        <ControlPanel />
      </div>

      <div className="canvasWrap">
        <ReactorCanvas />
        <div className="hint">Drag/zoom to orbit. Sliders update the live stream.</div>
      </div>
    </div>
  );
}

