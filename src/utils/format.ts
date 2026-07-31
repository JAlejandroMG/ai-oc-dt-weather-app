import type { AppConfig, DailyForecast } from "../types"
import { getWeatherDescription } from "./weatherCodes"
import { dayNames } from "./constants"

export function formatTemperature(temp: number, config: AppConfig): string {
  if (config.units === "fahrenheit") {
    const f = (temp * 9) / 5 + 32
    return `${f.toFixed(1)}°F`
  }
  return `${temp.toFixed(1)}°C`
}

export function formatWindSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`
}

export function formatWeather(code: number, temp: number, wind: number, config: AppConfig): string {
  const desc = getWeatherDescription(code)
  const tempStr = formatTemperature(temp, config)
  const windStr = formatWindSpeed(wind)
  const emoji = weatherEmoji(code)
  return `${emoji}  ${desc} | ${tempStr} | Viento: ${windStr}`
}

export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️"
  if (code <= 2) return "⛅"
  if (code === 3) return "☁️"
  if (code >= 45 && code <= 48) return "🌫️"
  if (code >= 51 && code <= 57) return "🌦️"
  if (code >= 61 && code <= 67) return "🌧️"
  if (code >= 71 && code <= 77) return "❄️"
  if (code >= 80 && code <= 82) return "🌦️"
  if (code >= 85 && code <= 86) return "❄️"
  if (code >= 95) return "⛈️"
  return "❓"
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00")
  return `${dayNames[d.getDay()]} ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
}

function formatDailyForecastLine(day: DailyForecast, config: AppConfig): string {
  const dateStr = formatDateShort(day.date)
  const desc = getWeatherDescription(day.weathercode)
  const emoji = weatherEmoji(day.weathercode)
  const minStr = formatTemperature(day.tempMin, config)
  const maxStr = formatTemperature(day.tempMax, config)

  const tempPart = `${minStr}/${maxStr}`
  const precip = `${day.precipitationSum.toFixed(1)} mm`
  const wind = formatWindSpeed(day.windSpeedMax)

  return `${dateStr}  ${emoji}  ${desc.padEnd(22)}${tempPart}  💧 ${precip.padStart(7)}  💨 ${wind}`
}

export function formatDailyForecast(days: DailyForecast[], config: AppConfig): string {
  return days.map(d => `  ${formatDailyForecastLine(d, config)}`).join("\n")
}
