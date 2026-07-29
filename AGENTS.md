# 02-weather — CLI weather app

## Stack
- **Runtime**: Bun.js (not Node/npm)
- **API**: OpenMeteo (free, no API key needed)
- **Language**: TypeScript with `verbatimModuleSyntax` (use `import type` for type-only imports)

## Commands
| Action | Command |
|---|---|
| Run | `bun index.ts` |
| Test | `bun test` |
| Install deps | `bun install` |
| Run script | `bun run <script>` |
| Execute package | `bunx <pkg>` |

No build step — `noEmit: true`, run directly with Bun.

## Project structure
- `index.ts` — entry point (currently placeholder `console.log("Hello via Bun!")`)
- No tests, no formatter, no linter config yet

## API quirks
- OpenMeteo geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
- OpenMeteo forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m`

## Conventions
- Use `Bun.file` over `node:fs`
- Use `Bun.serve()` if a server is needed (not Express)
- Use `Bun.$\`...\`` for shell commands (not execa)
- Bun loads `.env` automatically — do not use `dotenv`
- '@bun-instructions.md' can be used to get Bun instructions.
