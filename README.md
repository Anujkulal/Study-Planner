# Study Planner

A modern, feature-rich study planner web application built with React, TypeScript, and TailwindCSS. Track your study sessions, monitor progress, and stay organized with an intuitive calendar interface.

![Study Planner](https://img.shields.io/badge/React-19.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8)

## ✨ Features

### 📅 Calendar View

- Interactive calendar powered by `react-day-picker`
- Visual indicators for sessions (completed/pending)
- Session count badges on dates
- Click any date to view detailed information

### 📊 Progress Tracking

- **Overall Statistics**: Total hours, completed hours, sessions count
- **Weekly Progress**: Current week's completion percentage
- **Upcoming Sessions**: See what's coming up next
<!-- - Real-time progress visualization with charts TODO: Pending...-->

### 🎨 User Interface

- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Built with shadcn/ui components
<!-- - **Smooth Animations**: Polished user experience. TODO: Pending... -->

### 📝 Session Management

- **Add Sessions**: Create new study sessions with subject, duration, and notes
- **Edit Sessions**: Update existing sessions anytime
- **Delete Sessions**: Remove sessions with confirmation
- **Status Tracking**: Mark sessions as completed or pending

### 🔍 Session Details Modal

- View all sessions for a specific day
- Quick actions: add, edit, or delete
- Display session notes and duration
- Color-coded by status

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:Anujkulal/Study-Planner.git
   cd Study-Planner
   ```

2. **Install dependencies**

   ```bash
   cd client
   npm i
   ```

3. **Run the development server**

   ```bash
   ./run.sh
   ```

4. **Open your browser**

   [http://localhost:5173](http://localhost:5173)

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components

### Libraries

- **react-day-picker** - Calendar component
- **date-fns** - Date utilities
- **lucide-react** - Icons
- **sonner** - Toast notifications

### State Management

- React Hooks (useState, useEffect, useContext)
- Context API for theme management

### Storage

- LocalStorage for data persistence
- Mock API layer for CRUD operations
