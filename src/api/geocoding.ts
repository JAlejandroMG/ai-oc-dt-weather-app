import type { GeocodingResult } from "../types"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

type GeocodingResponse = {
  results?: GeocodingResult[]
}

export async function searchCity(name: string): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = (await res.json()) as GeocodingResponse
  if (!data.results || data.results.length === 0) return null
  const r = data.results[0]!
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    country_code: r.country_code,
  }
}
