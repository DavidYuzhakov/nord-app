export function getStructureBg(type: string): string {
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

export function getTextBg(type: string): string {
  switch (type) {
    case 'вступление':
      return 'text-green-400'
    case 'куплет':
      return 'text-blue-400'
    case 'припев':
      return 'text-red-400'
    case 'бридж':
      return 'text-orange-400'
    case 'предприпев':
      return 'text-yellow-500 '
    case 'проигрыш':
      return 'text-violet-400'
    case 'тег':
      return 'text-gray-500 dark:text-gray-300'
    default:
      return 'text-foreground'
  }
}
