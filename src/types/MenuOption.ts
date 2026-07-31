import type { AppConfig } from "./AppConfig"

export type Action = (config: AppConfig) => Promise<AppConfig>

export interface MenuOption {
  key: string
  label: string
  action: Action
}
