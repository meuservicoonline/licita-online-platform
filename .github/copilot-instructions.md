# LicitaFácil Platform - AI Agent Instructions

## Project Overview
LicitaFácil is a bidding management system specifically designed for MEI (Individual Microentrepreneurs), Micro, and Small Businesses, offering complete functionality for document management, bidding tracking, and deadline control.

## Architecture & Structure

### Frontend (React + Vite)
- Single Page Application using React 18
- Core Components:
  - `src/App.jsx`: Main application shell, handles routing and state management
  - `src/components/`: UI components using Shadcn/UI design system
  - Key Views:
    - Dashboard (`src/Dashboard.jsx`)
    - Company Management (`src/EmpresaForm.jsx`)
    - Document Management (`src/DocumentosManager.jsx`)
    - Bidding Management (`src/LicitacoesManager.jsx`)

### Backend (Python Flask)
- RESTful API with Flask
- Key Components:
  - `api/main.py`: Application entry point and route registration
  - `api/models/`: Data models (empresa, documento, licitacao)
  - `api/routes/`: Route handlers organized by domain
- SQLite Database (configured differently for Vercel deployment)

## Development Workflow

### Setup & Running
1. Frontend:
   ```bash
   npm install
   npm run dev    # Development server
   npm run build  # Production build
   ```
2. Backend:
   ```bash
   pip install -r requirements.txt
   python -m flask run
   ```

## Key Patterns & Conventions

### State Management
- Company state is managed at the App level and passed down via props
- Components use local state for UI-specific concerns
- API calls use fetch directly, with standard error handling patterns

### Component Structure
- Shadcn/UI components are used for consistent styling
- Components are organized by domain (empresa, documentos, licitacoes)
- Reusable UI components are in `src/components/ui/`

### API Routes
- All backend routes are prefixed with `/api`
- Routes are organized by domain in separate blueprints
- Standard response format: JSON with appropriate HTTP status codes

## Integration Points
- Frontend-Backend: REST API calls via fetch
- Database: SQLite with different configurations for development and Vercel
- Authentication: Not yet implemented (future addition point)

## Common Tasks
- Adding new API endpoint: Create route in appropriate blueprint under `api/routes/`
- Adding new UI component: 
  1. Create component in appropriate domain folder
  2. Import Shadcn/UI components from `@/components/ui/`
  3. Update parent component to include new feature

## Deployment
- Platform is configured for Vercel deployment
- Frontend: Built with Vite
- Backend: Uses Vercel Python runtime configuration