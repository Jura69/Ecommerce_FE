# E-commerce Frontend

React 18 + Vite + Material-UI frontend for the e-commerce platform.

## Features

- ✅ JWT Authentication (Login/Signup)
- ✅ Material-UI v6 Components
- ✅ Zustand State Management
- ✅ Axios with Auto Token Refresh
- ✅ Route Guards (Auth/Guest)
- ✅ Responsive Design
- ✅ Docker Support

## Quick Start

### Development (Local)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:5173
```

### Development (Docker)

```bash
# From project root
docker-compose up -d frontend

# View logs
docker-compose logs -f frontend
```

## Project Structure

```
frontend-ecommerce/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   │   └── auth/       # Login, Signup pages
│   ├── layouts/        # Layout wrappers
│   ├── guards/         # Route protection (AuthGuard, GuestGuard)
│   ├── services/       # API services
│   │   └── api/        # Axios config, auth service
│   ├── store/          # Zustand stores
│   ├── theme/          # MUI theme configuration
│   ├── config/         # Constants and configuration
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
├── Dockerfile          # Multi-stage Docker build
├── vite.config.js      # Vite configuration
└── package.json
```

## Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3056/v1/api
VITE_API_KEY=api-key-dev-2025
VITE_APP_ENV=development
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Authentication Flow

1. User submits login/signup form
2. API call to backend with credentials
3. Receive JWT tokens (access + refresh)
4. Store tokens in localStorage
5. Add tokens to all API requests via interceptor
6. Auto-refresh on 401 errors

## API Integration

All API calls go through service layer:

```javascript
// src/services/api/authService.js
import { authService } from '../services/api/authService';

const response = await authService.login({ email, password });
```

Axios instance automatically adds:
- `x-api-key` header
- `authorization` header (if logged in)
- `x-client-id` header (if logged in)

## State Management

Using Zustand for global state:

```javascript
// In component
import { useAuthStore } from '../store/authStore';

const { user, login, logout } = useAuthStore();
```

## Documentation

See [Docs/](../Docs/) folder for comprehensive documentation:

- [Frontend-Architecture.md](../Docs/Frontend-Architecture.md) - Architecture patterns
- [Frontend-Development.md](../Docs/Frontend-Development.md) - Development workflow
- [UI-Guidelines.md](../Docs/UI-Guidelines.md) - Material-UI usage

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Material-UI v6** - Component library
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router v7** - Routing

## Production Build

### Docker (Nginx)

```bash
# Build production image
docker-compose build --build-arg FRONTEND_BUILD_TARGET=production frontend

# Run production container
docker-compose up -d frontend
```

### Manual Build

```bash
npm run build
# Output in dist/ folder

# Preview
npm run preview
```

## License

ISC
