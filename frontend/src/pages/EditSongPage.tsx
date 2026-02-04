import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGoBack } from '@/hook/useGoBack'
import type { KeyType } from '@/models/Song'
import { programs } from '@/mocks/programs'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import { Tonality } from '@/components/Tonality'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Structure } from '@/components/Structure'

interface FormState {
  name: string
  bpm: number
  text: string
  audio: string
  danceVideo: string
}

export default function EditSongPage() {
  const { id } = useParams()
  const goBack = useGoBack()
  const songData = id ? programs[0].songs[Number(id)].song : null

  const [songKey, setSongKey] = useState(songData?.key || 'C')
  const { register, handleSubmit } = useForm<FormState>({
    defaultValues: {
      name: songData?.name ?? '',
      bpm: songData?.bpm ?? 120,
      text: songData?.text ?? '',
    },
  })

  if (!songData) {
    return <div>Нет песни</div>
  }

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data)
  }

  const handleDelete = () => {
    if (window.confirm('Вы действительно хотите удалить хвалу?')) {
      console.log('delete')
    }
  }

  return (
    <div className="space-y-4 pb-22 pt-2">
      <div className="flex items-center gap-2 -mx-1">
        <button
          onClick={goBack}
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-10 bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
          type="button"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-[22px] font-semibold">Редактирование</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-1">
          <Label className="text-lg font-medium" htmlFor="name">
            Название:
          </Label>
          <Input
            {...register('name')}
            id="name"
            placeholder="Введите название"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-medium leading-none">Структура:</Label>
          <Structure />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-primary text-lg font-semibold leading-none">
              KEY:
            </Label>
            <div className="flex gap-2">
              <Tonality currentKey={songKey} setCurrentKey={setSongKey} />
              <Button
                onClick={() => {
                  if (songKey.includes('m')) {
                    setSongKey(songKey.replace('m', '') as KeyType)
                  } else {
                    setSongKey(`${songKey}m` as KeyType)
                  }
                }}
                className={songKey.includes('m') ? 'bg-primary text-white' : ''}
                type="button"
                variant={'outline'}
              >
                minor
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-third text-lg font-semibold leading-none">
              BPM:
            </Label>
            <Input {...register('bpm')} type="number" className="w-15" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-medium" htmlFor="text">
            Текст:
          </Label>
          <Textarea
            id="text"
            {...register('text')}
            placeholder="Введите текст песни с аккордами"
            className="resize-y max-h-100 px-2 py-3.5 text-[14px] font-medium focus-visible:ring-0 text-pretty"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            <Label className="font-medium text-base" htmlFor="youtube">
              Юльтон:
            </Label>
            <Input
              {...register('danceVideo')}
              id="youtube"
              className="max-w-75 h-auto"
              placeholder="Введите ссылку"
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Label
              className="font-medium text-base leading-none"
              htmlFor="audio"
            >
              Аудио:
            </Label>
            <Input
              id="audio"
              className="max-w-75 h-auto"
              {...register('audio')}
              placeholder="Введите ссылку"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 justify-end">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="capitalize text-base py-5"
          >
            удалить
          </Button>
          <Button
            type="submit"
            className="bg-primary capitalize text-base py-5"
          >
            сохранить
          </Button>
        </div>
      </form>
    </div>
  )
}
