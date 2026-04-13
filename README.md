# 🚄 FastRail – Railway Reservation System

A modern, full-stack railway reservation platform built with React, TypeScript, Spring Boot, and MongoDB.

## Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | React 18 + TypeScript         |
| Styling    | Tailwind CSS 4 + Custom CSS   |
| Routing    | React Router 7                |
| Backend    | Spring Boot 3.2.5             |
| Database   | MongoDB (Local)               |
| Auth       | JWT + BCrypt                  |

## Prerequisites

- **Node.js** 18+
- **Java** 17+
- **MongoDB** running locally on `localhost:27017`
- **Maven** (or use included `mvnw`)

## Quick Start

### 1. Start MongoDB

Make sure MongoDB is running on `localhost:27017`.

### 2. Start the Backend

```bash
cd Backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080** and automatically:
- Creates the `fastrail_db` database
- Seeds 8 real Indian railway trains
- Creates admin and demo user accounts

### 3. Start the Frontend

```bash
npm install
npm run dev
```

The frontend starts on **http://localhost:5173** with an API proxy to the backend.

## Default Accounts

| Role  | Email                | Password  |
|-------|---------------------|-----------|
| Admin | admin@fastrail.com  | admin123  |
| User  | user@fastrail.com   | user123   |

## Features

### For Users
- 🔍 Search trains by route and date
- 🎫 Book tickets with real-time seat availability
- 📋 View booking history
- ❌ Cancel bookings

### For Admins
- 📊 Dashboard with analytics, revenue chart, booking breakdown
- 🚂 Train management (Add, Edit, Delete)
- 📑 View all system bookings
- 📈 Track revenue and performance

## API Endpoints

| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| POST   | `/api/auth/login`                | User login           |
| POST   | `/api/auth/register`             | User registration    |
| GET    | `/api/trains`                    | List all trains      |
| GET    | `/api/trains/search`             | Search trains        |
| GET    | `/api/trains/{id}`               | Get train by ID      |
| POST   | `/api/trains`                    | Create train         |
| PUT    | `/api/trains/{id}`               | Update train         |
| DELETE | `/api/trains/{id}`               | Delete train         |
| POST   | `/api/bookings`                  | Create booking       |
| GET    | `/api/bookings`                  | List all bookings    |
| GET    | `/api/bookings/user/{userId}`    | User's bookings      |
| PUT    | `/api/bookings/{id}/cancel`      | Cancel booking       |
| GET    | `/api/dashboard/stats`           | Dashboard statistics |

## Seed Data

8 real Indian railway trains are seeded automatically:

1. **Howrah Rajdhani Express** (12301) – Kolkata → New Delhi
2. **Mumbai Rajdhani Express** (12951) – Mumbai Central → New Delhi
3. **Bhopal Shatabdi Express** (12002) – New Delhi → Bhopal
4. **Karnataka Express** (12627) – Bangalore → New Delhi
5. **Vande Bharat Express** (22436) – Varanasi → New Delhi
6. **Tamil Nadu Express** (12621) – Chennai Central → New Delhi
7. **Gitanjali Express** (12859) – Mumbai CSMT → Howrah
8. **Deccan Queen Express** (12124) – Mumbai CSMT → Pune

## Project Structure

```
├── Backend/                  # Spring Boot backend
│   └── src/main/java/com/example/backend/
│       ├── config/           # JWT, CORS, Data Seeder
│       ├── controller/       # REST Controllers
│       ├── dto/              # Request/Response DTOs
│       ├── exception/        # Error handlers
│       ├── model/            # MongoDB Documents
│       ├── repository/       # Data repositories
│       └── service/          # Business logic
├── src/                      # React frontend
│   ├── app/
│   │   ├── components/ui/    # Reusable UI components
│   │   ├── context/          # React context (Auth)
│   │   ├── layouts/          # Sidebar layouts
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript types
│   └── styles/               # Theme & global styles
└── .gitignore
```
