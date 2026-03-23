# SensorStream API — Real-Time Telemetry Demo

## Overview
SensorStream is a full-stack demo that simulates a device streaming telemetry into a backend API. Users can start or stop a live demo, view real-time charts, and inspect recent readings. The project’s purpose is to showcase core full‑stack fundamentals: API design, data persistence, and interactive frontend state management.

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Flask (Python REST API)
- Database: SQLite (time-series-style readings)
- Tooling: python-dotenv, REST clients
- Testing: basic backend tests (planned expansion for broader coverage)

## Key Skills Demonstrated
- Designed authenticated device ingestion via a REST API
- Implemented server-side validation and sensor allowlisting
- Persisted timestamped telemetry data using SQLite
- Built configurable polling and live UI updates
- Structured API responses for frontend consumption
- Managed error states and empty result sets gracefully

## System Architecture
The system follows a straightforward flow from the demo UI to the backend API and database. The frontend initiates a demo session, the simulated device posts readings to the ingestion endpoint, and the UI polls for recent readings to render in the chart and table.

> Diagram:
![SensorStream Full Stack Architecture Overview](sensorstream_system_architecture.png)
![SensorStream Backend Architecture](sensorstream_backend_architecture.png)

## Local Setup

### Backend Setup
```
cd SensorStream-api
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python run.py
```

http://127.0.0.1:5000

### Frontend Setup
```
cd sensorstream-frontend
npm install
npm run dev
```

http://localhost:3000

## API Summary

### POST /api/ingest
Accepts a JSON payload containing sensor readings from a device. Requires an API key or device identifier in headers.

> Example payload screenshot: 
![SensorStream /api/ingest payload visual](api_ingest_pipeline.png)


Notes:
- Validates sensor type against an allowlist.
- Stores the reading with a server-side timestamp.

### GET /api/readings
Returns recent telemetry readings. Supports optional filters and paging controls.

Query parameters:
- `sensor` (optional): filter by sensor name
- `start` (optional): ISO timestamp start
- `end` (optional): ISO timestamp end
- `limit` (optional): max number of readings (default = 200)

> Example response screenshot: ![SensorStream /api/readings response visual](api_readings_pipeline.png)

## Testing
### Current Coverage
- Backend includes basic validation and error-handling tests
- Manual testing is used for frontend behavior

### Manual Test Checklist
- Start demo → readings begin updating
- Stop demo → polling halts immediately
- Switch sensors → chart resets and rebuilds correctly
- API health status loads on page mount

## Planned Improvements
- Expanded backend test coverage (auth, edge cases)
- Frontend component and state tests
- Automated API contract tests
