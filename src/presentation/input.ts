const decoder = new TextDecoder()
let buffer = ""

type StdinReader = ReturnType<typeof createReader>
let reader: StdinReader | null = null

function createReader() {
  return Bun.stdin.stream().getReader()
}

async function nextLine(): Promise<string> {
  const r = reader ?? (reader = createReader())

  while (true) {
    const nlIndex = buffer.indexOf("\n")
    if (nlIndex !== -1) {
      const line = buffer.slice(0, nlIndex)
      buffer = buffer.slice(nlIndex + 1)
      return line
    }
    const result = await r.read()
    if (result.done) {
      const remaining = buffer
      buffer = ""
      return remaining
    }
    buffer += decoder.decode(result.value)
  }
}

export async function readLine(prompt: string): Promise<string> {
  console.log(prompt)
  return await nextLine()
}

export async function pressEnter(): Promise<void> {
  await readLine("\nPresiona Enter para continuar...")
}
