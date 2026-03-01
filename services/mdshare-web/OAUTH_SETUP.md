# OAuth & DB Setup (Cloudflare Pages + D1)

## D1 binding (recommended)

Use Cloudflare Pages/Workers binding name: `DB`

- Runtime will auto-detect `globalThis.DB`
- No `DATABASE_URL` needed in D1 mode
- For strict mode, set `DB_STRICT=1`

### Required vars for strict mode
- `DB_STRICT=1`

### Optional fallback (Turso/libsql)
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`

## Google OAuth env
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BETTER_AUTH_URL=https://openhow.io`
