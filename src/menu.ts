import type { AppConfig, City } from "./types"
import { loadConfig, saveConfig } from "./db"
import { searchCity, getWeather } from "./api"
import { formatWeather, clearScreen, readLine } from "./utils"
import { cyan, green, red } from "./colors"

const HEADER = cyan(`
════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════`)
const HEADER_LOW = cyan(`
════════════════════════════════════════
  Selecciona una opción: 
`)
function renderMenuOptions(config: AppConfig): string{
  const unitSymbol = config.units === "celsius" ? "°C" : "°F"

  return green(`
  1. Clima de ciudad default
  2. Clima de todas las ciudades (${config.cities.length})
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  8. Ajustes (${unitSymbol})
  9. Salir
`)
}

function renderMenu(config: AppConfig): string {
  return `
  ${renderMenuOptions(config)}
${HEADER_LOW}`
}

async function pressEnter(): Promise<void> {
  await readLine("\nPresiona Enter para continuar...")
}

async function showCityWeather(city: City, config: AppConfig): Promise<void> {
  const weather = await getWeather(city.latitude, city.longitude)
  if (!weather) {
    console.log(`\n❌  Error al obtener clima para ${city.name}`)
    return
  }
  const label = city.isDefault ? " (Default)" : ""
  console.log(`\n📍 ${city.name}${label}${city.country ? `, ${city.country}` : ""}`)
  console.log(`   ${formatWeather(weather.weathercode, weather.temperature, weather.windspeed, config)}`)
}

async function optionDefaultWeather(config: AppConfig): Promise<void> {
  const defaultCity = config.cities.find((c) => c.isDefault)
  if (!defaultCity) {
    console.log("\n⚠️  No hay ciudad default configurada.")
    await pressEnter()
    return
  }
  await showCityWeather(defaultCity, config)
  await pressEnter()
}

async function optionAllWeather(config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n⚠️  No hay ciudades registradas.")
    await pressEnter()
    return
  }
  for (const city of config.cities) {
    await showCityWeather(city, config)
  }
  await pressEnter()
}

async function optionSearchAdd(config: AppConfig): Promise<void> {
  const name = await readLine("\nNombre de la ciudad: ")
  if (!name) return

  console.log("  Buscando...")
  const result = await searchCity(name)
  if (!result) {
    console.log("\n❌  Ciudad no encontrada.")
    await pressEnter()
    return
  }

  console.log(`\n📌 ${result.name}${result.country ? `, ${result.country}` : ""}`)
  const confirm = await readLine("¿Agregar esta ciudad? (s/n): ")
  if (confirm.toLowerCase() !== "s") return

  const isDefault = config.cities.length === 0
  config.cities.push({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    isDefault,
  })
  await saveConfig(config)
  console.log(isDefault ? "\n✅  Ciudad agregada y establecida como default." : "\n✅  Ciudad agregada.")
  await pressEnter()
}

async function optionDelete(config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n⚠️  No hay ciudades para eliminar.")
    await pressEnter()
    return
  }

  console.log("")
  for (let i = 0; i < config.cities.length; i++) {
    const c = config.cities[i]
    console.log(`  ${i + 1}. ${c.name}${c.isDefault ? " (Default)" : ""}`)
  }
  const choice = parseInt(await readLine("\nNúmero a eliminar (0 para cancelar): "), 10)
  if (isNaN(choice) || choice < 1 || choice > config.cities.length) return

  const removed = config.cities.splice(choice - 1, 1)[0]
  if (!removed) return
  if (removed.isDefault && config.cities.length > 0) {
    config.cities[0].isDefault = true
    console.log(`\n✅  ${config.cities[0].name} establecida como nueva default.`)
  }
  await saveConfig(config)
  console.log(`\n✅  ${removed.name} eliminada.`)
  await pressEnter()
}

async function optionSetDefault(config: AppConfig): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n⚠️  No hay ciudades registradas.")
    await pressEnter()
    return
  }

  console.log("")
  for (let i = 0; i < config.cities.length; i++) {
    const c = config.cities[i]
    console.log(`  ${i + 1}. ${c.name}${c.isDefault ? " (Default)" : ""}`)
  }
  const choice = parseInt(await readLine("\nSelecciona nueva default (0 para cancelar): "), 10)
  if (isNaN(choice) || choice < 1 || choice > config.cities.length) return

  for (const c of config.cities) c.isDefault = false
  config.cities[choice - 1].isDefault = true
  await saveConfig(config)
  console.log(`\n✅  ${config.cities[choice - 1].name} es ahora la ciudad default.`)
  await pressEnter()
}

async function optionToggleUnits(config: AppConfig): Promise<void> {
  config.units = config.units === "celsius" ? "fahrenheit" : "celsius"
  await saveConfig(config)
  console.log(`\n✅  Unidad cambiada a ${config.units === "celsius" ? "°C" : "°F"}`)
  await pressEnter()
}

export async function mainLoop(): Promise<void> {
  const config = await loadConfig()

  while (true) {
    clearScreen()
    console.log(HEADER)
    const choice = await readLine(renderMenu(config))

    switch (choice) {
      case "1":
        await optionDefaultWeather(config)
        break
      case "2":
        await optionAllWeather(config)
        break
      case "3":
        await optionSearchAdd(config)
        break
      case "4":
        await optionDelete(config)
        break
      case "5":
        await optionSetDefault(config)
        break
      case "8":
        await optionToggleUnits(config)
        break
      case "9":
        console.log("\n👋  ¡Hasta luego!")
        return
      default:
        console.log("\n⚠️  Opción inválida.")
        await pressEnter()
    }
  }
}
