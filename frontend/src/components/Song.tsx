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
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateSongThunk } from '@/store/reducers/songSlice'
import { GaugeIcon, Music2Icon, TypeIcon } from 'lucide-react'
import { updateHideChords } from '@/store/reducers/settingsSlice'
import { getTextBg } from '@/utils/getStructureBg'

export function Song({ song, isEdit }: { song: SongModel; isEdit?: boolean }) {
  const [currentKey, setCurrentKey] = useState<KeyType>(song.key as KeyType)
  const dispatch = useAppDispatch()
  const hideChords = useAppSelector((state) => state.settings.hideChords)

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
    setCurrentKey(song.key as KeyType)
  }, [song.key])

  return (
    <div className="px-3 space-y-6">
      <div className="flex gap-3 flex-wrap">
        <span className="font-semibold flex items-center gap-2 justify-center px-2 py-0.5 rounded-md text-third text-nowrap bg-third/10">
          <GaugeIcon size={20} /> {song.bpm}
        </span>
        {!isEdit ? (
          <span className="flex items-center gap-1 justify-center font-semibold px-2 pr-3 py-0.5 rounded-md text-primary bg-primary/10">
            <Music2Icon size={20} /> {song.key}
          </span>
        ) : (
          <>
            <div className="flex-1 flex gap-2">
              <Tonality currentKey={currentKey} setCurrentKey={setCurrentKey} />
            </div>
            {currentKey !== song.key && (
              <Button className="order-1" onClick={changeKey} type="button">
                Сохранить
              </Button>
            )}
          </>
        )}
        <button
          onClick={() =>
            hideChords === 'on'
              ? dispatch(updateHideChords('off'))
              : dispatch(updateHideChords('on'))
          }
          className={`ml-auto py-1 px-2.5 rounded duration-200 ${hideChords === 'on' ? 'bg-primary' : 'bg-muted'}`}
          type="button"
        >
          <TypeIcon
            size={17}
            className={`duration-200 ${hideChords === 'on' ? 'stroke-background' : ''}`}
          />
        </button>
      </div>
      {sections.map((section, i) => (
        <div
          key={i}
          id={getIdSection(section)}
          className="relative border dark:bg-card rounded-md py-3.5 px-2 space-y-7 scroll-mt-[135px]"
        >
          {section.title && (
            <h5
              className={`absolute top-0 left-4 bg-background -translate-y-1/2 px-1 rounded-md font-bold mb-2 uppercase dark:font-semibold ${getTextBg(section.type)}`}
            >
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
                className={`text-[13px] font-medium whitespace-pre-wrap text-pretty ${hideChords ? 'leading-6' : ''}`}
              >
                {(hideChords === 'on'
                  ? line.tokens.filter((t) => t.type !== 'chord')
                  : line.tokens
                ).map((t, i) =>
                  t.type === 'chord' ? (
                    <span key={i} className="font-semibold text-primary">
                      {t.value}
                    </span>
                  ) : (
                    <span key={i}>
                      {hideChords === 'on' ? t.value.trim() : t.value}
                    </span>
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
