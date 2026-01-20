export function getStructureBg(type: string) {
  // ?
  switch (type) {
    case 'п':
      return 'bg-chart-1'
    case 'к':
      return 'bg-chart-2'
    case 'и':
      return 'bg-chart-3'
    case 'б':
      return 'bg-chart-4'
    case 'п-п':
      return 'bg-chart-5'
    case 'прг':
      return 'bg-chart-6'
    default:
      return 'bg-chart-3'
  }
}
