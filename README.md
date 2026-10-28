# 🎟️ PassGate — High-Speed Event Ticketing & Gate Check-In Platform

> **Engineered for Byte Race 2026 · VCET Puttur**  
> Sub-second contactless QR verification, atomic single-use admissions, live venue occupancy analytics, and participant data privacy governance.

---

## 🌐 Live Deployment Links

Experience the platform live on GitHub Pages with zero external dependencies:

* **🏠 Landing Page & Overview**: [https://pravardhankp2008-beep.github.io/PassGate/](https://pravardhankp2008-beep.github.io/PassGate/)
* **🎫 Attendee Registration & VIP Pass**: [https://pravardhankp2008-beep.github.io/PassGate/register.html](https://pravardhankp2008-beep.github.io/PassGate/register.html)
* **📷 Gate Scanner & Test Suite**: [https://pravardhankp2008-beep.github.io/PassGate/scan.html](https://pravardhankp2008-beep.github.io/PassGate/scan.html)
* **📊 Organizer Dashboard & Venue Counter**: [https://pravardhankp2008-beep.github.io/PassGate/admin.html](https://pravardhankp2008-beep.github.io/PassGate/admin.html)

---

## ⚡ Core Capabilities

### 1. 🎫 Attendee Registration & Instant Digital VIP Pass
* **Single-Step Registration**: Enter attendee name, email, and ticket tier (General Admission, VIP Access, Student Competitor).
* **High-Contrast, Fast-Focusing QR Codes**: Low-density matrix dots with M-level error correction optimized for instant recognition (< 0.1s) under phone cameras, laptop webcams, and dim event lighting.
* **Luxury Digital Badge**: Physical ticket styling featuring perforated tear divider lines with circular notches, attendee metadata, unique serial tokens (`PG-2026-XXXXX`), and one-click `@media print` styling.
* **Instant Single-Device Scan Testing**: Generates a direct **“⚡ Test Scan This Pass Now”** action button for immediate same-device verification.

### 2. 📷 High-Speed Gate Scanner Engine (`scan.html`)
* **Live Camera Stream with Targeting Reticle**: Auto-starts camera with an animated laser scan line.
* **Lens Switching & Photo Upload**: Easily toggle between front and rear cameras or upload a photo/screenshot of a QR pass via `Html5Qrcode.scanFile`.
* **Atomic Single-Use Validation & Immediate Feedback**:
  * 🟢 **Valid Entry**: Prominent full-screen green overlay, large checkmark SVG, attendee name, and melodic high chime (C5–E5–G5).
  * 🔴 **Duplicate Entry Lockout**: Prominent full-screen red warning with exact prior check-in timestamp: *“ENTRY DENIED: DUPLICATE - Already used at 09:30 AM”* accompanied by a low warning tone and haptic vibration.
* **⚡ 1-Click Verification Test Suite**: Built-in interactive test passes allowing judges to test valid admissions and duplicate rejections on a single screen without needing a secondary device.

### 3. 📊 Organizer Control Center & Live Venue Counter (`admin.html`)
* **Real-Time Turnout Telemetry**: 2-second background synchronization displaying Registered Count, Checked-In Headcount, Remaining Capacity, and Turnout Percentage with radial SVG progress rings.
* **Live In-Venue Headroom & Safety Status**: Dynamic venue headroom calculation (*“150 Seats Free”*) with safety badges (`● SEATS AVAILABLE`, `● HIGH OCCUPANCY`, `● AT CAPACITY`).
* **Dynamic Quick Capacity Stepper**: Adjust auditorium capacity on the fly (`-25`, `-10`, `+10`, `+25` seats) to accommodate extra chairs or emergency safety constraints.
* **CSV Bulk Audit Export**: One-click RFC-4180 compliant CSV export containing attendee tokens, names, emails, ticket tiers, check-in statuses, and timestamps.
* **Clean State Reset**: One-click reset tool to purge demo data and return the application to a pristine 0-state anytime during judging.

### 4. 🛡️ Data Privacy & Legal Compliance Pop-Ups
* **Attendee Terms & Conditions and Privacy Policy Pop-Up**:
  * Mandatory acceptance checkbox on registration form.
  * Prominent pop-up modal detailing data collection scope (Name, Email, Ticket Tier, Arrival Timestamp), purpose limitation, zero third-party monetization, single-use ticket rules, and 30-day post-hackathon PII purging.
* **Staff Operating Policy & Terms of Service Pop-Up**:
  * Dedicated administrative governance modal on the dashboard with a **“Staff Policy Active”** compliance badge.
  * Enforces attendee PII non-disclosure, impartial gate scanning with zero duplicate bypass, venue fire-code capacity adherence, and credential confidentiality.

---

## 🛠️ Architecture & Tech Stack

```text
├── index.html              # PassGate landing page & live stats strip
├── register.html           # Attendee portal, terms pop-up & digital QR pass
├── scan.html               # Gate camera scanner & 1-click test suite
├── admin.html              # Organizer dashboard, venue counter & staff policy
├── supabaseClient.js       # Universal client engine with Supabase & localStorage failover
├── server.js               # Node.js Express server entrypoint
├── db.js                   # SQLite database engine (WAL mode enabled)
├── database.sqlite         # Local embedded database with atomic transactions
├── routes/
│   ├── registration.js     # Public registration & ticket issuance API
│   ├── checkin.js          # Atomic gate verification & duplicate prevention API
│   ├── events.js           # Event logistics & live capacity counter API
│   ├── stats.js            # Real-time analytics & turnout metrics API
│   └── reports.js          # CSV bulk export and audit logs API
└── public/                 # Static root mirror for Express static hosting
```

* **Client Architecture**: Vanilla JavaScript (ES6+), Inter Google Font, strict CSS custom property design system (`--primary: #4f46e5`, `--bg: #f8fafc`, 8px spacing grid).
* **Database & Cloud Hybrid**:
  * **Primary**: Supabase Cloud Client (`@supabase/supabase-js`) for cloud synchronization.
  * **Local Embedded Fallback**: `better-sqlite3` running in high-concurrency **Write-Ahead Logging (WAL)** mode for offline and local operation.
  * **Client Resilient Storage**: Browser `localStorage` failover enabling 100% standalone functionality on static hosts like GitHub Pages.
* **Acoustic & Haptic Feedback**: HTML5 Web Audio API synthesizers (zero external MP3 assets) and `navigator.vibrate` pattern triggers.

---

## 🏃 Local Quickstart

### Prerequisites
* **Node.js** (v18 or higher)
* **npm**

### Installation & Launch

```bash
# 1. Clone repository
git clone https://github.com/pravardhankp2008-beep/PassGate.git
cd PassGate

# 2. Install dependencies
npm install

# 3. Start local development server
npm start
# Server starts at http://localhost:3000
```

### Endpoints
* **Web UI**: `http://localhost:3000/`
* **Health Check**: `http://localhost:3000/api/health`
* **Live Events**: `http://localhost:3000/api/events`

---

## 🏆 Hackathon Judging Quick Demo (60 Seconds)

1. **Step 1: Participant Pass Generation**
   * Visit `/register.html`. Notice the **Attendee Terms & Conditions and Privacy Policy** pop-up.
   * Click **“I Agree & Accept Terms”**, enter your name, and click **“Generate Digital Pass”**.
   * Inspect the crisp digital VIP ticket with its low-density QR code.
2. **Step 2: Gate Check-In**
   * Click **“⚡ Test Scan This Pass Now”** (or open `/scan.html`).
   * Observe the sub-second validation: screen flashes **GREEN: ACCESS GRANTED** with an audio chime.
3. **Step 3: Duplicate Rejection**
   * Scan the same pass again (or click **“Duplicate Entry Test”**).
   * Observe immediate lockout: screen flashes **RED: ENTRY DENIED: DUPLICATE** with the exact previous check-in timestamp.
4. **Step 4: Live Organizer Telemetry**
   * Open `/admin.html`. Review the live headcount update, capacity headroom indicator, and staff policy badge.

---

## 📜 License & Compliance

Engineered with ❤️ for **Byte Race 2026** at **VCET Puttur**.  
All attendee records and audit logs are governed by PassGate's Participant Privacy Policy and Staff Operating Guidelines.
