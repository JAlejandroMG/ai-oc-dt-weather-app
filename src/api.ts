import type { GeocodingResult, WeatherData, DailyForecast } from "./types"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

export async function searchCity(name: string): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  if (!data.results || data.results.length === 0) return null
  const r = data.results[0]
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    country_code: r.country_code,
  }
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,windspeed_10m,weathercode`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const current = data.current
  if (!current) return null
  return {
    temperature: current.temperature_2m,
    windspeed: current.windspeed_10m,
    weathercode: current.weathercode,
  }
}

export async function getDailyForecast(latitude: number, longitude: number): Promise<DailyForecast[] | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const daily = data.daily
  if (!daily || !daily.time) return null
  return daily.time.map((date: string, i: number) => ({
    date,
    weathercode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    precipitationSum: daily.precipitation_sum[i],
    windSpeedMax: daily.wind_speed_10m_max[i],
  }))
}
