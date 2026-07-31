import type { AppConfig, City } from "../types"
import { getWeather } from "../api/weather"
import { formatWeather } from "../utils/format"
import { pressEnter } from "../presentation/input"
import { showError, showWarning } from "../presentation/output"

async function showCityWeather(city: City, config: AppConfig): Promise<void> {
  const weather = await getWeather(city.latitude, city.longitude)
  if (!weather) {
    showError(`Error al obtener clima para ${city.name}`)
    return
  }
  const label = city.isDefault ? " (Default)" : ""
  console.log(`\n📍 ${city.name}${label}${city.country ? `, ${city.country}` : ""}`)
  console.log(`   ${formatWeather(weather.weathercode, weather.temperature, weather.windspeed, config)}`)
}

export async function showDefaultCityWeather(config: AppConfig): Promise<AppConfig> {
  const defaultCity = config.cities.find((c) => c.isDefault)
  if (!defaultCity) {
    showWarning("No hay ciudad default configurada.")
    await pressEnter()
    return config
  }
  await showCityWeather(defaultCity, config)
  await pressEnter()
  return config
}

export async function showAllCitiesWeather(config: AppConfig): Promise<AppConfig> {
  if (config.cities.length === 0) {
    showWarning("No hay ciudades registradas.")
    await pressEnter()
    return config
  }
  for (const city of config.cities) {
    await showCityWeather(city, config)
  }
  await pressEnter()
  return config
}
