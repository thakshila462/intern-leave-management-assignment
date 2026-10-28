#  Leave Management System

## 1. Project Overview

The  Leave Management System is a full-stack web application developed for the Software Engineering Intern technical assignment at Omibits (Pvt) Ltd.

The system allows users to manage employee information and leave requests. Administrators can review pending leave requests and approve or reject them.

## 2. Features

### Employee Management
- Create new employees.
- View all employees.
- Validate required fields and email addresses.

### Leave Management
- Submit leave requests.
- Select leave types: Annual, Casual, and Medical.
- Specify start date, end date, and reason.
- View all leave requests and their statuses.
- Prevent invalid leave date ranges.

### Administrator Functions
- View all leave requests.
- Approve pending leave requests.
- Reject pending leave requests with a rejection reason.
- Track Pending, Approved, and Rejected statuses.

## 3. Technologies Used

Update this section to match the technologies used in the project.

- **Frontend:** React
- **Backend:** Node.js and Express.js
- **Database:** MySQL
- **API:** REST API
- **Version Control:** Git and GitHub

## 4. Structure
Customer-Inquiry-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md

*Note: Update the structure to match the actual project files.*

## 5. Prerequisites

Install the following software before running the application:

- Node.js
- npm
- MySQL
- Git

## 6. Database Setup

1. Start MySQL.
2. Create a database for the application.
3. Execute the SQL schema or migration files included in the project.
4. Configure the database connection in the backend environment variables.

Example:

```sql
CREATE DATABASE intern_leave_management;
```

Use the actual database name configured in the project.

## 7. Environment Variables

Create a `.env` file in the backend directory and configure the variables required by the application.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=intern_leave_management
DB_USER=your_database_username
DB_PASSWORD=your_database_password
JWT_SECRET=your_secret_key
```

The variable names must match those used by the backend code. Remove variables that the application does not use.

Never commit `.env` files containing passwords or secrets to GitHub.

## 8. Installation and Execution

### Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
npm run dev
```

Ensure that the backend `package.json` contains a `dev` script. Otherwise, use the appropriate command defined in the project.

The backend API is expected to run at:

```text
http://localhost:5000
```

### Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by the frontend development server in your browser.

Ensure that the frontend API URL matches the backend configuration.

## 9. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Create an employee |
| GET | `/api/employees` | Retrieve all employees |
| POST | `/api/leaves` | Submit a leave request |
| GET | `/api/leaves` | Retrieve all leave requests |
| PATCH | `/api/leaves/:id/approve` | Approve a leave request |
| PATCH | `/api/leaves/:id/reject` | Reject a leave request |

These endpoints should match the routes implemented in the backend.

### Example: Create an Employee

**Request:**

```http
POST /api/employees
Content-Type: application/json
```

```json
{
  "name": "abcd",
  "email": "abcd@example.com",
  "department": "IT"
}
```

### Example: Submit a Leave Request

```json
{
  "employeeId": 1,
  "leaveType": "Annual",
  "startDate": "2026-11-02",
  "endDate": "2026-11-04",
  "reason": "Personal matters"
}
```

Update the field names according to the actual API implementation.

## 10. Validation and Error Handling

- Employee name, email, and department are required.
- Email addresses must have a valid format.
- Leave types must be Annual, Casual, or Medical.
- The end date cannot be earlier than the start date.
- A rejection reason must be provided when rejecting a request.
- Invalid requests should return meaningful error messages.
- Leave status transitions should be validated by the backend.

## 11. Testing

The following scenarios should be tested:

- Creating an employee with valid details.
- Rejecting invalid employee information.
- Submitting a valid leave request.
- Rejecting invalid date ranges.
- Approving a pending leave request.
- Rejecting a pending leave request with a reason.
- Preventing invalid status changes.
- Confirming that records persist in the database.

Add details of the tests actually completed and include automated tests where available.

## 12. Design Decisions and Challenges

A relational database is used to store employee information and leave requests while maintaining relationships between them.

Input validation helps maintain data consistency. Business rules are enforced by the backend rather than relying only on frontend validation.

The application separates routing, business logic, and database operations to improve maintainability.

Update this section with the actual design decisions and challenges encountered during development.

## 13. Screenshots

Add screenshots of the working application to demonstrate its main features.

(The application screenshots are available in the `assets` folder.)


## 14. Security Notes

Authentication is optional for this assignment. Administrator operations must not be described as secure unless appropriate authorization is implemented.

- Do not commit passwords or API secrets.
- Store sensitive configuration in environment variables.
- Validate incoming data on the backend.
- Use parameterized SQL queries.
- Protect administrative endpoints with authorization if administrator-only access is required.

n

## 16. Repository Information

**Repository Name:** `intern-leave-management-assignme`

The repository contains the source code, database schema or migrations, setup instructions, API documentation, and relevant application screenshots.
