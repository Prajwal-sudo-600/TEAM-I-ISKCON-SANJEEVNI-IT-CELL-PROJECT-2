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


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.booking_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  booking_id uuid DEFAULT gen_random_uuid(),
  resource_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT booking_resources_pkey PRIMARY KEY (id),
  CONSTRAINT booking_resources_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
  CONSTRAINT booking_resources_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_id uuid,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  purpose text NOT NULL DEFAULT ''::text,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT resources_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text DEFAULT '''Not Null'''::text,
  capacity integer NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT rooms_pkey PRIMARY KEY (id)
);

