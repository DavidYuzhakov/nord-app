export function getStructureBg(type: string) {
  // ?
  switch (type) {
    case 'в':
      return 'bg-green-400'
    case 'к':
      return 'bg-blue-400'
    case 'п':
      return 'bg-red-400'
    case 'б':
      return 'bg-orange-400'
    case 'пп':
      return 'bg-yellow-400'
    case 'прг':
      return 'bg-violet-400'
    case 'т':
      return 'bg-gray-400'
    default:
      return 'bg-green-400'
  }
}
