export interface City {
  name: string
  latitude: number
  longitude: number
  country?: string
  isDefault: boolean
}

export interface AppConfig {
  units: "celsius" | "fahrenheit"
  cities: City[]
}

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
