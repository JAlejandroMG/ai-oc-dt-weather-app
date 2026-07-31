import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { AppConfig } from "../../src/types"
import { readConfig, writeConfig } from "../../src/storage/config"

let tmpDir: string
let originalCwd: string

beforeAll(() => {
  originalCwd = process.cwd()
  tmpDir = mkdtempSync(join(tmpdir(), "weather-config-"))
  process.chdir(tmpDir)
})

afterAll(() => {
  process.chdir(originalCwd)
  rmSync(tmpDir, { recursive: true, force: true })
})

beforeEach(() => {
  rmSync("cities.json", { force: true })
})

describe("readConfig", () => {
  test("devuelve null si el archivo no existe", async () => {
    expect(await readConfig()).toBeNull()
  })

  test("lee la configuración escrita previamente", async () => {
    const config: AppConfig = {
      units: "fahrenheit",
      cities: [{ name: "Madrid", latitude: 40.4168, longitude: -3.7038, isDefault: true }],
    }
    await writeConfig(config)
    expect(await readConfig()).toEqual(config)
  })

  test("usa valores por defecto si faltan unidades o ciudades", async () => {
    await Bun.write("cities.json", JSON.stringify({}))
    expect(await readConfig()).toEqual({ units: "celsius", cities: [] })
  })

  test("devuelve null si el JSON está corrupto", async () => {
    await Bun.write("cities.json", "{json inválido")
    expect(await readConfig()).toBeNull()
  })
})

describe("writeConfig", () => {
  test("persiste la configuración en disco", async () => {
    const config: AppConfig = { units: "celsius", cities: [] }
    await writeConfig(config)
    const file = Bun.file("cities.json")
    expect(await file.exists()).toBe(true)
    expect(await file.json()).toEqual(config)
  })
})
