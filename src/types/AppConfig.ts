import type { City } from "./City"

export type Unit = "celsius" | "fahrenheit"

export interface AppConfig {
  units: Unit
  cities: City[]
}
