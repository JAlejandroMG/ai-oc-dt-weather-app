import { describe, expect, test } from "bun:test"
import type { AppConfig, DailyForecast } from "../../src/types"
import {
  formatTemperature,
  formatWindSpeed,
  weatherEmoji,
  formatWeather,
  formatDailyForecast,
} from "../../src/utils/format"

const celsiusConfig: AppConfig = { units: "celsius", cities: [] }
const fahrenheitConfig: AppConfig = { units: "fahrenheit", cities: [] }

describe("formatTemperature", () => {
  test("formatea en celsius por defecto", () => {
    expect(formatTemperature(25, celsiusConfig)).toBe("25.0°C")
    expect(formatTemperature(-3.5, celsiusConfig)).toBe("-3.5°C")
  })

  test("convierte y formatea en fahrenheit", () => {
    expect(formatTemperature(25, fahrenheitConfig)).toBe("77.0°F")
    expect(formatTemperature(0, fahrenheitConfig)).toBe("32.0°F")
  })
})

describe("formatWindSpeed", () => {
  test("formatea velocidad del viento en km/h", () => {
    expect(formatWindSpeed(12.3)).toBe("12.3 km/h")
    expect(formatWindSpeed(0)).toBe("0.0 km/h")
  })
})

describe("weatherEmoji", () => {
  test("asigna emoji según el código WMO", () => {
    expect(weatherEmoji(0)).toBe("☀️")
    expect(weatherEmoji(1)).toBe("⛅")
    expect(weatherEmoji(2)).toBe("⛅")
    expect(weatherEmoji(3)).toBe("☁️")
    expect(weatherEmoji(45)).toBe("🌫️")
    expect(weatherEmoji(48)).toBe("🌫️")
    expect(weatherEmoji(51)).toBe("🌦️")
    expect(weatherEmoji(61)).toBe("🌧️")
    expect(weatherEmoji(67)).toBe("🌧️")
    expect(weatherEmoji(71)).toBe("❄️")
    expect(weatherEmoji(77)).toBe("❄️")
    expect(weatherEmoji(80)).toBe("🌦️")
    expect(weatherEmoji(82)).toBe("🌦️")
    expect(weatherEmoji(85)).toBe("❄️")
    expect(weatherEmoji(95)).toBe("⛈️")
    expect(weatherEmoji(99)).toBe("⛈️")
  })

  test("devuelve interrogación para códigos desconocidos", () => {
    expect(weatherEmoji(88)).toBe("❓")
  })
})

describe("formatWeather", () => {
  test("compone la línea completa de clima", () => {
    expect(formatWeather(0, 20, 10, celsiusConfig)).toBe(
      "☀️  Cielo despejado | 20.0°C | Viento: 10.0 km/h"
    )
  })

  test("compone la línea usando unidades fahrenheit", () => {
    expect(formatWeather(61, 20, 10, fahrenheitConfig)).toBe(
      "🌧️  Lluvia ligera | 68.0°F | Viento: 10.0 km/h"
    )
  })
})

describe("formatDailyForecast", () => {
  const days: DailyForecast[] = [
    { date: "2026-07-30", weathercode: 0, tempMax: 28, tempMin: 18, precipitationSum: 0, windSpeedMax: 15 },
    { date: "2026-07-31", weathercode: 61, tempMax: 24, tempMin: 16, precipitationSum: 5.5, windSpeedMax: 20 },
  ]

  test("formatea cada día con fecha, emoji y rangos", () => {
    const output = formatDailyForecast(days, celsiusConfig)
    expect(output).toContain("jue 30/07")
    expect(output).toContain("☀️")
    expect(output).toContain("18.0°C/28.0°C")
    expect(output).toContain("vie 31/07")
    expect(output).toContain("🌧️")
    expect(output).toContain("16.0°C/24.0°C")
    expect(output).toContain("5.5 mm")
  })

  test("devuelve cadena vacía sin días", () => {
    expect(formatDailyForecast([], celsiusConfig)).toBe("")
  })
})
