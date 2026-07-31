import type { AppConfig } from "../types"

const DB_PATH = "cities.json"

export async function readConfig(): Promise<AppConfig | null> {
  try {
    const file = Bun.file(DB_PATH)
    const exists = await file.exists()
    if (!exists) return null
    const data = await file.json()
    return { units: data.units ?? "celsius", cities: data.cities ?? [] }
  } catch {
    return null
  }
}

export async function writeConfig(config: AppConfig): Promise<void> {
  await Bun.write(DB_PATH, JSON.stringify(config, null, 2))
}
