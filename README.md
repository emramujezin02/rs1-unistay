# UniStay

UniStay is a student accommodation management application. It provides separate areas for students, employees and administrators to manage rooms, halls, applications, maintenance faults, equipment, payments, announcements and communication.

The project is organized as an Angular frontend and an ASP.NET Core backend, with SQL Server used as the main database.

## Technologies

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server provider for Entity Framework Core
- MediatR
- FluentValidation
- JWT authentication with refresh tokens
- SignalR
- Serilog
- Swagger / OpenAPI
- xUnit for backend tests

### Frontend

- Angular 19
- TypeScript
- Angular Material
- Reactive Forms
- ngx-translate
- SignalR client
- Stripe.js
- Firebase client assets
- ngx-captcha

### Database

- Microsoft SQL Server
- Entity Framework Core migrations
- Development database seeding

### Other

- Stripe integration for payments
- Firebase push notification support
- SMTP email service
- Google reCAPTCHA support
- Local file upload storage

## User Roles

- Admin - manages users, halls, rooms, bed assignments, applications, invoices, announcements, webhooks and system-level data.
- Student - views rooms, applies for accommodation, manages favorites, pays invoices, uses chat and updates profile/security settings.
- Employee - works with halls, rooms, students, faults, equipment, hall reservations and chat.
- Manager - exists as a seeded backend role and user flag, but the current frontend routing is focused on admin, student and employee areas.

## Main Features

- Authentication and authorization - login, registration, logout, JWT access tokens and refresh tokens.
- Two-factor authentication - two-factor setup and verification modules are present.
- Password recovery - password reset flow with security question support.
- Room and hall management - browsing and administration of student accommodation rooms and halls.
- Accommodation applications - students can apply and admins can review, approve or reject applications.
- Bed assignments - admins can assign students to available beds.
- Fault management - users can report and manage maintenance faults.
- Equipment management - equipment and individual equipment items can be managed and assigned.
- Favorites and reviews - students can save favorite rooms and create room reviews with reactions.
- Hall reservations - reservations can be created, listed and approved or rejected.
- Payments and invoices - invoices and Stripe payment flow are implemented.
- Notifications and announcements - users receive notifications and announcements can be created for different audiences.
- Chat - real-time communication is implemented with SignalR.
- Analytics - analytics endpoints and a SignalR analytics hub are available.
- Theme and language support - frontend includes light/dark theme support and English/Bosnian translations.
- File uploads - uploaded files are stored locally by the backend.

## Project Structure

```text
RazvojSoftvera1/
|-- UniStay.Backend/
|   |-- UniStay.API/
|   |-- UniStay.Application/
|   |-- UniStay.Domain/
|   |-- UniStay.Infrastructure/
|   |-- UniStay.Shared/
|   |-- UniStay.Tests/
|   `-- UniStay.Backend.sln
|-- UniStay.Frontend/
|   |-- public/
|   |-- src/
|   |-- angular.json
|   `-- package.json
|-- UniStay.Db-backups/
|   `-- UniStay26.zip
|-- UniStay.Dokumenti/
`-- README.md
```

## Backend Architecture

The backend is split into API, Application, Domain, Infrastructure and Shared projects. Controllers are in `UniStay.API`, request handling is organized through MediatR commands and queries in `UniStay.Application`, domain entities are in `UniStay.Domain`, and database/services/integrations are implemented in `UniStay.Infrastructure`.

On startup, the API applies EF Core migrations and, in the Development environment, runs the dynamic seed process.

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js and npm
- SQL Server

### Backend

From the project root:

```bash
cd UniStay.Backend
dotnet restore UniStay.Backend.sln
dotnet run --project UniStay.API/UniStay.API.csproj --launch-profile http
```

The HTTP launch profile runs the API on:

```text
http://localhost:5177
```

Swagger is enabled in Development mode.

### Frontend

From the project root:

```bash
cd UniStay.Frontend
npm install
npm start
```

The Angular development server runs on:

```text
http://localhost:4200
```

The frontend configuration points API calls to `http://localhost:5177`.

### Database

The backend uses the `ConnectionStrings:Main` value from `UniStay.Backend/UniStay.API/appsettings.json`. The configured provider is SQL Server.

When the API starts outside the Test environment, EF Core migrations are applied automatically. In Development, demo data is also seeded automatically. A database backup archive is present in `UniStay.Db-backups/UniStay26.zip`.

## Default / Seed Users

The following demo users are seeded by the backend in Development:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@unistay.ba` | `Admin123!` |
| Manager | `manager@unistay.local` | `Manager123!` |
| Employee | `employee@unistay.ba` | `Employee123!` |
| Student | `student@unistay.ba` | `Student123!` |

Additional demo students are also seeded with the password `Student123!`.

## Testing

Backend tests are located in `UniStay.Backend/UniStay.Tests` and use xUnit:

```bash
cd UniStay.Backend
dotnet test UniStay.Backend.sln
```

Frontend test files are present under `UniStay.Frontend/src`, and the npm test script runs Angular/Karma tests:

```bash
cd UniStay.Frontend
npm test
```

## Configuration Notes

- Backend settings are in `UniStay.Backend/UniStay.API/appsettings.json`.
- Frontend API base URL is configured in `UniStay.Frontend/src/app/my-config.ts`.
- No Docker Compose file was found in the project.
