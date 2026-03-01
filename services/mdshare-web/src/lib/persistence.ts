import fs from 'node:fs/promises'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), '.data')

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  await ensureDataDir()
  const p = path.join(DATA_DIR, fileName)
  try {
    const raw = await fs.readFile(p, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    await writeJsonFile(fileName, fallback)
    return fallback
  }
}

export async function writeJsonFile<T>(fileName: string, value: T): Promise<void> {
  await ensureDataDir()
  const p = path.join(DATA_DIR, fileName)
  await fs.writeFile(p, JSON.stringify(value, null, 2), 'utf-8')
}
