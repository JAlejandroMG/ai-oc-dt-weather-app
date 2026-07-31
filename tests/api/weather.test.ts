import { beforeEach, describe, expect, mock, test } from "bun:test"
import { getWeather, getDailyForecast } from "../../src/api/weather"

const fetchMock = mock((url: string) => Promise.resolve(new Response()))

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock
})

function jsonResponse(body: unknown, ok = true): Response {
  return new Response(JSON.stringify(body), { status: ok ? 200 : 404 })
}

describe("getWeather", () => {
  test("devuelve el clima actual en éxito", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({ current: { temperature_2m: 22.5, windspeed_10m: 12.3, weathercode: 0 } })
      )
    )

    const result = await getWeather(40.4168, -3.7038)
    expect(result).toEqual({ temperature: 22.5, windspeed: 12.3, weathercode: 0 })
  })

  test("construye la URL con latitud y longitud", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})))

    await getWeather(40.4168, -3.7038)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = fetchMock.mock.calls[0]![0] as string
    expect(url).toContain("latitude=40.4168")
    expect(url).toContain("longitude=-3.7038")
    expect(url).toContain("current=temperature_2m")
  })

  test("devuelve null si falta el campo current", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})))

    expect(await getWeather(40.4168, -3.7038)).toBeNull()
  })

  test("devuelve null si hay error HTTP", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(null, false)))

    expect(await getWeather(40.4168, -3.7038)).toBeNull()
  })

  test("devuelve null si fetch lanza una excepción", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("network error")))

    expect(await getWeather(40.4168, -3.7038)).toBeNull()
  })
})

describe("getDailyForecast", () => {
  test("mapea correctamente el pronóstico diario", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          daily: {
            time: ["2026-07-30", "2026-07-31"],
            weather_code: [0, 61],
            temperature_2m_max: [28, 24],
            temperature_2m_min: [18, 16],
            precipitation_sum: [0, 5.5],
            wind_speed_10m_max: [15, 20],
          },
        })
      )
    )

    const result = await getDailyForecast(40.4168, -3.7038)
    expect(result).toEqual([
      { date: "2026-07-30", weathercode: 0, tempMax: 28, tempMin: 18, precipitationSum: 0, windSpeedMax: 15 },
      { date: "2026-07-31", weathercode: 61, tempMax: 24, tempMin: 16, precipitationSum: 5.5, windSpeedMax: 20 },
    ])
  })

  test("devuelve null si falta el campo daily", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})))

    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull()
  })

  test("devuelve null si falta daily.time", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ daily: {} })))

    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull()
  })

  test("devuelve null si hay error HTTP", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(null, false)))

    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull()
  })

  test("devuelve null si fetch lanza una excepción", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("network error")))

    expect(await getDailyForecast(40.4168, -3.7038)).toBeNull()
  })
})
