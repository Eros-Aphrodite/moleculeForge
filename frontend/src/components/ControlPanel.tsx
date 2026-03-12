import { Leva, useControls } from "leva";
import { useEffect } from "react";
import { useSimulationStore } from "../store/simulationStore";

export function ControlPanel() {
  const setControls = useSimulationStore((s) => s.setControls);

  const { temperature_k, pressure_atm } = useControls("Reactor", {
    temperature_k: { value: 298.15, min: 100, max: 1500, step: 1 },
    pressure_atm: { value: 1.0, min: 0.1, max: 50, step: 0.1 }
  });

  useEffect(() => {
    setControls({ temperature_k, pressure_atm });
  }, [pressure_atm, setControls, temperature_k]);

  return <Leva collapsed={false} oneLineLabels={false} />;
}

