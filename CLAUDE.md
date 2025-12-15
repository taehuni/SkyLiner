# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkyLiner is a Tokyo subway–based tourist attraction finder application.
It displays an interactive subway map and shows nearby tourist places for each station.
The data is retrieved from the ODPT API and the Google Places API, then stored in a MySQL database.
The system is also designed with flexibility for implementing additional features in the future.
The project must support route navigation between subway stations, including pathfinding and optimal route calculation.
The application must support both English and Korean languages.

**Architecture**: Full-stack monorepo with React frontend and Express backend
- **Client**: React 19 + Vite (SkyLiner/client)
- **Server**: Node.js + Express (SkyLiner/server)
- **Database**: MySQL with connection pooling (mysql2/promise)

## Development Commands


### Client (SkyLiner/client)
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (SkyLiner/server)
```bash1
npm start        # Production mode (node)
npm run dev      # Development mode (nodemon)
npm run sync     # Run data synchronization script
```

## Database Architecture

The MySQL database schema (`SkyLiner/server/database/subwat_project.sql`) contains:

**Core Tables:**
- `lineInfo` - Subway line information (lineCode PK, color, operator, multilingual names)
- `stationInfo` - Station metadata (stationGroupCode PK, lat/long, multilingual names, exitInfo JSON)
- `stationByLineInfo` - Station-to-line mapping (stationCode PK, links stations to lines)
- `placeInfo` - Tourist places from Google Places API (placeID PK, name, rating, address, imageReference, tags JSON)
- `stationNearByInfo` - Junction table linking stations to nearby places (with distance)
- `placeOpeningInfo` - Business hours by day of week
- `weatherInfo` - Weather data per station
- `transferInfo` - Station transfer times
- `trainInfo` - Train type and destination info
- `stationTimeInfo` - Station timetables

**Key Relationships:**
- Stations can belong to multiple lines (many-to-many via `stationByLineInfo`)
- Places are linked to stations via `stationNearByInfo` with distance metrics
- All multilingual fields support Ko/Ja/En/Zh variants

## API Routes

### Places API (`/api/places`)
- `GET /` - List all places (supports `?stationGroupCode=X&limit=20&offset=0`)
- `GET /:id` - Place details with opening hours
- `GET /search?keyword=X` - Search places by name/address

### Stations API (`/api/stations`)
- `GET /` - List all stations (supports `?lineCode=X`)
- `GET /:id` - Station details with connecting railways
- `GET /:id/places` - Places near specific station
- `GET /:id/weather` - Latest weather for station
- `GET /:id/transfers` - Transfer information
- `GET /lines/all` - All subway lines

## Client Architecture

**State Management**: React hooks (no external state library)

**Key Components:**
- `App.jsx` - Main entry point, manages page state (main/detail/admin), handles responsive layout switching
- `SubwayMap.jsx` - Interactive subway map wrapper using `SvgMapComponent.jsx`
- `SvgMapComponent.jsx` - Large SVG subway map (61KB), handles station click events
- `BottomSheet.jsx` - Mobile view for place listings
- `Sidebar.jsx` - Desktop view for place listings (shown when `window.innerWidth >= 1024`)
- `DetailPage.jsx` - Full-screen place details
- `AdminPage.jsx` - Admin mode for data management
- `PlaceCard.jsx` - Reusable place item component

**Responsive Breakpoint**: Desktop layout activates at 1024px width

**Custom Hooks:**
- `useMenuBarToggle()` - Menu open/close state
- `useAdminModeToggle()` - Admin mode state

## Server Architecture

**Entry Point**: `SkyLiner/server/src/app.js`

**Structure:**
- `config/database.js` - MySQL connection pool, exports `query()` helper and `pool`
- `routes/` - Express route handlers (places.js, stations.js)
- `services/` - External API integrations:
  - `googlePlaces.js` - Google Places API wrapper (search, details, photo URLs)
  - `odptAPI.js` - Tokyo public transport API integration
- `scripts/` - Data synchronization scripts:
  - `syncAllPlaces.js` - Collect places for all stations
  - `syncPlacesByStation.js` - Sync specific station
  - `dataSync.js` - Main sync orchestrator

**Development Workflow Guidelines:**
When implementing code, do not modify multiple files at the same time.
After completing or updating each individual file, you must submit it to me for review and approval before proceeding.
Once I review and approve the changes, you may continue to the next file or the next step of implementation.
When necessary, briefly explain the reason for the change and its potential impact.

**Environment Variables** (`.env`):
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `GOOGLE_PLACES_API_KEY`
- `PORT` (default: 5000)
- `NODE_ENV`

## Data Synchronization

The server includes scripts to populate the database with Google Places data:

1. Scripts query stations from `stationInfo` table
2. Call Google Places Nearby Search API (500m radius, tourist_attraction type)
3. Store results in `placeInfo` and link via `stationNearByInfo`
4. Rate limiting via delay functions to avoid API quota issues
5. Duplicate checking by `googlePlaceId`

**Running sync**: `cd SkyLiner/server && npm run sync`

## Important Implementation Notes

- **Database Connection**: Always use the `query()` helper from `config/database.js`, never create raw connections
- **Photo URLs**: Google Places photo references must be converted to full URLs using `getPhotoUrl()` helper
- **Multilingual Data**: Prefer Korean names (Ko) when available, fallback to Japanese (Ja), then English (En)
- **JSON Fields**: `tags`, `exitInfo`, and `openingHours` are stored as JSON - parse with `JSON.parse()` before use
- **Station Identification**: Use `stationGroupCode` (number) for station groups, `stationCode` (string) for line-specific stations
- **API Response Format**: All API responses follow `{ success: true/false, data: {...}, count?: N, error?: string, message?: string }`
- **Error Handling**: Routes include try-catch with detailed error logging and appropriate HTTP status codes

## Testing

No test framework is currently configured. Manual testing via:
- API endpoints: Use browser/Postman to test `http://localhost:5000/api/*`
- Client: Run dev server and check console for errors
- Database: Check logs in server console for SQL query execution
