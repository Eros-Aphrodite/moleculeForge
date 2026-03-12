from __future__ import annotations

from fastapi import APIRouter

from app.core.schemas import MoleculeInput, SimulationParams

router = APIRouter()


@router.get("/health")
async def health() -> dict:
    return {"ok": True}


@router.post("/simulate")
async def simulate_start(molecule: MoleculeInput, params: SimulationParams) -> dict:
    # Placeholder: the websocket is the live stream; this endpoint will later
    # allocate a simulation session keyed by an id.
    return {
        "session_id": "demo",
        "smiles": molecule.smiles,
        "params": params.model_dump(),
    }


@router.post("/predict")
async def predict(molecule: MoleculeInput) -> dict:
    # Placeholder for ML inference (QM9-style property prediction).
    return {"smiles": molecule.smiles, "predictions": {"energy_proxy": 0.0}}


@router.post("/optimize")
async def optimize(molecule: MoleculeInput, params: SimulationParams) -> dict:
    # Placeholder for RL / BO suggested condition tweaks.
    suggestion = params.model_dump()
    suggestion["temperature_k"] = float(params.temperature_k) + 25.0
    return {"smiles": molecule.smiles, "suggested_params": suggestion}

