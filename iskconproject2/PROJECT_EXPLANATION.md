# ISKCON Sanjeevni IT Cell Project Explanation

## 1. Project Overview
This project is a comprehensive **Room Booking and Resource Management System** designed for the ISKCON Sanjeevni IT Cell. It facilitates the efficient scheduling of meeting rooms and management of associated resources (like projectors, sound systems, etc.). The system serves two primary roles: **Administrators** who manage the infrastructure and **Users** who book the facilities.

## 2. Key Features

### User Features (Staff/Members)
- **Dashboard**: A personalized overview of upcoming bookings and announcements.
- **Book a Room**: Users can browse available rooms, check specific time slots, and make booking requests.
- **AI-Powered Suggestions**: If a desired room/slot is unavailable, the system uses **Google Gemini AI** to intelligently suggest alternative rooms or time slots based on availability and room capacity.
- **My Bookings**: View the status of past and current booking requests (Pending, Approved, Rejected).
- **Profile Management**: Update personal details.

### Admin Features (Management)
- **Dashboard**: A high-level view of daily schedules and pending actions.
- **Booking Management**: Approve or reject booking requests from users.
- **Room Management**: Add, edit, or remove rooms (setting capacity, location, amenities).
- **Resource Management**: Manage inventory of resources available for bookings.
- **Schedule**: A calendar view of all bookings to visualize usage and gaps.

## 3. How It Works (Technical Flow)

### Authentication & Security
- The system uses **Supabase Auth** for secure login and registration.
- Role-based access control ensures regular users cannot access admin features.

### Booking Process
1.  **Selection**: A user selects a date and time.
2.  **Conflict Check**: The system checks the database (Supabase) for existing bookings.
3.  **Booking/Suggestion**:
    -   If the slot is free, the request is submitted.
    -   If the slot is taken, **Gemini AI** analyzes the schedule to propose the best alternative slots.
4.  **Approval**: Admins review the request and approve/reject it.
5.  **Notification**: The user sees the status update in their dashboard.

## 4. Technical Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - For the latest React features and server-side rendering.
- **Language**: JavaScript (React 19).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For a modern, responsive user interface.
- **Database & Auth**: [Supabase](https://supabase.com/) - Provides the backend database (PostgreSQL) and authentication services.
- **Icons**: [Lucide React](https://lucide.dev/) - For consistent and clean iconography.
- **AI Integration**: [Google Gemini](https://deepmind.google/technologies/gemini/) - For intelligent scheduling assistance.
- **UI Components**: Built with Radix UI primitives for accessibility.

## 5. Folder Structure Explained

- **`src/app`**: Contains all the pages and routes.
    -   `admin/`: All admin-related pages (bookings, rooms, schedule).
    -   `users/`: All user-related pages (book-room, my-bookings).
    -   `login/` & `register/`: Authentication pages.
- **`src/components`**: Reusable UI elements (Buttons, Cards, Modals).
- **`src/lib`**: Helper functions and configurations (e.g., Supabase client setup).
- **`src/actions`**: Server-side actions for handling data (connecting to the DB, calling AI).

## 6. Meaning of Configuration Files
- **`next.config.mjs`**: Configuration for the Next.js server.
- **`tailwind.config.mjs`**: Setup for the styling system.
- **`middleware.js`**: (If present) Handles route protection (ensuring only logged-in users access the dashboard).
- **`.env.local`**: Stores secret keys (API keys for Supabase and Gemini) - **Keep this private!**

## 7. Getting Started (For Developers)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Set Environment Variables**:
    Ensure your `.env.local` file has the correct keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `GEMINI_API_KEY`
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**:
    Navigate to `http://localhost:3000`.

---
*Created for the ISKCON Sanjeevni IT Cell Project.*
