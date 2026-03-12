# MoleculeForge – The Infinite 3D Chemical Reactor

Monorepo:

- `frontend/`: React + Vite + React Three Fiber
- `backend/`: FastAPI + WebSocket frame streaming (simulation placeholder)

## Quickstart (Windows)

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). The frontend connects to the backend WebSocket at `ws://localhost:8000/ws/sim` and renders a simple moving particle system inside a glass reactor.

