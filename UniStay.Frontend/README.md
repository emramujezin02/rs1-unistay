# UniStay

UniStay is a student accommodation management application. It provides a public room browsing experience for visitors, student self-service features, and administrative tools for managing rooms, halls, users, accommodation applications, faults, equipment, payments, notifications, and communication.

The project is organized as a separate Angular frontend and ASP.NET Core backend.

## Features

### Authentication and Account Security

- User registration, login, logout, and refresh-token based sessions
- JWT authentication with an Angular HTTP interceptor
- Role-aware navigation for admin, employee, and student dashboards
- Remember Me support during login
- Password recovery and password reset
- Security questions and answers
- Two-factor authentication with trusted devices and backup codes
- CAPTCHA validation for authentication flows

### Student Accommodation

- Public room listing and room details
- Room management with room images, beds, capacity, accessibility, and building information
- Hall management and hall reservations
- Accommodation applications with admin review/approval screens
- Bed assignment management
- Favorite rooms
- Room reviews and reactions

### Administration and Operations

- User management
- Fault reporting and fault status management
- Equipment and equipment item management
- Announcements with audience targeting
- Invitations
- Notifications and Firebase push notification support
- File uploads served from the API `uploads` folder
- Webhook subscription management and test dispatching

### Payments and Communication

- Stripe payment intent and webhook support
- Invoice listing and invoice PDF generation
- Real-time chat with SignalR
- Analytics dashboard with a SignalR analytics hub and background analytics service

### User Experience

- Light/dark theme support
- Internationalization with English and Bosnian translation files
- Angular route animations
- Public landing/home pages with accommodation content

## User Roles

### Admin

Admins can access the main administrative dashboard and manage halls, rooms, faults, equipment, invitations, payments, announcements, bed assignments, hall reservations, webhooks, accommodation applications, users, security questions, chat, and profile settings.

### Employee

Employees have an operational dashboard for halls, rooms, students, hall reservations, faults, equipment, invitations, chat, security questions, and profile settings.

### Student

Students can use the student dashboard, submit accommodation applications, browse rooms, view room details, manage favorite rooms, view invoices, use chat/messages, invite friends, configure security questions, and update profile settings.

### Manager

A `Manager` role is seeded in the backend data, but no dedicated frontend manager dashboard was found in the Angular routing.

## Technologies

### Frontend

- Angular 19
- TypeScript
- Angular Router
- Angular Material and Angular CDK
- Angular Forms and Reactive Forms
- RxJS
- Angular Animations
- ngx-translate
- Firebase client SDK
- SignalR client
- Stripe.js
- ngx-captcha
- Karma and Jasmine for Angular tests

### Backend

- ASP.NET Core 8
- C#
- Entity Framework Core
- SQL Server provider for EF Core
- MediatR
- FluentValidation
- ASP.NET Core JWT Bearer authentication
- ASP.NET Core SignalR
- Serilog
- Swagger / Swashbuckle
- xUnit integration and unit tests

### Database

- Microsoft SQL Server
- Entity Framework Core migrations in `UniStay.Backend/UniStay.Infrastructure/Migrations`
- Startup database initialization and seed data in the infrastructure layer
- EF Core InMemory database is used for test environments

### Additional Technologies

- Stripe payments
- Firebase Admin SDK and Firebase Cloud Messaging
- SMTP email service
- Google reCAPTCHA validation
- QuestPDF for invoice PDF generation
- Local file storage for uploaded files
- Webhook dispatching through an HTTP client

No Dockerfile, Docker Compose setup, RabbitMQ integration, or database backup file was found in the inspected project files.

## Architecture

The backend follows a layered architecture:

- `UniStay.API` exposes REST controllers, Swagger, JWT authentication, CORS, rate limiting, exception handling, static upload files, and SignalR hubs.
- `UniStay.Application` contains application modules organized around commands, queries, handlers, DTOs, and validators. MediatR dispatches commands and queries, and FluentValidation is registered through a MediatR validation pipeline.
- `UniStay.Domain` contains the core domain entities for identity, housing, applications, reservations, payments, notifications, communication, and webhooks.
- `UniStay.Infrastructure` contains persistence, EF Core configurations and migrations, database seeders, background services, SignalR hubs, Firebase, email, CAPTCHA, Stripe, PDF, file storage, and webhook services.
- `UniStay.Shared` contains shared DTOs, constants, and strongly typed options.

The Angular frontend is module-based. It separates public pages, authentication, shared reusable features, and role-specific admin, employee, and student dashboards. API calls are grouped under endpoint services in `src/app/endpoints`.

## Project Structure

```text
rs1-work/
|-- UniStay.Backend/
|   |-- UniStay.API/
|   |   |-- Controllers/
|   |   |-- Middleware/
|   |   |-- Program.cs
|   |   `-- appsettings.json
|   |-- UniStay.Application/
|   |   `-- Modules/
|   |-- UniStay.Domain/
|   |   `-- Entities/
|   |-- UniStay.Infrastructure/
|   |   |-- Database/
|   |   |-- Migrations/
|   |   |-- Hubs/
|   |   |-- Services/
|   |   `-- Pdf/
|   |-- UniStay.Shared/
|   |-- UniStay.Tests/
|   |-- layers.png
|   `-- UniStay.Backend.sln
|-- UniStay.Frontend/
|   |-- public/
|   |   |-- i18n/
|   |   `-- images/
|   |-- src/
|   |   `-- app/
|   |       |-- core/
|   |       |-- endpoints/
|   |       |-- modules/
|   |       |-- services/
|   |       `-- app-routing.module.ts
|   |-- angular.json
|   |-- package.json
|   `-- README.md
`-- README.md
```

## Prerequisites

- Node.js and npm
- Angular CLI, optional but useful for `ng` commands
- .NET 8 SDK
- Microsoft SQL Server

## Configuration

### Backend

Backend configuration is stored in:

```text
UniStay.Backend/UniStay.API/appsettings.json
UniStay.Backend/UniStay.API/appsettings.Development.json
```

Important configuration sections include:

- `ConnectionStrings:Main` for SQL Server
- `Jwt` for access and refresh token settings
- `Stripe` for payment integration
- `EmailSettings` for SMTP email sending
- `Frontend` and `App` base URLs
- `Recaptcha` for CAPTCHA validation
- `Firebase` for push notifications
- `Serilog` for console and file logging

Before running the project on another machine, update these values for the local environment and avoid committing real production secrets.

### Frontend

The frontend API base URL is configured in:

```text
UniStay.Frontend/src/app/my-config.ts
```

The inspected configuration points the Angular app to:

```text
http://localhost:5177
```

## Running the Project

### Backend

From the backend folder:

```bash
cd UniStay.Backend
dotnet restore
dotnet run --project UniStay.API/UniStay.API.csproj --launch-profile http
```

The API runs on:

```text
http://localhost:5177
```

Swagger is available in development at:

```text
http://localhost:5177/swagger
```

The API applies database initialization and seed data on startup.

### Frontend

From the frontend folder:

```bash
cd UniStay.Frontend
npm install
npm start
```

The Angular development server runs on:

```text
http://localhost:4200
```

## Testing

### Backend Tests

```bash
cd UniStay.Backend
dotnet test
```

The backend includes xUnit tests under `UniStay.Tests`.

### Frontend Tests

```bash
cd UniStay.Frontend
npm test
```

The frontend test setup uses Karma and Jasmine.

## Documentation and Assets

- `UniStay.Backend/layers.png` contains an architecture/layer diagram.
- `UniStay.Frontend/public/i18n/en.json` and `bs.json` contain translation resources.
- `UniStay.Frontend/public/images` and `public/rooms` contain frontend image assets.
