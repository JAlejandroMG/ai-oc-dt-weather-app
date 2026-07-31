import { beforeEach, describe, expect, mock, test } from "bun:test"
import { searchCity } from "../../src/api/geocoding"

const fetchMock = mock((url: string) => Promise.resolve(new Response()))

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock
})

function jsonResponse(body: unknown, ok = true): Response {
  return new Response(JSON.stringify(body), { status: ok ? 200 : 404 })
}

describe("searchCity", () => {
  test("devuelve el resultado de geocodificación en éxito", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          results: [
            { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", country_code: "ES" },
          ],
        })
      )
    )

    const result = await searchCity("Madrid")
    expect(result).toEqual({
      name: "Madrid",
      latitude: 40.4168,
      longitude: -3.7038,
      country: "España",
      country_code: "ES",
    })
  })

  test("codifica el nombre de la ciudad en la URL", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ results: [] })))

    await searchCity("San José")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = fetchMock.mock.calls[0]![0] as string
    expect(url).toContain("name=San%20Jos%C3%A9")
  })

  test("devuelve null si no hay resultados", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ results: [] })))

    expect(await searchCity("CiudadInexistenteXYZ")).toBeNull()
  })

  test("devuelve null si falta el campo results", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})))

    expect(await searchCity("Madrid")).toBeNull()
  })

  test("devuelve null si hay error HTTP", async () => {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(null, false)))

    expect(await searchCity("Madrid")).toBeNull()
  })

  test("devuelve null si fetch lanza una excepción", async () => {
    fetchMock.mockImplementation(() => Promise.reject(new Error("network error")))

    expect(await searchCity("Madrid")).toBeNull()
  })

  test("omite campos opcionales ausentes", async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(jsonResponse({ results: [{ name: "Paris", latitude: 48.8, longitude: 2.3 }] }))
    )

    const result = await searchCity("Paris")
    expect(result).toEqual({ name: "Paris", latitude: 48.8, longitude: 2.3, country: undefined, country_code: undefined })
  })
})
