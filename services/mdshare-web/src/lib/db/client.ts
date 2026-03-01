import { createClient } from '@libsql/client'
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql'
import { drizzle as drizzleD1 } from 'drizzle-orm/d1'

let dbInstance: ReturnType<typeof drizzleLibsql> | ReturnType<typeof drizzleD1> | null = null

export function isDbStrictMode(): boolean {
  return process.env.DB_STRICT === '1'
}

function getD1Binding(): any | null {
  const g = globalThis as unknown as { DB?: any }
  return g.DB ?? null
}

export function getDb() {
  if (dbInstance) return dbInstance

  // Cloudflare D1 binding path (recommended for Pages/Workers)
  const d1 = getD1Binding()
  if (d1) {
    dbInstance = drizzleD1(d1)
    return dbInstance
  }

  // LibSQL/Turso fallback path
  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
  if (!url) {
    if (isDbStrictMode()) {
      throw new Error('DB_STRICT is enabled but no DB binding found (expected D1 binding `DB` or DATABASE_URL/TURSO_DATABASE_URL)')
    }
    return null
  }

  const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN
  const client = createClient({ url, authToken })
  dbInstance = drizzleLibsql(client)
  return dbInstance
}
