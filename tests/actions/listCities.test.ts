import { describe, expect, test } from "bun:test"
import type { AppConfig } from "../../src/types"
import { listCities } from "../../src/actions/listCities"

describe("listCities", () => {
  test("devuelve cadena vacía si no hay ciudades", () => {
    const config: AppConfig = { units: "celsius", cities: [] }
    expect(listCities(config)).toBe("")
  })

  test("lista una ciudad sin marcador de default", () => {
    const config: AppConfig = {
      units: "celsius",
      cities: [{ name: "Madrid", latitude: 40.4168, longitude: -3.7038, isDefault: false }],
    }
    expect(listCities(config)).toBe("  1. Madrid")
  })

  test("marca la ciudad por defecto", () => {
    const config: AppConfig = {
      units: "celsius",
      cities: [{ name: "Madrid", latitude: 40.4168, longitude: -3.7038, isDefault: true }],
    }
    expect(listCities(config)).toBe("  1. Madrid (Default)")
  })

  test("enumera varias ciudades en orden", () => {
    const config: AppConfig = {
      units: "celsius",
      cities: [
        { name: "Barcelona", latitude: 41.3874, longitude: 2.1686, isDefault: true },
        { name: "Valencia", latitude: 39.4699, longitude: -0.3763, isDefault: false },
      ],
    }
    expect(listCities(config)).toBe("  1. Barcelona (Default)\n  2. Valencia")
  })
})
