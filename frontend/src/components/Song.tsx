import type { Song as SongModel } from '@/models/Song'
import { parseSongSections } from '@/utils/parseSongSections'
import { tokenizeSection } from '@/utils/tokenize'
import { memo, useMemo } from 'react'

export const Song = memo(function Song({ song }: { song: SongModel }) {
  const sections = useMemo(() => {
    return tokenizeSection(parseSongSections(song.text ?? ''))
  }, [song.text])

  console.log(sections)

  return (
    <div className="pb-23 px-3 space-y-7 h-full">
      <div className="flex gap-3">
        <span className="font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
          BPM: {song.bpm}
        </span>
        <span className="flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
          Key: {song.key}
        </span>
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
                className="text-[14px] font-medium whitespace-pre-wrap text-nowrap"
              >
                {line.tokens.map((t, i) =>
                  t.type === 'chord' ? (
                    <span
                      key={i}
                      className="font-semibold text-primary"
                    >
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
})
