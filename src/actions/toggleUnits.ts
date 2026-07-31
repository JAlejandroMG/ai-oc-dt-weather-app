import type { AppConfig } from "../types"
import { saveSettings } from "../storage/settingsStorage"
import { pressEnter } from "../presentation/input"
import { showSuccess } from "../presentation/output"

export async function toggleUnits(config: AppConfig): Promise<AppConfig> {
  const units = config.units === "celsius" ? "fahrenheit" : "celsius"
  await saveSettings(units)
  showSuccess(`Unidad cambiada a ${units === "celsius" ? "°C" : "°F"}`)
  await pressEnter()
  return { ...config, units }
}
