# 02-weather — CLI weather app

## Stack
- **Runtime**: Bun.js (not Node/npm)
- **API**: OpenMeteo (free, no API key needed)
- **Language**: TypeScript with `verbatimModuleSyntax` (use `import type` for type-only imports)

## Commands
| Action | Command |
|---|---|
| Run | `bun src/index.ts` |
| Test | `bun test` |
| Install deps | `bun install` |
| Run script | `bun run <script>` |
| Execute package | `bunx <pkg>` |
| Compile binary | `bun build --compile src/index.ts --outfile weather-cli` |

No build step for development — `noEmit: true`, run directly with Bun.

## Project structure
- `src/index.ts` — entry point, catches SIGINT
- `src/actions/` — main user actions (getWeather, addCity, removeCity, setDefaultCity, listCities, dailyForecast, toggleUnits)
- `src/presentation/` — CLI interaction (menu.ts, output.ts, input.ts)
- `src/storage/` — JSON persistence (`cities.json`) via citiesStorage + settingsStorage
- `src/api/` — OpenMeteo geocoding + forecast calls
- `src/types/` — global TypeScript types
- `src/utils/` — formatters, constants, colors, WMO code → Spanish description map
- `cities.json` — auto-created, stores cities + unit preference
- No tests, no formatter, no linter config yet

## API quirks
- OpenMeteo geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
- OpenMeteo forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,windspeed_10m,weathercode`

## Data persistence
- Cities and unit preference stored in `cities.json` (auto-created)
- Structure: `{ units: "celsius"|"fahrenheit", cities: [{ name, latitude, longitude, country?, isDefault }] }`

## Gotchas
- Stdin uses a custom line-buffered reader (`Bun.stdin.stream()` + internal buffer), not `readline` module — do not mix approaches
- Use `readLine(prompt)` from `src/presentation/input.ts` for all user input
- `pressEnter()` calls `readLine()` internally — it consumes one line of input
- Weather codes use WMO standard; mapping is in `src/utils/weatherCodes.ts`

## Conventions
- Use `Bun.file` over `node:fs`
- Use `Bun.serve()` if a server is needed (not Express)
- Use `Bun.$\`...\`` for shell commands (not execa)
- Bun loads `.env` automatically — do not use `dotenv`
- '@bun-instructions.md' can be used to get Bun instructions.
