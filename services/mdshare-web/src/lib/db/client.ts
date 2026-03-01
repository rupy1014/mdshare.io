import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

let dbInstance: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (dbInstance) return dbInstance

  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
  if (!url) return null

  const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN
  const client = createClient({ url, authToken })
  dbInstance = drizzle(client)
  return dbInstance
}
