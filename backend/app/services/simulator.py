from __future__ import annotations

import math
from dataclasses import dataclass
from typing import List

import numpy as np

from app.core.schemas import Particle, SimulationFrame


@dataclass(frozen=True)
class _Palette:
    cold: str = "#60a5fa"
    warm: str = "#f59e0b"
    hot: str = "#fb7185"


def _lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def _temp_to_color_hex(temperature_k: float) -> str:
    pal = _Palette()
    # Map 250K..1500K to cold..warm..hot
    t = (temperature_k - 250.0) / (1500.0 - 250.0)
    t = float(np.clip(t, 0.0, 1.0))
    if t < 0.5:
        return pal.cold
    if t < 0.85:
        return pal.warm
    return pal.hot


def make_demo_frame(*, t_ps: float, temperature_k: float, pressure_atm: float, phase: float) -> SimulationFrame:
    # A stable, deterministic "reactor swirl" demo. This is intentionally
    # lightweight so the full stack works before adding RDKit/ASE.
    n = 2500
    rng = np.random.default_rng(1337)

    # Fixed base positions in a cylinder-ish volume
    theta = rng.uniform(0, 2 * math.pi, size=n)
    radius = np.sqrt(rng.uniform(0, 1, size=n)) * 1.2
    y = rng.uniform(-1.0, 1.0, size=n)
    x0 = radius * np.cos(theta)
    z0 = radius * np.sin(theta)

    # Swirl deformation & pressure "breathing"
    breathe = 1.0 + 0.05 * math.sin(phase * 1.5) + 0.02 * (pressure_atm - 1.0)
    ang = phase + y * 1.3
    x = (x0 * math.cos(ang) - z0 * math.sin(ang)) * breathe
    z = (x0 * math.sin(ang) + z0 * math.cos(ang)) * breathe
    y2 = y + 0.06 * math.sin(phase * 2.0 + theta)

    color = _temp_to_color_hex(temperature_k)
    r = _lerp(0.05, 0.11, float(np.clip((temperature_k - 250.0) / 1250.0, 0.0, 1.0)))

    particles: List[Particle] = [
        Particle(id=i, x=float(x[i]), y=float(y2[i]), z=float(z[i]), r=float(r), kind="atom", color=color)
        for i in range(n)
    ]

    return SimulationFrame(
        t_ps=float(t_ps),
        temperature_k=float(temperature_k),
        pressure_atm=float(pressure_atm),
        particles=particles,
    )

