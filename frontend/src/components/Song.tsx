import type { KeyType, Song as SongModel } from '@/models/Song'
import { parseSongSections } from '@/utils/parseSongSections'
import { tokenizeSection } from '@/utils/tokenize'
import { transposeSections } from '@/utils/transposeSong'
import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { distance } from 'tonal'
import { normalizeKeyForTonal } from '@/utils/normalizeKeyForTonal'

export function Song({ song, isEdit }: { song: SongModel; isEdit?: boolean }) {
  const [currentKey, setCurrentKey] = useState<KeyType>(song.key as KeyType)
  const keysType: KeyType[] = currentKey.includes('m')
    ? ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Hm']
    : ['C', 'D', 'E', 'F', 'G', 'A', 'H']

  const sections = useMemo(() => {
    const parsed = tokenizeSection(parseSongSections(song.text ?? ''))
    if (currentKey === song.key) return parsed

    const fromKey = normalizeKeyForTonal(song.key)
    const toKey = normalizeKeyForTonal(currentKey)

    const interval = distance(fromKey, toKey)
    if (!interval || interval === '') {
      return parsed
    }

    return transposeSections(parsed, interval)
  }, [song.text, song.key, currentKey])

  return (
    <div className="px-3 space-y-7 h-full">
      <div className="flex gap-3">
        <span className="font-semibold flex items-center justify-center px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
          BPM: {song.bpm}
        </span>
        {!isEdit ? (
          <span className="flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
            Key: {song.key}
          </span>
        ) : (
          <>
            <Select
              defaultValue={currentKey.replace('#', '').replace('b', '')}
              onValueChange={(v) => setCurrentKey(v as KeyType)}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Key" />
              </SelectTrigger>
              <SelectContent className="">
                {keysType.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className={`${currentKey.includes('#') ? 'bg-primary text-white' : ''}`}
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
              type="button"
              variant={'outline'}
            >
              #
            </Button>
            <Button
              className={`${currentKey.includes('b') ? 'bg-primary text-white' : ''}`}
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
              disabled={
                currentKey[0] === 'F' || currentKey[0] === 'C' ? true : false
              }
              type="button"
              variant={'outline'}
            >
              b
            </Button>
          </>
        )}
      </div>
      {sections.map((section, i) => (
        <div
          key={i}
          className="relative border rounded-md py-3.5 px-2 space-y-7"
        >
          {section.title && (
            <h5 className="absolute top-0 left-4 bg-white -translate-y-1/2 px-1 rounded-md font-bold mb-2 uppercase">
              {section.title}
            </h5>
          )}
          <div className="">
            {section.lines.map((line, lineIdx) => (
              <pre
                key={lineIdx}
                style={{ fontFamily: 'Open Sans Variable' }}
                className="text-[14px] font-medium whitespace-pre-wrap text-pretty"
              >
                {line.tokens.map((t, i) =>
                  t.type === 'chord' ? (
                    <span key={i} className="font-semibold text-primary">
                      {t.value}
                    </span>
                  ) : (
                    <span key={i}>{t.value}</span>
                  ),
                )}
              </pre>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
