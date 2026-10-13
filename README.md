# Travel Tales

Travel Tales is a role-based travel discovery application. Travellers can browse
places, while guides can create and manage place listings. The project contains a
React single-page application and an ASP.NET Core Web API.

## Features

- Register and sign in with email and password.
- Assign users the `Guide` or `Traveller` role.
- Browse place listings as a traveller.
- Create, edit, and delete place listings as a guide.
- Protect API routes with JWT bearer authentication and role authorization.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, React Router, Axios |
| Backend | ASP.NET Core 6 Web API, ASP.NET Core Identity |
| Data | Entity Framework Core 6, SQL Server |
| Authentication | JWT bearer tokens |
| Logging and API docs | Serilog, Swagger / OpenAPI |

## Repository layout

```text
.
├── dotnetapp/       ASP.NET Core API, data access, models, and services
├── reactapp/        React client
└── README.md
```

## Prerequisites

- .NET 6 SDK
- Node.js and npm
- SQL Server (local or remote)
- A JWT signing key for local development

## Configuration

The backend reads configuration from environment variables. Do not put database
passwords, signing keys, or other credentials in tracked files.

In PowerShell, set the backend configuration in the terminal where you will run
the API:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=TravelTales;User Id=<user>;Password=<password>;TrustServerCertificate=True;"
$env:JWT__Secret = "<generate-a-random-secret-of-at-least-32-bytes>"
$env:JWT__ValidIssuer = "TravelTales"
$env:JWT__ValidAudience = "TravelTales"
```

Replace the placeholders with values for your environment. Keep the signing key
private and use a different key outside local development.

The frontend reads its API address from `REACT_APP_API_URL`. Set this to the
backend origin, for example `http://localhost:8080` (without an `/api` suffix).
Create or update `reactapp/.env.local`:

```dotenv
REACT_APP_API_URL=http://localhost:8080
```

The React source imports `reactapp/src/apiConfig.js`, which is ignored by Git and
is not included in a fresh checkout. If that file is not present, create it with:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default API_BASE_URL;
```

## Database setup

The API applies Entity Framework migrations during startup. This repository does
not currently include a tracked `dotnetapp/Migrations` directory, so a new
checkout needs an initial migration before the database can be initialized.

From the repository root, run these commands after setting the backend
environment variables above:

```powershell
cd dotnetapp
dotnet tool restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Commit the generated migration files so other developers and deployment
environments can create or update the schema. The repository currently ignores
`dotnetapp/Migrations`; remove that ignore rule before adding the generated
migrations to source control.

## Run locally

Start the backend from the `dotnetapp` directory:

```powershell
dotnet run --launch-profile dotnetapp
```

The launch profile listens on port `8080` and uses the Development environment.
Swagger is available at [http://localhost:8080/swagger](http://localhost:8080/swagger).

In a second terminal, start the React client:

```powershell
cd reactapp
npm install
npx cross-env BROWSER=none PORT=8081 react-scripts start --disable-host-check --host 0.0.0.0
```

Open [http://localhost:8081](http://localhost:8081). The API URL must be set
before starting the development server; restart the server after changing
`.env.local`.

## API overview

All routes are served from the backend origin. Place routes require a bearer
token; read routes accept either role, and write routes require the `Guide` role.

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/register` | Public | Register an account |
| `POST` | `/api/login` | Public | Sign in and receive a JWT |
| `GET` | `/api/place` | Guide, Traveller | List places |
| `GET` | `/api/place/{placeId}` | Guide, Traveller | Get a place |
| `POST` | `/api/place` | Guide | Add a place |
| `PUT` | `/api/place/{placeId}` | Guide | Update a place |
| `DELETE` | `/api/place/{placeId}` | Guide | Delete a place |

Send the token returned by login on protected requests:

```http
Authorization: Bearer <jwt>
```

## Useful commands

Run the frontend production build:

```powershell
cd reactapp
npm run build
```

Run the frontend Jest tests:

```powershell
cd reactapp
npm test -- --watchAll=false
```

Build the backend:

```powershell
cd dotnetapp
dotnet build
```

## Security notes

- Never commit real credentials, connection strings, or private signing keys.
- Configure secrets through environment variables or a managed secret store.
- Use HTTPS and production-grade secret management when deploying.
- Rotate any credential that has been exposed in a repository or log.
