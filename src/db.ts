import type { AppConfig } from "./types"

const DB_PATH = "cities.json"

function defaultConfig(): AppConfig {
  return { units: "celsius", cities: [] }
}

export async function loadConfig(): Promise<AppConfig> {
  try {
    const file = Bun.file(DB_PATH)
    const exists = await file.exists()
    if (!exists) {
      const config = defaultConfig()
      await saveConfig(config)
      return config
    }
    const data = await file.json()
    return { units: data.units ?? "celsius", cities: data.cities ?? [] }
  } catch {
    return defaultConfig()
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await Bun.write(DB_PATH, JSON.stringify(config, null, 2))
}
