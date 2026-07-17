export function getShortISO(date: Date) {
  const years = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${years}-${month}-${day}`
}
