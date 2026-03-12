from __future__ import annotations

import asyncio
import math
import time
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.schemas import SimulationFrame
from app.services.simulator import make_demo_frame

router = APIRouter()


@router.websocket("/ws/sim")
async def ws_sim(websocket: WebSocket) -> None:
    await websocket.accept()

    # Simple control messages can be sent by the client. For now we only
    # support updating T/P; everything else is ignored.
    temperature_k: float = 298.15
    pressure_atm: float = 1.0

    last_client_msg: Optional[dict] = None
    start = time.perf_counter()

    try:
        while True:
            # Non-blocking receive (best-effort). If there's no message, keep streaming.
            try:
                last_client_msg = await asyncio.wait_for(websocket.receive_json(), timeout=0.0)
            except asyncio.TimeoutError:
                last_client_msg = None

            if isinstance(last_client_msg, dict):
                if "temperature_k" in last_client_msg:
                    temperature_k = float(last_client_msg["temperature_k"])
                if "pressure_atm" in last_client_msg:
                    pressure_atm = float(last_client_msg["pressure_atm"])

            t = time.perf_counter() - start
            t_ps = t * 0.25  # purely cosmetic time scaling

            frame: SimulationFrame = make_demo_frame(
                t_ps=t_ps,
                temperature_k=temperature_k,
                pressure_atm=pressure_atm,
                phase=math.fmod(t, 2 * math.pi),
            )
            await websocket.send_text(frame.model_dump_json())
            await asyncio.sleep(1 / 30)  # ~30 fps

    except WebSocketDisconnect:
        return

