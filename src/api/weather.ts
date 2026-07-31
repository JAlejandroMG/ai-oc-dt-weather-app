import type { WeatherData, DailyForecast } from "../types"

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

type CurrentWeatherResponse = {
  current?: {
    temperature_2m: number
    windspeed_10m: number
    weathercode: number
  }
}

type DailyForecastResponse = {
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
  }
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,windspeed_10m,weathercode`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as CurrentWeatherResponse
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
  const data = (await res.json()) as DailyForecastResponse
  const daily = data.daily
  if (!daily || !daily.time) return null
  return daily.time.map((date: string, i: number) => ({
    date,
    weathercode: daily.weather_code[i]!,
    tempMax: daily.temperature_2m_max[i]!,
    tempMin: daily.temperature_2m_min[i]!,
    precipitationSum: daily.precipitation_sum[i]!,
    windSpeedMax: daily.wind_speed_10m_max[i]!,
  }))
}
