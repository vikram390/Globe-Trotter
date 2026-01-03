
# 🌍 GlobeTrotter - Hackathon Submission

## 1️⃣ Project Overview
**Vision:** GlobeTrotter aims to be the definitive OS for the modern traveler. We believe travel planning should be as exciting as the journey itself, not a chore involving dozens of browser tabs and messy spreadsheets.
**Mission:** To provide an integrated, AI-enhanced platform that handles multi-city logistics, budget constraints, and social sharing in one beautiful interface.
**Problem Solved:** Fragmented planning leads to budget overruns and logistical nightmares. GlobeTrotter centralizes data and uses AI to bridge the gap between "dreaming" and "doing."

## 2️⃣ System Architecture
- **Frontend:** React with Tailwind CSS for a responsive, mobile-first UI. Recharts for data visualization.
- **Backend (Simulated):** A robust Mock API layer with LocalStorage persistence, mimicking a RESTful Node/Express server.
- **AI Engine:** Google Gemini (gemini-3-flash) for structured itinerary generation.
- **Data Flow:** Unidirectional flow from the Mock API to React State, ensuring UI consistency.

## 3️⃣ Database Design (Relational)
- **Users**: Identity and preferences.
- **Trips**: The core container (Owner ID, Budget, Public/Private).
- **Stops**: Ordered cities within a trip (Foreign Key: TripID).
- **Activities**: Specific events within a stop (Foreign Key: StopID, Category, Cost).

## 4️⃣ API Design (Simulated)
- `GET /trips/:userId`: Fetch user's trips.
- `POST /trips`: Create new trip shell.
- `PUT /trips/:id`: Atomic update of trip structure (Stops/Activities).
- `GET /share/:token`: Public read-only access to specific itineraries.

## 5️⃣ Budget Calculation Logic
- **Cost Aggregation:** Recursive reduction of all activity costs across all stops.
- **Per-Day Cost:** Dynamically calculated based on total spend divided by trip duration (end_date - start_date).
- **Alerts:** Real-time UI feedback when `spent > total_budget` using visual indicators and warning cards.

## 6️⃣ Feature Highlights
- **AI Itinerary Builder:** One-click generation of local activities for any city.
- **Timeline View:** A visual roadmap of the journey, connecting stops and activities chronologically.
- **Budget Dashboard:** Real-time pie charts and progress bars to monitor spending across categories (Flights, Hotels, etc).
- **Public Sharing & Cloning:** Viral growth loop allowing users to share "Travel Recipes" that others can copy and customize.

## 1️⃣0️⃣ Deployment & Hackathon Notes
- **Local Run:** Just open the provided environment. No complex database setup required due to our robust Mock persistence layer.
- **Demo Tip:** 
    1. Start at the **Dashboard** to show existing trips.
    2. Go to **Create Journey** and make a new one.
    3. In the **Trip Planner**, show adding a stop and then clicking **AI Gen** to demonstrate the Gemini integration.
    4. Switch to the **Budget Tab** to see the charts updating live.
    5. Copy the **Share Link** and open it in a private tab to show the "Copy trip" feature.
- **Submission Checklist:** 
  - [x] Responsive UI (Works on mobile/desktop)
  - [x] Gemini AI Integration
  - [x] Relational Database Schema (SQL Docs included)
  - [x] Visual Data Analytics (Recharts)
  - [x] Sharing/Social Viral Loop
