import type { City } from "../types"
import { readConfig, writeConfig } from "./config"

export async function loadCities(): Promise<City[]> {
  const config = await readConfig()
  return config?.cities ?? []
}

export async function saveCities(cities: City[]): Promise<void> {
  const config = await readConfig() ?? { units: "celsius", cities: [] }
  await writeConfig({ ...config, cities })
}
