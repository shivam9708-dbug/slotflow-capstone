# SlotFlow - Smart Appointment Booking System

SlotFlow is a modern, full-stack appointment scheduling application designed to streamline the booking process for both clients and administrators. Built as a comprehensive capstone project, it features dynamic slot availability, real-time database synchronization, and a dedicated administrative dashboard.

## 🚀 Live Demo
- **Frontend (Live):** [Your Vercel URL Here]
- **Backend API:** [Your Render URL Here]

## ✨ Features
- **Dynamic Slot Generation:** Automatically calculates available time slots based on service duration and business hours.
- **Real-Time Availability:** Prevents double-booking by disabling slots that have already been reserved.
- **Admin Dashboard:** A secure, tabular overview of all upcoming appointments, patient details, and service requests.
- **Responsive Design:** Optimized for both desktop and mobile devices using Tailwind CSS.
- **RESTful API:** Clean and modular Node.js/Express backend communicating seamlessly with the frontend.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (Frontend) & Render (Backend)

## 💻 Local Setup & Installation

Follow these steps to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/slotflow-capstone.git
cd slotflow-capstone
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your Supabase keys:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5001
```
Start the backend server:
```bash
node src/index.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5001
```
Start the React development server:
```bash
npm run dev
```

## 🗄️ Database Schema
The project uses two primary tables in Supabase:
1. **`services`**: Stores available services, their descriptions, durations, and pricing.
2. **`appointments`**: Records booking details including customer information, selected service, date, and allocated time slots.

## 👨‍💻 Author
Developed by **Shivam Kumar Jha** as a B.Tech CSE Capstone Project.

---
*Note: The free-tier backend on Render may take 40-50 seconds to spin up if it has been inactive for 15 minutes. Please be patient during the first booking request.*
