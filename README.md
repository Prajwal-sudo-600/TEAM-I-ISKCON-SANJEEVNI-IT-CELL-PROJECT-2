# TEAM-I-ISKCON-SANJEEVNI-IT-CELL-PROJECT-2

# 📅 Sanjevani IT Cell – Room & Resource Allocation System

## 📖 Background & Purpose
The **Sanjevani IT Cell** conducts regular activities such as meetings, training sessions, and workshops. Currently, managing these requires manual coordination via messages/spreadsheets, leading to double bookings and confusion.

This project is a **Room and Resource Allocation System** designed to streamline this process. It allows Admins to manage assets and schedules, while Users (organizers/volunteers) can request bookings digitally. It features a light **AI integration** to suggest alternative slots when conflicts occur.

---

## 🚀 Key Features

### 🔐 Admin (IT Cell Core Team)
* **Secure Login:** Supabase Email + Password authentication.
* **Room & Resource Management:** Add/Edit rooms (Capacity, Name) and Resources (Projectors, Sound Systems).
* **Approval Workflow:** View pending requests and Approve or Reject them.
* **Dashboard:** View the master schedule (Daily/Weekly) to prevent conflicts.

### 👤 User (Event Organizers)
* **View Availability:** Check open slots for rooms.
* **Booking Request:** Select room, time, and required resources.
* **Status Tracking:** View whether a booking is Pending, Approved, or Rejected.
* **AI Assistance:** If a slot is taken, get AI-powered suggestions for nearby slots or alternative rooms.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 14+](https://nextjs.org/) | App Router for routing and server actions. |
| **UI Framework** | [Tailwind CSS](https://tailwindcss.com/) | Styling. |
| **Components** | [Shadcn/ui](https://ui.shadcn.com/) | Accessible UI components. |
| **Backend/Auth** | [Supabase](https://supabase.com/) | PostgreSQL Database and Authentication. |
| **AI Integration** | OpenAI / Vercel AI SDK | Simple logic for slot suggestions. |
| **Deployment** | Vercel | Frontend hosting. |

---

## 🗄️ Database Structure

The project uses a relational schema hosted on Supabase.

```mermaid
erDiagram
    ROOMS ||--o{ BOOKINGS : has
    BOOKINGS ||--|{ BOOKING_RESOURCES : includes
    RESOURCES ||--o{ BOOKING_RESOURCES : linked_to

    ROOMS {
        uuid id PK
        string name
        int capacity
    }

    RESOURCES {
        uuid id PK
        string name
        string type
    }

    BOOKINGS {
        uuid id PK
        uuid room_id FK
        timestamp start_time
        timestamp end_time
        string status "Pending/Approved/Rejected"
        string user_email
    }

    BOOKING_RESOURCES {
        uuid booking_id FK
        uuid resource_id FK
    }
