import type { AppConfig, City } from "../types"
import { searchCity } from "../api/geocoding"
import { saveCities } from "../storage/citiesStorage"
import { readLine, pressEnter } from "../presentation/input"
import { showError, showSuccess } from "../presentation/output"

export async function addCity(config: AppConfig): Promise<AppConfig> {
  const name = await readLine("\nNombre de la ciudad: ")
  if (!name) return config

  console.log("  Buscando...")
  const result = await searchCity(name)
  if (!result) {
    showError("Ciudad no encontrada.")
    await pressEnter()
    return config
  }

  console.log(`\n📌 ${result.name}${result.country ? `, ${result.country}` : ""}`)
  const confirm = await readLine("¿Agregar esta ciudad? (s/n): ")
  if (confirm.toLowerCase() !== "s") return config

  const isDefault = config.cities.length === 0
  const city: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    isDefault,
  }
  const cities = [...config.cities, city]
  await saveCities(cities)

  if (isDefault) {
    showSuccess("Ciudad agregada y establecida como default.")
  } else {
    showSuccess("Ciudad agregada.")
  }
  await pressEnter()
  return { ...config, cities }
}
