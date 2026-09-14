# CCTV Guardian

A modern, self-hosted, dark-mode CCTV monitoring web app for Dahua NVRs.

## Tech Stack
- **Gateway**: go2rtc (Docker)
- **Backend**: Node.js, Express, SQLite3, JWT
- **Frontend**: React (Vite), Tailwind CSS, Zustand, Leaflet, WebRTC

## Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

## Setup Instructions

### 1. Media Gateway (go2rtc)
1. Edit `config/go2rtc.yaml` to add your actual Dahua RTSP streams under `streams:`.
2. Run `docker-compose up -d` to start the WebRTC gateway.

### 2. Backend Server
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install` (already done by the builder).
3. Create a `.env` file (copied from `.env.example`).
4. Start the server: `npm run dev`
   - The SQLite database will be initialized automatically on the first run with an `admin` / `admin123` account and 4 dummy cameras.

### 3. Frontend Client
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### Access
Open `http://localhost:5173` in your browser.
Login with `admin` / `admin123`.

## Architecture Notes
- The React application connects to the Node.js backend on port 5000 for authentication and camera metadata.
- Video streams are pulled directly from the local go2rtc gateway via WebRTC (port 1984) bypassing the Node backend for low latency and zero transcoding overhead.
