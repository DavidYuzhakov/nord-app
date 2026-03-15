import type { KeyType, Song as SongModel } from '@/models/Song'
import { parseSongSections, type SongSection } from '@/utils/parseSongSections'
import { tokenizeSection } from '@/utils/tokenize'
import { transposeSections } from '@/utils/transposeSong'
import { useEffect, useMemo, useState } from 'react'
import { distance } from 'tonal'
import { normalizeKeyForTonal } from '@/utils/normalizeKeyForTonal'
import { stringifySongSections } from '@/utils/stringifySongSections'
import { Tonality } from './Tonality'
import { Button } from './ui/button'
import { useAppDispatch } from '@/store/hooks'
import { updateSongThunk } from '@/store/reducers/songSlice'

export function Song({ song, isEdit }: { song: SongModel; isEdit?: boolean }) {
  const [currentKey, setCurrentKey] = useState<KeyType>(song.key as KeyType)
  const dispatch = useAppDispatch()

  const sections = useMemo(() => {
    const parsed = tokenizeSection(parseSongSections(song.text ?? ''))

    const fromKey = normalizeKeyForTonal(song.key)
    const toKey = normalizeKeyForTonal(currentKey)

    if (currentKey === song.key) return parsed

    const interval = distance(fromKey, toKey)
    if (!interval || interval === '') {
      return parsed
    }

    console.log(currentKey)

    return transposeSections(parsed, interval)
  }, [song.text, song.key, currentKey])

  const changeKey = () => {
    const newText = stringifySongSections(sections)
    dispatch(
      updateSongThunk({
        id: song.id,
        data: {
          key: currentKey,
          text: newText,
        },
      }),
    )
  }

  const getIdSection = (section: SongSection) => {
    const numSection = section.title.match(/\d+/g)
    if (!numSection) return `${song.id}-${section.type}`

    return `${song.id}-${numSection[0]}${section.type}`
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentKey(song.key as KeyType)
  }, [song.key])

  return (
    <div className="px-3 space-y-7 h-full">
      <div className="flex gap-3 flex-wrap">
        <span className="font-semibold flex items-center justify-center px-2 py-0.5 rounded-md border-[1.5px] border-third text-third text-nowrap">
          BPM: {song.bpm}
        </span>
        {!isEdit ? (
          <span className="flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
            Key: {song.key}
          </span>
        ) : (
          <>
            <div className="flex-1 flex gap-2">
              <Tonality currentKey={currentKey} setCurrentKey={setCurrentKey} />
            </div>
            {currentKey !== song.key && (
              <Button onClick={changeKey} type="button">
                Сохранить
              </Button>
            )}
          </>
        )}
      </div>
      {sections.map((section, i) => (
        <div
          key={i}
          id={getIdSection(section)}
          className="relative border rounded-md py-3.5 px-2 space-y-7 scroll-mt-[135px]"
        >
          {section.title && (
            <h5 className="absolute top-0 left-4 bg-white -translate-y-1/2 px-1 rounded-md font-bold mb-2 uppercase">
              {section.type === 'unknown'
                ? 'Некорректный раздел'
                : section.title}
            </h5>
          )}
          <div>
            {section.lines.map((line, lineIdx) => (
              <pre
                key={lineIdx}
                style={{ fontFamily: 'Open Sans Variable' }}
                className="text-[13px] font-medium whitespace-pre-wrap text-pretty"
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
