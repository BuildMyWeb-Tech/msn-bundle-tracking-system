# MSN Bundle Tracking System

Reused architecture, design system, and patterns from `msn-gate-management-system`
(React + Vite PWA frontend, Node/Express + MSSQL backend).

## Structure
- `backend/` — Express API. Login wired to `PR_AppValidate_UserLogin` against the
  `LandMark` DB (same server as Gate Management, different database).
- `frontend/` — React + Vite PWA. Login → Landing (Bundle Issue / Bundle Receipt / Log Out)
  → Search-or-Show screen → Barcode entry screen.

## Setup
```bash
# backend
cd backend
cp .env.example .env   # fill in real DB_PASSWORD etc.
npm install
npm run dev

# frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Status — Phase 1
- ✅ Login wired to the real SP (`PR_AppValidate_UserLogin`), returns login result + menu rows in one call.
- ✅ All 5 screens built and navigable (Landing, Bundle Issue Search/Entry, Bundle Receipt Search/Entry).
- ⏳ Mocked (marked with `// TODO` in code), pending SP details:
  - PO search/show lookup (Style/Size/Issued|Received/Pending table)
  - Process & Party dropdown data sources
  - Barcode → Style/Size/Qty lookup
  - Save endpoints for Bundle Issue / Bundle Receipt

## Known data note
Sample SP output showed `MenuName` and `FormName` values that look swapped/placeholder
(e.g. `MenuName: Bundle Issue` paired with `FormName: Bundles Receipt`). The landing
page matches tiles on `MenuName` only, so this doesn't affect navigation, but worth
confirming with whoever owns the SP.
