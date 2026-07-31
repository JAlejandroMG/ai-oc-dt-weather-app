import type { AppConfig } from "../types"
import { saveCities } from "../storage/citiesStorage"
import { readLine, pressEnter } from "../presentation/input"
import { showSuccess, showWarning } from "../presentation/output"
import { listCities } from "./listCities"

export async function removeCity(config: AppConfig): Promise<AppConfig> {
  if (config.cities.length === 0) {
    showWarning("No hay ciudades para eliminar.")
    await pressEnter()
    return config
  }

  console.log("")
  console.log(listCities(config))
  const choice = parseInt(await readLine("\nNúmero a eliminar (0 para cancelar): "), 10)
  if (isNaN(choice) || choice < 1 || choice > config.cities.length) return config

  const cities = [...config.cities]
  const removed = cities.splice(choice - 1, 1)[0]
  if (!removed) return config
  if (removed.isDefault && cities.length > 0) {
    const first = cities[0]!
    cities[0] = { ...first, isDefault: true }
    console.log(`\n✅  ${first.name} establecida como nueva default.`)
  }
  await saveCities(cities)
  console.log(`\n✅  ${removed.name} eliminada.`)
  await pressEnter()
  return { ...config, cities }
}
