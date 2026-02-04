import type { KeyType } from '@/models/Song'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from './ui/button'

const MAJOR_KEYS: KeyType[] = ['C', 'D', 'E', 'F', 'G', 'A', 'H']
const MINOR_KEYS: KeyType[] = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Hm']

export function Tonality({
  currentKey,
  setCurrentKey,
}: {
  currentKey: KeyType
  setCurrentKey: React.Dispatch<React.SetStateAction<KeyType>>
}) {
  const keysType: KeyType[] = currentKey.includes('m') ? MINOR_KEYS : MAJOR_KEYS
  console.log(keysType, currentKey)

  return (
    <>
      <Select
        value={currentKey.replace('#', '').replace('b', '')}
        onValueChange={(v) => (v.length > 0 ? setCurrentKey(v as KeyType) : {})}
      >
        <SelectTrigger>
          <SelectValue placeholder="Key" />
        </SelectTrigger>
        <SelectContent>
          {keysType.map((k) => (
            <SelectItem key={k} value={k}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant={currentKey.includes('#') ? 'default' : 'outline'}
        onClick={() => {
          if (currentKey.includes('#')) {
            setCurrentKey(currentKey.replace('#', '') as KeyType)
          } else {
            if (currentKey[1] === 'b') {
              setCurrentKey(currentKey.replace('b', '#') as KeyType)
            } else if (currentKey[1] === 'm') {
              setCurrentKey(currentKey.replace('m', '#m') as KeyType)
            } else {
              setCurrentKey(`${currentKey}#` as KeyType)
            }
          }
        }}
        disabled={currentKey[0] === 'E' || currentKey[0] === 'H'}
      >
        #
      </Button>
      <Button
        type="button"
        variant={currentKey.includes('b') ? 'default' : 'outline'}
        onClick={() => {
          if (currentKey.includes('b')) {
            setCurrentKey(currentKey.replace('b', '') as KeyType)
          } else {
            if (currentKey[1] === '#') {
              setCurrentKey(currentKey.replace('#', 'b') as KeyType)
            } else if (currentKey[1] === 'm') {
              setCurrentKey(currentKey.replace('m', 'bm') as KeyType)
            } else {
              setCurrentKey(`${currentKey}b` as KeyType)
            }
          }
        }}
        disabled={currentKey[0] === 'F' || currentKey[0] === 'C'}
      >
        b
      </Button>
    </>
  )
}
