# 🇪🇹 EthioTravel - Premium Travel Intelligence Platform

EthioTravel is a state-of-the-art travel planning and management ecosystem designed for Ethiopia. It features an immersive "Azure Concierge" aesthetic, a robust tri-party approval system (Traveler, Agent, Admin), and a sophisticated Administrative Command Center.

## 🚀 Key Features

### 🛡️ Administrative Command Center
*   **Global User Registry**: Real-time management of travelers, agents, and admins.
*   **Security Overrides**: Direct protocol control over user roles and performance ratings.
*   **Live Telemetry**: Visualized system stats using Recharts (User growth, Asset flow, Activity).
*   **Protocol Bulletins**: System-wide announcements and internal memo management.

### 💼 Expert Agent Protocol
*   **Controlled Onboarding**: Tiered application system with document verification (Permits/IDs).
*   **Trip Management**: Agents can create and manage exclusive trip packages with built-in profit tracking.
*   **Direct Communication**: Integrated CMessage system for secure internal transmissions.

### 🌍 Immersive Traveler Experience
*   **Interactive Trip Planner**: High-fidelity search and destination detail discovery.
*   **Secure Booking**: Verified transaction flow with agent/admin oversight.
*   **Identity Management**: Functional profile management with avatar synchronization.

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion (Animations), Lucide/React Icons.
*   **Backend**: Node.js, Express, JWT Authentication.
*   **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
*   **Visualization**: Recharts for administrative telemetry.

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v18+)
*   Supabase Account

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with SUPABASE_URL, SUPABASE_KEY, and JWT_SECRET
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

### 4. Database Initialization
1.  Navigate to your **Supabase Dashboard > SQL Editor**.
2.  Run the contents of `backend/supabase-schema-fix.sql` to initialize tables, sequences, and security policies.
3.  Run `backend/seed-data.sql` to populate initial destinations and the Super Admin account.

## 🔑 Administrative Access
The primary administrative account is reserved at **ID 1200**.
*   **Username**: `ashu`
*   **Access Credentials**: Defined in internal protocol.

## 📜 License
This project is proprietary and built for the **EthioTravel Platform 2026**.

---
*Built with ❤️ for Ethiopia's Travel Future.*
