# 🎟️ PassGate | Secure Event Ticketing & High-Speed Check-In Engine

> **Ultra-reliable, sub-millisecond event ticketing and gate check-in platform engineered for hackathons and high-throughput summits.**  
> Built with **Node.js**, **Express**, **better-sqlite3 (WAL mode)**, **bcryptjs**, and **html5-qrcode**.

---

## 🌟 Overview & Key Capabilities

**PassGate** solves the dreaded registration bottleneck and duplicate check-in vulnerabilities at hackathons. By pairing an atomic SQLite state engine with client-side camera scanning, PassGate guarantees **zero double-entry**, instantaneous badge generation, and live organizer telemetry.

### 🚀 Core Features

1. **⚡ Atomic Gate Check-In Engine (`POST /api/checkin`)**
   - Employs a single atomic SQLite update:  
     `UPDATE attendees SET checked_in = 1, checked_in_at = datetime('now') WHERE token = ? AND checked_in = 0;`
   - Completely eliminates concurrent double-entry race conditions without heavyweight distributed locks.
   - Evaluates `changes` count to distinguish brand-new passes (`valid`), duplicate reuse (`used`), and unrecognized passes (`invalid`).

2. **🎫 Attendee Registration & Digital Pass (`POST /api/register/:id`)**
   - Real-time capacity and ticket-tier limit enforcement (e.g., General vs. VIP) inside an atomic transaction.
   - Generates cryptographically unguessable 32-character hex tokens (`crypto.randomBytes(16)`).
   - Instant high-resolution QR code pass generation (`qrcode` library) with one-click PNG download and `@media print` badge styling.

3. **📷 Live Camera QR Scanner (`/scan.html`)**
   - High-contrast, mobile-first gate staff interface powered by `html5-qrcode` accessing rear device cameras.
   - **Full-Screen Immediate Visual Feedback**:
     - 🟢 **Valid Entry**: Full-screen green overlay, attendee name, ticket badge, and high chime audio.
     - 🔴/🟡 **Already Used**: Full-screen red/amber warning with exact previous scan timestamp and double-buzz audio.
     - 🔴 **Invalid Pass**: Full-screen red alert for unrecognized tokens.
   - **2-Second Auto-Resume**: Progress countdown timer automatically resumes camera scanning for seamless queue processing.
   - Web Audio API synthesizer for clean, zero-latency acoustic feedback without external asset dependencies.

4. **📊 Real-Time Organizer Dashboard (`/admin.html`)**
   - Autonomous background polling every **2 seconds** (`GET /api/events/:id/stats`).
   - Dynamic KPI visual cards: Attendance rate progress bar, capacity utilization meter, and pending arrival count.
   - Per-ticket tier breakdown mini-cards (General vs. VIP turnout ratios).
   - Live activity feed displaying verified check-ins in real time.

5. **📂 CSV Bulk Import & Audit Export (`routes/reports.js`)**
   - **Bulk Import (`POST /api/events/:id/import-csv`)**: Upload attendee lists via `multer` and `csv-parse` inside an atomic transaction with automatic token generation and limit validation.
   - **Attendance Export (`GET /api/events/:id/report.csv`)**: Instant one-click CSV export with RFC 4180 compliance, containing names, emails, ticket tiers, check-in statuses, and timestamps.

6. **🔐 Staff Gateway Authentication (`middleware/auth.js`)**
   - Cryptographically signed HMAC-SHA256 session tokens with constant-time verification.
   - Transparent support for HTTP-only cookies, `Authorization: Bearer <token>` headers, and query token fallbacks.

---

## 🛠️ Tech Stack & Architecture

- **Backend Runtime**: Node.js (v18+)
- **Server Framework**: Express 5
- **Database Engine**: `better-sqlite3`
  - **WAL Mode Active**: `PRAGMA journal_mode = WAL;` (high concurrency read/write)
  - **Foreign Key Enforcement**: `PRAGMA foreign_keys = ON;`
  - **Indexes**: `idx_attendees_token` and `idx_attendees_event_id` for instant scanner lookups
- **Security & Pass Generation**:
  - `bcryptjs`: Salting & hashing staff passwords
  - `crypto`: 128-bit CSPRNG token generation & HMAC session signing
  - `qrcode`: Dynamic base64 PNG data URL rendering
- **File Ingestion & Export**:
  - `multer`: In-memory multipart CSV stream processing
  - `csv-parse`: RFC-compliant CSV record extraction

---

## 📁 Project Layout

```text
├── server.js               # Express application entry & route orchestration
├── db.js                   # SQLite schema, WAL mode, pragmas & auto-seeding
├── database.sqlite         # Local embedded database (auto-generated)
├── .env                    # Port & session secret configuration
├── package.json            # Scripts & dependencies
├── middleware/
│   └── auth.js             # Staff HMAC authentication & session guard
├── routes/
│   ├── registration.js     # Public registration & event availability API
│   ├── checkin.js          # Staff login & atomic gate check-in API
│   ├── stats.js            # Real-time event metrics & KPI aggregation API
│   └── reports.js          # CSV bulk import & attendance report export API
└── public/
    ├── index.html          # PassGate system overview hub
    ├── register.html       # Attendee registration form & digital QR pass
    ├── scan.html           # Staff mobile webcam QR scanner
    └── admin.html          # Organizer live analytics & CSV management dashboard
```

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
*(Or for live auto-reload: `npm run dev`)*

The server boots on [http://localhost:3000](http://localhost:3000) and automatically seeds:
- **Default Staff User**: `staff` / `password123`
- **Sample Event**: `Byte Race 2026 Opening Ceremony` (100 capacity: 80 General, 20 VIP)

---

## 🧭 Application URL Directory

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **System Hub** | [http://localhost:3000/](http://localhost:3000/) | Central navigation & database status |
| **Attendee Registration** | [http://localhost:3000/register.html?event_id=1](http://localhost:3000/register.html?event_id=1) | Public pass registration & QR badge generation |
| **Gate Staff Scanner** | [http://localhost:3000/scan.html](http://localhost:3000/scan.html) | High-speed webcam QR scanner |
| **Organizer Dashboard** | [http://localhost:3000/admin.html?event_id=1](http://localhost:3000/admin.html?event_id=1) | Real-time analytics, CSV import & report export |

---

## 🎤 3-Minute Hackathon Demo Script for Judges

Here is the recommended live demonstration walkthrough to show judges the entire workflow:

### **Step 1: The Problem & Ticket Registration (30s)**
1. Open [http://localhost:3000/register.html?event_id=1](http://localhost:3000/register.html?event_id=1).
2. Point out live capacity enforcement (General vs VIP allocation).
3. Fill in a sample attendee (e.g. `Jordan Lee`, `jordan@example.com`, `VIP Pass`).
4. Click **Complete Registration**. Show the generated **PassGate Digital Pass** with its high-res QR code, token fingerprint, and print/download buttons.

### **Step 2: The Gate Scanner & Audio Feedback (45s)**
1. Open [http://localhost:3000/scan.html](http://localhost:3000/scan.html) on a second browser window or phone.
2. Sign in with staff credentials (`staff` / `password123`).
3. Show the active camera preview and reticle laser.
4. Scan the newly generated QR code from Step 1 (or paste the token into the manual input).
5. **Observe**: The screen flashes full-screen **Green (VALID ENTRY)**, announces the attendee name and ticket tier, and plays a positive chime.

### **Step 3: Zero Double-Entry / Anti-Fraud Test (30s)**
1. Scan or submit the exact same pass a second time.
2. **Observe**: The screen immediately flashes full-screen **Red (ALREADY CHECKED IN)**, plays a warning buzz, and displays the exact timestamp of the previous entry.
3. Explain the single atomic SQLite query: `UPDATE attendees SET checked_in = 1 ... WHERE checked_in = 0;` ensuring no race conditions.

### **Step 4: Live Telemetry & Bulk Operations (45s)**
1. Open [http://localhost:3000/admin.html?event_id=1](http://localhost:3000/admin.html?event_id=1).
2. Point out that the check-in from Step 2 is already visible in the **Live Activity Feed** thanks to 2-second autonomous polling.
3. Scroll to **Event Data Management**:
   - Use **Bulk Import (CSV)** to upload `sample-attendees.csv`. Show the instant transaction summary (e.g., `4 imported, 0 skipped`).
   - Click **Download Attendance Report (.csv)**. Open the downloaded CSV to show judges the complete audit trail with timestamps and attendance statuses.

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Bcrypt with 10 salt rounds for all staff credentials.
- **Timing Attack Resistance**: Node.js `crypto.timingSafeEqual` for constant-time HMAC validation.
- **SQL Injection Prevention**: 100% parameterized SQLite statements via `better-sqlite3`.
- **Concurrency Protection**: SQLite Write-Ahead Logging (WAL) and atomic SQL update guards.
- **Input Sanitization**: RFC 4180 CSV character escaping to mitigate CSV formula injection.
