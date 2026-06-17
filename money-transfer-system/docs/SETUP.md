# Money Transfer System - Setup Guide

## Prerequisites

- Java 17
- Maven 3.8+
- MySQL 8.x
- Node.js LTS and Angular CLI (v19)
- Snowflake account (for analytics, optional)

## Backend Setup (Spring Boot)

1. **Create the database and user in MySQL:**

```sql
CREATE DATABASE money_transfer;
CREATE USER 'money_user'@'localhost' IDENTIFIED BY 'money_pass';
GRANT ALL PRIVILEGES ON money_transfer.* TO 'money_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Apply schema and seed data:**
From the project root directory, run:

```bash
mysql -u money_user -p money_transfer < database/schema.sql
mysql -u money_user -p money_transfer < database/seed-data.sql
```

3. **Start the backend server:**

```bash
cd backend
mvn spring-boot:run
```
The backend will run on `http://localhost:8080`.

### Backend APIs (Secured with JWT)

- `POST /api/auth/register` - Register a new user and auto-create an account with $1000 balance.
- `POST /api/auth/login` - Login to receive a JWT token.
- `GET /api/v1/accounts` - Get accounts for the logged-in user.
- `POST /api/v1/transfers` - Execute a money transfer (requires idempotencyKey).
- `GET /api/v1/accounts/{id}/transactions` - Get transaction history.
- `GET /api/rewards` - Get rewards earned by the user.
- `GET /api/rewards/summary` - Get total reward points.

*(Note: The previous documentation stated APIs were secured with Basic Auth, but they are actually secured with JWT.)*

## Frontend Setup (Angular)

1. **Install dependencies:**

```bash
cd frontend
npm install
```

2. **Run the development server:**

```bash
ng serve
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Features

- **Authentication:** JWT-based login and registration.
- **Transfers:** Idempotent, safe money transfers.
- **Rewards:** Earn 1 point for every $100 transferred to a different account.
- **History:** View all sent and received transactions with dynamic filtering.
- **Dashboard:** Overview of balance and reward points.

## Snowflake Analytics (Optional)

Run the scripts in `snowflake/schema.sql` and `snowflake/etl_and_queries.sql` inside your Snowflake environment to create the DW schema and test analytics queries like Total Rewards Distributed and Daily Transaction Volume.
