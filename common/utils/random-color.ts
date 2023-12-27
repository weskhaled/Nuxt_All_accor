export function randomColor(): string {
  let result = ''
  for (let i = 0; i < 6; ++i) {
    const value = Math.floor(16 * Math.random())
    result += value.toString(16)
  }
  return `#${result}`
}
