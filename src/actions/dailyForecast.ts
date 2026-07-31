import type { AppConfig } from "../types"
import { getDailyForecast } from "../api/weather"
import { formatDailyForecast } from "../utils/format"
import { pressEnter } from "../presentation/input"
import { showError, showWarning } from "../presentation/output"

export async function showDailyForecast(config: AppConfig): Promise<AppConfig> {
  const defaultCity = config.cities.find((c) => c.isDefault)
  if (!defaultCity) {
    showWarning("No hay ciudad default configurada.")
    await pressEnter()
    return config
  }
  const days = await getDailyForecast(defaultCity.latitude, defaultCity.longitude)
  if (!days) {
    showError(`Error al obtener pronóstico para ${defaultCity.name}`)
    await pressEnter()
    return config
  }
  const label = defaultCity.isDefault ? " (Default)" : ""
  console.log(`\n📍 ${defaultCity.name}${label}${defaultCity.country ? `, ${defaultCity.country}` : ""}`)
  console.log(`📅 Pronóstico 7 días\n`)
  console.log(formatDailyForecast(days, config))
  await pressEnter()
  return config
}
