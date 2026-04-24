# Stayzen - Airbnb Clone

Stayzen is a full-stack accommodation marketplace inspired by Airbnb. It focuses on performance, scalability, and real-world backend challenges such as caching, concurrency control, and containerized deployment.

## Overview

- Full-stack MERN application with 1000+ listings
- Map-based location discovery with proximity filtering
- Concurrency-safe booking system preventing overbooking
- Redis caching for faster API responses
- Fully Dockerized architecture for consistent environments

### Key Engineering Highlights
### Performance Optimization
- Integrated Redis caching for frequently accessed endpoints
- Reduced database load and improved response time by 40%+
- Implemented TTL-based caching with manual invalidation

---

### Concurrency-Safe Booking System
- Designed a booking flow using status-based locking (PENDING, CONFIRMED, EXPIRED)
- Prevents overbooking under concurrent requests
- Uses atomic validation during booking confirmation
- Includes expiry mechanism for incomplete bookings

---

### Scalable Backend Design
- Built RESTful APIs with pagination and query optimization
- Indexed database queries for efficient filtering
- Real-time availability calculation using active bookings

---

### Map-Based Discovery
- Interactive map UI for exploring listings
- Proximity-based filtering using coordinates
- Enhances user experience for location-based search

---

### Containerized Architecture
- Docker Compose setup with frontend, backend, MongoDB, and Redis
- One-command startup for entire system
- Ensures consistent development and deployment environments

---

## Tech Stack

| Layer | Technologies |
|----------|---------|
| Frontend | React, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Cachine | Redis |
| Devops | Docker, Docker Compose |
| Media | Cloudinary |
| Auth | JWT |
| Email | Nodemailer, Mailtrap |

---


## Running the project

### Docker (Recommended)
```bash
docker compose up --build
```

## Manual Setup

### 2. Setup Backend
```bash
cd stayzen-backend
npm install
```

> Create a `.env` file in `stayzen-backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
REDIS_URL=redis://localhost:6379
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd stayzen-frontend
npm install
```
> Create a `.env` file in `stayzen-frontend`:
```env
REACT_APP_RAZORPAY_KEY_ID=your_razor_pay_api_key
```

```bash
npm start
```
---
