import { mainLoop } from "./presentation/menu"

process.on("SIGINT", () => {
  console.log("\n👋  ¡Hasta luego!")
  process.exit(0)
})

await mainLoop()
