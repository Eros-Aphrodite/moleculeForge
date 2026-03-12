from __future__ import annotations

from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class MoleculeInput(BaseModel):
    smiles: str = Field(..., min_length=1, description="SMILES string for the molecule")


class SimulationParams(BaseModel):
    temperature_k: float = Field(298.15, ge=0, description="Temperature in Kelvin")
    pressure_atm: float = Field(1.0, ge=0, description="Pressure in atm")
    solvent: Optional[str] = Field(None, description="Solvent name or identifier")
    catalyst: Optional[str] = Field(None, description="Catalyst name or identifier")


class Particle(BaseModel):
    id: int
    x: float
    y: float
    z: float
    r: float = Field(0.08, ge=0)
    kind: Literal["atom", "solvent", "catalyst", "product"] = "atom"
    color: str = "#7dd3fc"


class SimulationFrame(BaseModel):
    t_ps: float = Field(..., ge=0, description="Simulation time in picoseconds")
    temperature_k: float = Field(..., ge=0)
    pressure_atm: float = Field(..., ge=0)
    particles: List[Particle]

