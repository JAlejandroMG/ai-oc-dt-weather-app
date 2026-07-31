export function clearScreen(): void {
  console.clear()
}

export function showSuccess(message: string): void {
  console.log(`\n✅  ${message}`)
}

export function showWarning(message: string): void {
  console.log(`\n⚠️  ${message}`)
}

export function showError(message: string): void {
  console.log(`\n❌  ${message}`)
}
