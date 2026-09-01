# 🚆 IRCTC - Railway Reservation System

A full-stack railway reservation web application inspired by the Indian Railway Catering and Tourism Corporation (IRCTC).

This project allows users to register, log in, search for trains, book tickets, make payments, view bookings, generate electronic tickets, cancel bookings, process refunds, and view simulated live train locations.

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
- Station Suggestions
- Display Train Number
- Display Train Name
- Departure Time
- Arrival Time
- Journey Duration
- Available Seats
- Train Fare
- Simulated Live Train Location
- Map-based Train Tracking

### 🎫 Booking Features

- Passenger Details
- Train Booking
- Unique PNR Generation
- View My Bookings
- View Booking by PNR
- Electronic Railway Ticket
- Print Ticket
- Booking Status
- Live Location Button

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

### 📍 Live Train Tracking

- Train source and destination coordinates
- Interactive map using Leaflet
- Train location marker
- Source and destination markers
- Journey progress
- Estimated arrival time
- Distance remaining
- Simulated train speed
- Route visualization

> Live train tracking is simulated for educational/project demonstration purposes and does not use official Indian Railways live train data.

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Font Awesome
- Leaflet.js

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

### Development & Testing Tools

- Visual Studio Code
- MySQL Workbench
- Thunder Client
- BrowserStack
- Git
- GitHub

---

## 📂 Project Structure

```text
IRCTC/
│
├── Frontend/
│   │
│   ├── html/
│   │   ├── admin.html
│   │   ├── booking.html
│   │   ├── index.html
│   │   ├── livetrain.html
│   │   ├── mybooking.html
│   │   ├── profile.html
│   │   ├── search.html
│   │   ├── success.html
│   │   └── ticket.html
│   │
│   ├── css/
│   │   ├── livetrain.css
│   │   ├── profile.css
│   │   ├── search.css
│   │   └── style.css
│   │
│   ├── javascript/
│   │   ├── admin.js
│   │   ├── booking.js
│   │   ├── livetrain.js
│   │   ├── mybooking.js
│   │   ├── profile.js
│   │   ├── script.js
│   │   ├── search.js
│   │   ├── success.js
│   │   └── ticket.js
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
├── booking_db.sql
├── irctc_id.sql
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Project

```bash
git clone https://github.com/sukuna1007/IRCTC.git
```

Open the project:

```bash
cd IRCTC
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
- stations

Import the provided SQL files if required.

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

> ⚠️ Never upload your real `.env` file, database password, JWT secret, Razorpay secret, or other credentials to GitHub.

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

The backend server runs by default at:

```text
http://localhost:5000
```

Open the application in your browser.

---

# 🔌 Main API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Trains

```text
GET /api/trains/search
```

Example:

```text
/api/trains/search?from=Delhi&to=Mumbai
```

## Bookings

```text
GET /api/bookings
GET /api/bookings/pnr/:pnr
```

Authenticated APIs require a JWT token.

Example:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Payments

```text
POST /api/payment/create-order
POST /api/payment/verify
```

## Admin

The project also includes protected admin functionality for managing:

- Dashboard
- Users
- Trains
- Bookings

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
Live Train Location
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
- `.env` is excluded from Git using `.gitignore`.

---

# 🚧 Future Improvements

Possible future improvements include:

- Real Indian Railways API integration
- Real-time train tracking
- Intermediate route stations
- Seat selection
- Multiple passenger booking
- Waiting-list system
- RAC status
- Train classes
- Email ticket confirmation
- SMS notifications
- Forgot password
- Advanced admin dashboard
- Booking reports
- Improved mobile responsiveness

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
- Interactive Map Integration
- Git & GitHub Version Control

---

## 📄 Disclaimer

This is an educational project and is **not affiliated with or operated by IRCTC or Indian Railways**.

The live train tracking functionality is simulated for demonstration purposes.

This project should not be used for real railway reservations.

---

# 🚆 IRCTC Clone

**Full-Stack Railway Reservation System**

Built using:

`HTML` • `CSS` • `JavaScript` • `Bootstrap` • `Node.js` • `Express.js` • `MySQL` • `JWT` • `Razorpay` • `Leaflet`