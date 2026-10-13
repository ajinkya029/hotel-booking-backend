# 🏨 Hotel Booking Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-02569B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A RESTful backend for a **Hotel Booking Application** built with Node.js, Express.js, MongoDB, and Mongoose. The API supports user authentication, hotel and room management, availability searches, and booking operations, making it suitable for integration with a React frontend.

## 📌 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Example API Requests](#-example-api-requests)
- [Authentication and Authorization](#-authentication-and-authorization)
- [Future Improvements](#-future-improvements)
- [Security Notes](#-security-notes)
- [Author](#-author)

## ✨ Features

### 🔐 Authentication and Authorization
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based access control for regular users and administrators.
- Protected routes for authenticated operations.

### 🏨 Hotel Management
- Create, retrieve, update, and delete hotel records.
- Search hotels by city and text query.
- Filter hotels by minimum rating.
- Paginated hotel listings.
- Retrieve hotel details along with associated rooms.

### 🛏️ Room Management
- Create, update, retrieve, and delete rooms.
- Support for single, double, twin, suite, family, and deluxe rooms.
- Store nightly prices, guest capacity, amenities, and images.
- Filter rooms by hotel, type, capacity, and price.
- Search for room availability across a date range.

### 📅 Booking Management
- Create bookings for available rooms.
- Validate check-in and check-out dates.
- Validate guest capacity and room quantities.
- Calculate booking totals on the server.
- View personal bookings and booking details.
- Cancel eligible upcoming bookings.
- Administrator access to all bookings.

### 🛡️ Security and Error Handling
- Helmet security headers.
- Configurable CORS.
- API rate limiting.
- Centralized error handling.
- Input validation for important booking and authentication fields.
- Environment-based configuration using dotenv.

## 🧰 Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB | NoSQL database |
| Mongoose | Database schemas and models |
| JavaScript (ES Modules) | Application development |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| CORS | Cross-origin access configuration |
| express-rate-limit | Request rate limiting |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |
| Nodemon | Development server auto-restart |

## 📂 Project Structure

```text
hotel-booking-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Hotel.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── hotel.routes.js
│   │   ├── room.routes.js
│   │   └── booking.routes.js
│   └── utils/
│       ├── asyncHandler.js
│       └── dates.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — version 18 or newer.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account.
- [Git](https://git-scm.com/) (optional).
- [Postman](https://www.postman.com/) for testing API endpoints (optional).

### 1. Clone the Repository

```bash
git clone https://github.com/ajinkya029/hotel-booking-backend.git
cd hotel-booking-backend
```

Replace `YOUR_USERNAME` with your GitHub username and update the repository URL if your repository has a different name.

If you downloaded the project ZIP, extract it and open the extracted folder instead.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying `.env.example`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Generate a JWT Secret

Generate a secure random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated value into your `.env` file as `JWT_SECRET`.

### 5. Configure MongoDB

For a local MongoDB instance, use the following connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hotel_booking
```

Alternatively, use your MongoDB Atlas connection string.

### 6. Seed Sample Data

```bash
npm run seed
```

This creates a demo administrator, a sample hotel, and example rooms if they do not already exist.

**Demo administrator credentials:**

```text
Email: admin@example.com
Password: ChangeMe123!
```

Use these credentials only for local development. Change the password and remove demo credentials before deployment.

### 7. Start the Development Server

```bash
npm run dev
```

To start without Nodemon:

```bash
npm start
```

The API will be available at:

```text
http://localhost:5000/api
```

Check the server status:

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "hotel-booking-api",
  "timestamp": "2026-10-13T00:00:00.000Z"
}
```

The timestamp shown above is an illustrative example.

## ⚙️ Environment Variables

Configure the following variables in `.env`:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/hotel_booking` |
| `JWT_SECRET` | Secret used to sign JWTs | Your generated random secret |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLIENT_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

Example `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hotel_booking
JWT_SECRET=replace_with_your_generated_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**Important:** Never commit your actual `.env` file or expose your JWT secret publicly.

## 📡 API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in |
| GET | `/auth/me` | Authenticated | Retrieve current user |

### Hotel Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/hotels` | Public | List and search hotels |
| GET | `/hotels/:id` | Public | Retrieve hotel details and rooms |
| POST | `/hotels` | Admin | Create a hotel |
| PATCH | `/hotels/:id` | Admin | Update a hotel |
| DELETE | `/hotels/:id` | Admin | Delete a hotel and its rooms |

Hotel listing supports these query parameters:

- `city` — filter by city.
- `q` — text search.
- `minRating` — minimum hotel rating.
- `page` — page number.
- `limit` — number of results per page, up to 50.

Example:

```http
GET /api/hotels?city=Mumbai&page=1&limit=10
```

### Room Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/rooms` | Public | List and filter rooms |
| POST | `/rooms` | Admin | Create a room |
| PATCH | `/rooms/:id` | Admin | Update a room |
| DELETE | `/rooms/:id` | Admin | Delete a room |

Supported room filters include:

- `hotel`
- `type`
- `minPrice`
- `maxPrice`
- `capacity`
- `checkIn`
- `checkOut`
- `guests`

Example availability search:

```http
GET /api/rooms?checkIn=2027-01-15&checkOut=2027-01-18&guests=2
```

### Booking Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/bookings` | Authenticated | Create a booking |
| GET | `/bookings/my` | Authenticated | Retrieve personal bookings |
| GET | `/bookings/:id` | Owner or admin | Retrieve booking details |
| PATCH | `/bookings/:id/cancel` | Owner or admin | Cancel a booking |
| GET | `/bookings/admin/all` | Admin | Retrieve all bookings |

The booking total is calculated by the backend:

`Total Price = Price Per Night × Number of Nights × Rooms Booked`

## 🧪 Example API Requests

### Register a User

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Ajinkya",
  "email": "ajinkya@example.com",
  "password": "StrongPass123"
}
```

The response includes a user object and a JWT token.

### Log In

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ajinkya@example.com",
  "password": "StrongPass123"
}
```

Copy the returned token for authenticated requests.

### Create a Booking

```http
POST /api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

```json
{
  "room": "ROOM_MONGODB_ID",
  "checkIn": "2027-01-15",
  "checkOut": "2027-01-18",
  "guests": 2,
  "roomsBooked": 1
}
```

Replace `ROOM_MONGODB_ID` with the `_id` of an existing room.

The server validates the dates and room availability and calculates the total price.

### Retrieve Personal Bookings

```http
GET /api/bookings/my
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cancel a Booking

```http
PATCH /api/bookings/BOOKING_MONGODB_ID/cancel
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `BOOKING_MONGODB_ID` with the actual booking ID. Only the booking owner or an administrator can cancel it, and cancellation is restricted once check-in has started.

## 🔑 Authentication and Authorization

Protected routes require a JWT in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The API supports two roles:

- **User:** Can access personal booking operations.
- **Admin:** Can manage hotels and rooms and access the administrator booking list.

New registrations receive the `user` role by default. For local development, an administrator can be created using the seed script or by changing a user's role directly in the database.

Never expose an endpoint that lets users arbitrarily promote themselves to administrator.

## 🔮 Future Improvements

Potential enhancements include:

- Payment integration using Stripe or Razorpay.
- Email confirmations and booking notifications.
- Hotel reviews and ratings.
- Wishlist and favorite hotels.
- Image uploads using Cloudinary or Amazon S3.
- Automated API tests.
- API documentation using Swagger/OpenAPI.
- Atomic inventory reservations to prevent overbooking.
- Docker support and CI/CD deployment workflows.

## 🛡️ Security Notes

- Keep secrets in environment variables.
- Use HTTPS in production.
- Configure CORS for trusted frontend origins only.
- Validate and sanitize all request inputs.
- Use a concurrency-safe reservation strategy to prevent simultaneous bookings from exceeding room inventory.
- Add automated tests and monitoring before production deployment.
- Do not store raw payment card information.

This project is a backend starter, not a complete production booking and payment platform.

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [ajinkya029](https://github.com/ajinkya029)

---

⭐ If you find this project useful, consider giving the repository a star!
