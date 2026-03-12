import { create } from "zustand";

export type Particle = {
  id: number;
  x: number;
  y: number;
  z: number;
  r: number;
  kind: "atom" | "solvent" | "catalyst" | "product";
  color: string;
};

export type SimulationFrame = {
  t_ps: number;
  temperature_k: number;
  pressure_atm: number;
  particles: Particle[];
};

type SimulationState = {
  connected: boolean;
  frame: SimulationFrame | null;
  temperature_k: number;
  pressure_atm: number;
  setConnected: (v: boolean) => void;
  setFrame: (f: SimulationFrame) => void;
  setControls: (v: { temperature_k?: number; pressure_atm?: number }) => void;
};

export const useSimulationStore = create<SimulationState>((set) => ({
  connected: false,
  frame: null,
  temperature_k: 298.15,
  pressure_atm: 1.0,
  setConnected: (v) => set({ connected: v }),
  setFrame: (f) => set({ frame: f }),
  setControls: (v) =>
    set((s) => ({
      temperature_k: v.temperature_k ?? s.temperature_k,
      pressure_atm: v.pressure_atm ?? s.pressure_atm
    }))
}));

