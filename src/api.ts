import type { GeocodingResult, WeatherData } from "./types"

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
