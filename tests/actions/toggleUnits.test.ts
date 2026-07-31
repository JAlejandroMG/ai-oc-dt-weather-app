import { beforeEach, describe, expect, mock, test } from "bun:test"
import type { AppConfig } from "../../src/types"

const saveSettingsMock = mock(async () => {})
const pressEnterMock = mock(async () => {})
const showSuccessMock = mock(() => {})

mock.module("../../src/storage/settingsStorage", () => ({ saveSettings: saveSettingsMock }))
mock.module("../../src/presentation/input", () => ({ pressEnter: pressEnterMock }))
mock.module("../../src/presentation/output", () => ({ showSuccess: showSuccessMock }))

const { toggleUnits } = await import("../../src/actions/toggleUnits")

const baseConfig: AppConfig = {
  units: "celsius",
  cities: [{ name: "Madrid", latitude: 40.4168, longitude: -3.7038, isDefault: true }],
}

describe("toggleUnits", () => {
  beforeEach(() => {
    saveSettingsMock.mockReset()
    pressEnterMock.mockReset()
    showSuccessMock.mockReset()
  })

  test("cambia de celsius a fahrenheit y persiste la preferencia", async () => {
    const result = await toggleUnits({ ...baseConfig, units: "celsius" })

    expect(result.units).toBe("fahrenheit")
    expect(saveSettingsMock).toHaveBeenCalledWith("fahrenheit")
    expect(showSuccessMock).toHaveBeenCalled()
    expect(pressEnterMock).toHaveBeenCalledTimes(1)
  })

  test("cambia de fahrenheit a celsius", async () => {
    const result = await toggleUnits({ ...baseConfig, units: "fahrenheit" })

    expect(result.units).toBe("celsius")
    expect(saveSettingsMock).toHaveBeenCalledWith("celsius")
  })

  test("no muta la configuración original", async () => {
    const config = { ...baseConfig, units: "celsius" }
    const result = await toggleUnits(config)

    expect(config.units).toBe("celsius")
    expect(result).not.toBe(config)
  })
})
