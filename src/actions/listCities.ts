import type { AppConfig } from "../types"

export function listCities(config: AppConfig): string {
  return config.cities
    .map((c, i) => `  ${i + 1}. ${c.name}${c.isDefault ? " (Default)" : ""}`)
    .join("\n")
}
