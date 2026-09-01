# 🚆 IRCTC - Railway Reservation System

A full-stack railway reservation web application inspired by the Indian Railway Catering and Tourism Corporation (IRCTC).

This project allows users to register, log in, search for trains, book tickets, make payments, view bookings, generate electronic tickets, cancel bookings, and process refunds.

---

## 📌 Project Overview

The IRCTC Clone is a full-stack web development project created to demonstrate frontend development, backend API development, authentication, database management, online payment integration, and railway ticket booking functionality.

The application uses a service-based backend architecture with separate routes, controllers, services, middleware, and database configuration.

---

## ✨ Features

### 👤 User Features

- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Duplicate Email Validation
- Duplicate Phone Number Validation
- Change Password
- User Profile

### 🚆 Train Features

- Search Trains
- Search by Source and Destination
- Display Train Number
- Display Train Name
- Departure Time
- Arrival Time
- Journey Duration
- Available Seats
- Train Fare

### 🎫 Booking Features

- Passenger Details
- Train Booking
- Unique PNR Generation
- View My Bookings
- View Booking by PNR
- Electronic Railway Ticket
- Print Ticket
- Booking Status

### 💳 Payment Features

- Razorpay Payment Gateway
- Razorpay Order Creation
- Payment Verification
- Razorpay Signature Verification
- Payment Status
- Transaction ID

### ❌ Cancellation & Refund

- Cancel Railway Ticket
- Booking Cancellation Status
- Razorpay Refund Processing
- Refund ID
- Refund Amount
- Refund Status
- Refund Date

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Font Awesome

### Backend

- Node.js
- Express.js

### Database

- MySQL
- mysql2

### Authentication & Security

- JSON Web Token (JWT)
- bcrypt
- dotenv
- CORS

### Payment Gateway

- Razorpay

### Development Tools

- Visual Studio Code
- MySQL Workbench
- Thunder Client
- Git / GitHub

---

## 📂 Project Structure

```text
IRCTC-Clone/
│
├── Frontend/
│   │
│   ├── html/
│   │   ├── index.html
│   │   ├── search.html
│   │   ├── booking.html
│   │   ├── mybooking.html
│   │   ├── ticket.html
│   │   └── profile.html
│   │
│   ├── css/
│   │
│   ├── javascript/
│   │
│   └── images/
│
├── Backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   ├── traincontroller.js
│   │   ├── bookingcontroller.js
│   │   └── paymentcontroller.js
│   │
│   ├── services/
│   │   ├── userservice.js
│   │   ├── trainservice.js
│   │   └── bookingservice.js
│   │
│   ├── Routes/
│   │
│   ├── middleware/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Project

```bash
git clone <your-repository-url>
```

Open the project:

```bash
cd IRCTC-Clone
```

---

## 2. Install Backend Dependencies

Open the backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

---

# 🗄️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE irctc_db;
```

Select the database:

```sql
USE irctc_db;
```

The application uses MySQL tables including:

- users
- trains
- bookings

---

# 🔐 Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=irctc_db

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ Never upload your real `.env` file or secret keys to GitHub.

---

# ▶️ Run the Project

Go to the backend directory:

```bash
cd Backend
```

Start the server:

```bash
npm start
```

The backend server runs on port:

```text
5000
```

Then open the frontend `index.html` page in your browser or use Live Server.

---

# 🔌 Main API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/change-password
```

## Trains

```text
GET /api/trains/search
```

Example query:

```text
/api/trains/search?from=Delhi&to=Mumbai
```

## Bookings

```text
GET /api/bookings
GET /api/bookings/pnr/:pnr
```

Authenticated booking APIs require a JWT token.

Example authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Payments

```text
POST /api/payment/create-order
POST /api/payment/verify
```

---

# 🔄 Application Flow

```text
Register / Login
       ↓
JWT Authentication
       ↓
Search Train
       ↓
Select Train
       ↓
Enter Passenger Details
       ↓
Create Razorpay Order
       ↓
Complete Payment
       ↓
Verify Payment
       ↓
Create Booking
       ↓
Generate PNR
       ↓
My Bookings
       ↓
View E-Ticket
       ↓
Cancel Ticket
       ↓
Refund
```

---

# 🔒 Security

The project implements several security measures:

- Passwords are hashed using bcrypt.
- JWT is used for protected API authentication.
- Users can access only their authenticated booking information.
- Razorpay payment signatures are verified on the backend.
- Environment variables are used for sensitive configuration.
- SQL queries use parameterized values.

---

# 🚧 Future Improvements

Possible future improvements include:

- Seat selection
- Multiple passenger booking
- Waiting-list system
- RAC status
- Train classes
- Email ticket confirmation
- SMS notifications
- Forgot password
- Admin dashboard
- Train management
- User management
- Booking reports
- Responsive mobile improvements

---

# 🎓 Academic Project

This project was developed for educational purposes to demonstrate full-stack web development concepts including:

- Frontend Development
- REST API Development
- Node.js & Express.js
- MySQL Database
- Service Layer Architecture
- JWT Authentication
- Payment Gateway Integration
- CRUD Operations
- Error Handling

---

## 📄 Disclaimer

This is an educational project and is **not affiliated with or operated by IRCTC or Indian Railways**.

It should not be used for real railway reservations.

---

# 🚆 IRCTC Clone

**Full-Stack Railway Reservation System**

Built using:

`HTML` • `CSS` • `JavaScript` • `Bootstrap` • `Node.js` • `Express.js` • `MySQL` • `JWT` • `Razorpay`