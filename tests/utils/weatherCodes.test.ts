import { describe, expect, test } from "bun:test"
import { getWeatherDescription } from "../../src/utils/weatherCodes"

describe("getWeatherDescription", () => {
  test("devuelve la descripción en español para códigos conocidos", () => {
    expect(getWeatherDescription(0)).toBe("Cielo despejado")
    expect(getWeatherDescription(1)).toBe("Mayormente despejado")
    expect(getWeatherDescription(3)).toBe("Nublado")
    expect(getWeatherDescription(45)).toBe("Niebla")
    expect(getWeatherDescription(61)).toBe("Lluvia ligera")
    expect(getWeatherDescription(71)).toBe("Nevada ligera")
    expect(getWeatherDescription(80)).toBe("Chubascos ligeros")
    expect(getWeatherDescription(95)).toBe("Tormenta eléctrica")
    expect(getWeatherDescription(96)).toBe("Tormenta con granizo ligero")
    expect(getWeatherDescription(99)).toBe("Tormenta con granizo fuerte")
  })

  test("devuelve 'Desconocido' para códigos no registrados", () => {
    expect(getWeatherDescription(999)).toBe("Desconocido")
    expect(getWeatherDescription(-1)).toBe("Desconocido")
  })
})
