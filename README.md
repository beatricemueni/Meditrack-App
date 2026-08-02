# 💊 MediTrack API — Flask, PostgreSQL, JWT Authentication & React

Welcome to **MediTrack**, a full-stack medication management application built with **Flask**, **PostgreSQL**, **Flask-RESTful**, and **React (Vite)**.

The goal of this project is to demonstrate the concepts learned during the Backend Development module, including:

- Database Design
- Flask-SQLAlchemy ORM
- Flask-Migrate
- JWT Authentication & Authorization
- Serialization
- RESTful APIs
- Advanced SQLAlchemy Queries
- React + Fetch API

Rather than simply creating CRUD endpoints, this project models real-world relationships between users, medications, prescriptions, and reminders while exposing them through a secure REST API.

---

# 📑 Table of Contents

1. Project Overview
2. Features
3. Tech Stack
4. Project Structure
5. Database Design
6. Authentication
7. Installation
8. Environment Variables
9. Database Migration
10. Seeding the Database
11. Running the Application
12. API Routes
13. Advanced Queries
14. Authorization
15. Future Improvements
16. Author

---

# 🎯 Project Overview

MediTrack helps users organize and manage their medications.

Users can:

- Register an account
- Log in securely
- Create a personal profile
- Add medications
- Schedule reminders
- Store prescriptions
- Link prescriptions to medications
- View only their own medication records

The application demonstrates:

- One-to-One relationships
- One-to-Many relationships
- Many-to-Many relationships
- Pagination
- Authentication
- Authorization
- Aggregation queries
- Filtering
- Joins

---

# ✨ Features

## Authentication

- User Registration
- User Login
- Password Hashing (Flask-Bcrypt)
- JWT Authentication
- Protected Routes

---

## Authorization

Two user roles:

- Admin
- User

Admin-only endpoints return **403 Forbidden** when accessed by regular users.

---

## CRUD Operations

Users can perform CRUD operations for:

- Profile
- Medication
- Reminder
- Prescription

---

## Database Relationships

### One-to-One

```
User
   |
   |
Profile
```

Each user owns exactly one profile.

---

### One-to-Many

```
User
 |
 |------ Medication
 |------ Medication
 |------ Medication
```

One user can own multiple medications.

---

### Many-to-Many

```
Medication
      |
MedicationPrescription
      |
Prescription
```

The association table stores:

- medication_id
- prescription_id
- date_added

---

## Pagination

Medication endpoints support pagination.

Example:

```
GET /medications?page=1&per_page=5
```

Returns:

- page
- per_page
- total
- total_pages

---

## Advanced Queries

The API includes advanced SQLAlchemy queries such as:

- Filtering medications belonging to the logged-in user
- Finding pending reminders
- Aggregating prescription statistics
- Joining multiple related tables

---

# 🛠 Tech Stack

## Backend

- Flask
- Flask-RESTful
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-Bcrypt
- Flask-CORS
- SQLAlchemy Serializer
- PostgreSQL

---

## Frontend

- React
- Vite
- React Router
- Fetch API

---



# 🗄 Database Design

## Tables

- Users
- Profiles
- Medications
- Reminders
- Prescriptions
- MedicationPrescriptions

---

## Relationships

### User

- has one Profile
- has many Medications

### Medication

- belongs to one User
- has many Reminders
- belongs to many Prescriptions

### Prescription

- belongs to many Medications

---

# 🔐 Authentication

Passwords are never stored in plain text.

Passwords are hashed using:

```
Flask-Bcrypt
```

Successful login returns:

```json
{
  "token": "<JWT_TOKEN>",
  "role": "user"
}
```

Protected endpoints require:

```
Authorization: Bearer <token>
```

---

# ⚙ Installation

Clone the repository.

```
git clone <repository-url>
```

Navigate into the project.

```
cd meditrack
```

---

## Backend

Create a virtual environment.

```
python3 -m venv venv
```

Activate it.

Linux/macOS

```
source venv/bin/activate
```

Install dependencies.

```
pip install -r requirements.txt
```

---

## Frontend

```
cd client
npm install
```

---

# 🌱 Environment Variables

Create a `.env` file inside the server folder.

Example:

```
DATABASE_URI=postgresql://meditrack_user:password123@localhost:5432/meditrack_db

SECRET_KEY=your_secret_key

JWT_SECRET_KEY=your_jwt_secret
```

Never commit the `.env` file.

---

# 🔄 Database Migration

Initialize migrations.

```
flask db init
```

Create migration.

```
flask db migrate -m "Initial migration"
```

Apply migration.

```
flask db upgrade
```

---

# Seed the Database

Populate the database with sample data.

```
python seed.py
```

This creates:

- Admin
- Users
- Profiles
- Medications
- Reminders
- Prescriptions
- Medication-Prescription relationships

---

# ▶ Running the Application

Backend

```
python app.py
```

Runs on

```
http://127.0.0.1:5000
```

Frontend

```
npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 📡 API Routes

## Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register a user |
| POST | /login | Login |

---

## Profile

| Method | Route |
|--------|-------|
| GET | /profile |
| PATCH | /profile |

---

## Medication

| Method | Route |
|--------|-------|
| GET | /medications |
| POST | /medications |
| GET | /medications/<id> |
| PATCH | /medications/<id> |
| DELETE | /medications/<id> |

---

## Reminder

| Method | Route |
|--------|-------|
| GET | /reminders |
| POST | /reminders |
| GET | /reminders/<id> |
| PATCH | /reminders/<id> |
| DELETE | /reminders/<id> |

---

## Prescription

| Method | Route |
|--------|-------|
| GET | /prescriptions |
| POST | /prescriptions |
| GET | /prescriptions/<id> |
| PATCH | /prescriptions/<id> |
| DELETE | /prescriptions/<id> |

---

## Many-to-Many

| Method | Route |
|--------|-------|
| POST | /medication-prescriptions |

---



# 🔒 Authorization

Admin-only routes require the authenticated user to have:

```
role = "admin"
```

Non-admin users receive:

```
403 Forbidden
```

---



# 👩‍💻 Author

**Beatrice Mueni**

Backend Development Project

Built using:

- Flask
- PostgreSQL
- React
- Flask-RESTful
- SQLAlchemy
- JWT Authentication

