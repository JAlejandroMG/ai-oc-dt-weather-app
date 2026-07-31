import type { AppConfig } from "../types"
import { saveCities } from "../storage/citiesStorage"
import { readLine, pressEnter } from "../presentation/input"
import { showSuccess, showWarning } from "../presentation/output"
import { listCities } from "./listCities"

export async function setDefaultCity(config: AppConfig): Promise<AppConfig> {
  if (config.cities.length === 0) {
    showWarning("No hay ciudades registradas.")
    await pressEnter()
    return config
  }

  console.log("")
  console.log(listCities(config))
  const choice = parseInt(await readLine("\nSelecciona nueva default (0 para cancelar): "), 10)
  if (isNaN(choice) || choice < 1 || choice > config.cities.length) return config

  const cities = config.cities.map((c, i) => ({ ...c, isDefault: i === choice - 1 }))
  await saveCities(cities)
  const selected = cities[choice - 1]!
  showSuccess(`${selected.name} es ahora la ciudad default.`)
  await pressEnter()
  return { ...config, cities }
}
