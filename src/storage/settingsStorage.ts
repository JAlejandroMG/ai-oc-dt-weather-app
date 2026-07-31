import type { Unit } from "../types"
import { readConfig, writeConfig } from "./config"

export async function loadSettings(): Promise<Unit> {
  const config = await readConfig()
  return config?.units ?? "celsius"
}

export async function saveSettings(units: Unit): Promise<void> {
  const config = await readConfig() ?? { units: "celsius", cities: [] }
  await writeConfig({ ...config, units })
}
