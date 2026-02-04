export function getStructureBg(type: string) {
  // ?
  switch (type) {
    case 'в':
      return 'bg-green-500'
    case 'к':
      return 'bg-blue-500'
    case 'п':
      return 'bg-red-500'
    case 'б':
      return 'bg-cyan-500'
    case 'пп':
      return 'bg-yellow-400'
    case 'прг':
      return 'bg-violet-500'
    case 'т':
      return 'bg-gray-500'
    default:
      return 'bg-chart-3'
  }
}
