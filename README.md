<div align="center">

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=1B4332&height=100&section=header&text=CareTrack&fontSize=70&fontColor=ffffff" width="100%" />
</p>

<!-- Badges -->

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="react"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="tailwind"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="node"/>
  <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="supabase"/>
  <img src="https://img.shields.io/badge/Twilio-WhatsApp-F22F46?style=flat-square&logo=twilio&logoColor=white" alt="twilio"/>
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white" alt="vercel"/>
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white" alt="render"/>
</p>

<p>
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

<!-- Animated typing intro -->

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1000&color=E76F51&center=true&vCenter=true&width=700&lines=Chronic+disease+isn't+managed+in+the+clinic.;It's+managed+in+the+weeks+between+visits.;CareTrack+keeps+that+gap+covered." alt="Typing SVG"/>
</a>

</div>

---

## 🌿 Overview

**CareTrack** is a two-sided web platform that helps small clinics keep chronic-disease patients (diabetes, hypertension, asthma) on track **between** visits.

Doctors create a patient profile with medications, follow-up schedule, and tests. The system automatically sends reminders over **WhatsApp / SMS** — no app install required. Patients log their own readings (blood sugar, BP, weight) from a simple web portal. A doctor dashboard **passively flags** who's falling behind, so the clinic can act before a missed follow-up becomes a crisis.

> *Chronic disease isn't managed in the clinic — it's managed in the weeks between visits, when patients are on their own. CareTrack keeps that gap covered.*

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👨‍⚕️ For Doctors

* 🗂 **Patient profiles** — condition, medications, tests, schedule
* 📊 **Dashboard with passive flags** — 6 rule-based risk signals
* 📈 **Trend charts** — sugar, systolic BP, diastolic BP, weight
* 📅 **Appointment scheduling** — book, confirm, reschedule, cancel
* 🔔 **Bulk reminder action** — nudge everyone missing readings
* 🧪 **Test tracking** — add/edit tests, due dates, auto-overdue detection

</td>
<td width="50%" valign="top">

### 🧑‍🦱 For Patients

* 📱 **No app install** — works in any browser
* 💬 **WhatsApp / SMS reminders** — checkups, meds, tests, readings
* ✍️ **Self-logging** — sugar, BP (as `120/90`), weight
* 📉 **Personal trend view** — see your own history
* 📅 **Self-booking** — request appointments, reschedule, cancel
* 🔐 **Password change** — self-service

</td>
</tr>
</table>

### 🤖 Automated (Cron)

| Reminder              | Trigger                                     | Cadence       |
| --------------------- | ------------------------------------------- | ------------- |
| 💊 Medication         | `medications[].times` matches current HH:MM | Every 15 min  |
| 🩺 Checkup            | `next_checkup_date` passes                  | Hourly        |
| 🧪 Test               | `tests[].due_date` passes                   | Every 6 hours |
| 📓 Reading            | No reading in `reading_due_days` days       | Daily 9 AM    |
| 🕒 Missed appointment | `scheduled_at` passes without action        | Hourly        |
| 👋 Welcome            | On patient creation                         | Immediate     |

---

## 🏗 Architecture

<div align="center">

```mermaid
graph LR
    A[👨‍⚕️ Doctor<br/>Dashboard] -->|HTTPS| C[Express API]
    B[🧑‍🦱 Patient<br/>Portal] -->|HTTPS| C
    C --> D[(Supabase<br/>Postgres)]
    C --> E[⏰ node-cron<br/>Scheduler]
    E --> F[Twilio<br/>WhatsApp/SMS]
    F -.-> G[📱 Patient Phone]
    C --> H[JWT Auth<br/>bcrypt + rate limit]

    style A fill:#1B4332,color:#fff,stroke:#E76F51,stroke-width:2px
    style B fill:#1B4332,color:#fff,stroke:#E76F51,stroke-width:2px
    style C fill:#E76F51,color:#fff,stroke:#1B4332,stroke-width:2px
    style D fill:#3ECF8E,color:#000
    style E fill:#FFD166,color:#000
    style F fill:#F22F46,color:#fff
    style H fill:#118AB2,color:#fff
```

</div>

### 🛠 Tech Stack

<table>
<tr>
<th>Layer</th><th>Technology</th><th>Purpose</th>
</tr>
<tr>
<td><b>Frontend</b></td>
<td>React 18 · Vite · Tailwind · Recharts · React Router · Axios</td>
<td>Doctor dashboard + patient portal</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Node.js · Express · bcryptjs · jsonwebtoken · express-rate-limit</td>
<td>REST API, auth, business logic</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>Supabase (Postgres) · JSONB columns for medications/tests</td>
<td>Persistent storage</td>
</tr>
<tr>
<td><b>Scheduler</b></td>
<td>node-cron</td>
<td>Automatic reminder scans</td>
</tr>
<tr>
<td><b>Notifications</b></td>
<td>Twilio (WhatsApp/SMS) — mock mode fallback</td>
<td>Patient delivery</td>
</tr>
<tr>
<td><b>Deployment</b></td>
<td>Vercel (frontend) · Render (backend)</td>
<td>Hosting</td>
</tr>
</table>

---

## 📁 Project Structure

```text
caretrack/
├── backend/
│   ├── src/
│   │   ├── config/supabase.js          # Supabase client
│   │   ├── middleware/                 # auth, roles, ownership
│   │   ├── routes/                     # auth, patients, readings, ...
│   │   ├── services/reminder.service.js # Twilio + scans
│   │   ├── jobs/scheduler.js           # node-cron
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/client.js               # axios + JWT interceptor
    │   ├── components/                 # Navbar, PatientCard, charts, ...
    │   ├── context/AuthContext.jsx
    │   ├── pages/                      # Doctor + Patient views
    │   └── App.jsx
    └── package.json
```

---

## 🗺 Roadmap

<table>
<tr><td>✅</td><td>Patient profiles with medications, tests, schedule</td></tr>
<tr><td>✅</td><td>Automated WhatsApp/SMS reminders via cron</td></tr>
<tr><td>✅</td><td>Patient self-logging (sugar, BP, weight)</td></tr>
<tr><td>✅</td><td>Doctor dashboard with 6 automatic flags</td></tr>
<tr><td>✅</td><td>Appointment booking, reschedule, cancel</td></tr>
<tr><td>✅</td><td>JWT auth, bcrypt, rate limiting, role separation</td></tr>
<tr><td>🔜</td><td>Urdu / Punjabi / Pashto / Sindhi voice reminders (IVR)</td></tr>
<tr><td>🔜</td><td>Offline-first logging with background sync (PWA)</td></tr>
<tr><td>🔜</td><td>ML-based risk prediction from reading history</td></tr>
<tr><td>🔜</td><td>Pharmacy integration for automatic refill reminders</td></tr>
<tr><td>🔜</td><td>Lab integration for automatic test result import</td></tr>
<tr><td>🔜</td><td>Multi-clinic / multi-doctor support</td></tr>
</table>

---

## 🤝 Contributing

We follow a **feature-branch + pull request** workflow.

```bash
# 1. Update main
git checkout main && git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work, commit, push
git add .
git commit -m "feat: short description"
git push -u origin feature/your-feature-name

# 4. Open PR on GitHub → request review
```

**Branch prefixes:** `feature/` · `fix/` · `docs/` · `refactor/`

**Rules:**

* Never push directly to `main`
* One feature per branch
* Run both servers before pushing
* Small commits, clear messages

---

## 🔐 Security Notes

* Passwords hashed with **bcrypt** (cost 8)
* JWTs signed with **7-day expiry**
* Login endpoint **rate-limited** (10 attempts / 15 min / IP)
* **Ownership checks** on every patient-scoped route
* **Role guards** on doctor-only endpoints
* Supabase service key is **backend-only** — never exposed to frontend
* `.env` files contain secrets — do not commit to public forks

---

## 📜 License

Released under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

<!-- Animated footer -->

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:E76F51,100:1B4332&height=120&section=footer&text=CareTrack&fontSize=40&fontColor=ffffff&animation=twinkling&fontAlignY=70" width="100%"/>

<p>
  <b>Never miss a follow-up.</b><br/>
  <sub>Built with 💚 for small clinics doing big work.</sub>
</p>


</div>
``` 
