export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
}

export interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
}

export interface DailyForecast {
  date: string
  weathercode: number
  tempMax: number
  tempMin: number
  precipitationSum: number
  windSpeedMax: number
}
