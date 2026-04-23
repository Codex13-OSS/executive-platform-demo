# Contract

## Demo flow
Dashboard -> EntryForm -> ActionConversion -> TrackingView -> Reset -> Dashboard

## Frontend views
- Dashboard
- EntryForm
- ActionConversion
- TrackingView

## Shared types

### DashboardSummary
- meetingsToday: number
- activePending: number
- criticalAlerts: number

### RawEntry
- id: string
- text: string
- category: string
- owner: string
- priority: "low" | "medium" | "high"
- createdAt: string

### ActionItem
- id: string
- title: string
- category: string
- owner: string
- status: "assigned" | "pending" | "confirmed"
- priority: "low" | "medium" | "high"
- nextStep: string

## API endpoints
- GET /api/dashboard
- POST /api/entries
- POST /api/entries/:id/convert
- GET /api/tracking
- POST /api/reset

## Example entry
“Barbara buscó reunión. Revisar permiso pendiente. Confirmar comité.”

## Example generated actions
- Barbara — reunión — assigned
- Permiso — pendiente — pending
- Comité — agenda — confirmed
