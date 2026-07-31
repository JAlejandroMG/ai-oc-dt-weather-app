import type { AppConfig, MenuOption } from "../types"
import { loadCities } from "../storage/citiesStorage"
import { loadSettings } from "../storage/settingsStorage"
import { HEADER, HEADER_LOW } from "../utils/constants"
import { green } from "../utils/colors"
import { readLine, pressEnter } from "./input"
import { clearScreen } from "./output"
import { showDefaultCityWeather, showAllCitiesWeather } from "../actions/getWeather"
import { addCity } from "../actions/addCity"
import { removeCity } from "../actions/removeCity"
import { setDefaultCity } from "../actions/setDefaultCity"
import { showDailyForecast } from "../actions/dailyForecast"
import { toggleUnits } from "../actions/toggleUnits"

function buildMenuOptions(config: AppConfig): MenuOption[] {
  const unitSymbol = config.units === "celsius" ? "°C" : "°F"

  return [
    { key: "1", label: "Clima de ciudad default", action: showDefaultCityWeather },
    { key: "2", label: `Clima de todas las ciudades (${config.cities.length})`, action: showAllCitiesWeather },
    { key: "3", label: "Buscar y agregar ciudad", action: addCity },
    { key: "4", label: "Eliminar ciudad", action: removeCity },
    { key: "5", label: "Establecer ciudad default", action: setDefaultCity },
    { key: "6", label: "Pronóstico 7 días", action: showDailyForecast },
    { key: "8", label: `Ajustes (${unitSymbol})`, action: toggleUnits },
    { key: "9", label: "Salir", action: async (config) => config },
  ]
}

function renderMenu(options: MenuOption[]): string {
  const body = options.map((o) => `  ${o.key}. ${o.label}`).join("\n")
  return `\n  ${green(`\n${body}\n`)}\n${HEADER_LOW}`
}

export async function mainLoop(): Promise<void> {
  const [cities, units] = await Promise.all([loadCities(), loadSettings()])
  let config: AppConfig = { cities, units }

  while (true) {
    clearScreen()
    console.log(HEADER)
    const options = buildMenuOptions(config)
    const choice = await readLine(renderMenu(options))

    if (choice === "9") {
      console.log("\n👋  ¡Hasta luego!")
      return
    }

    const option = options.find((o) => o.key === choice)
    if (!option) {
      console.log("\n⚠️  Opción inválida.")
      await pressEnter()
      continue
    }

    config = await option.action(config)
  }
}
