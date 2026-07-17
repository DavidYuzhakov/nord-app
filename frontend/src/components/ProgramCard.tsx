import {
  ArchiveIcon,
  ChevronDownIcon,
  HeartIcon,
  HeartOffIcon,
  PenIcon,
  RefreshCwIcon,
  Trash2Icon,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { SongItem } from './SongItem'
import type { Program } from '@/models/Program'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  deleteProgramThunk,
  updateProgramThunk,
} from '@/store/reducers/programSlice'
import type { TypeProgram } from '@/pages/HomePage'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

export function ProgramCard({
  id,
  name,
  songs,
  date,
  isArchived,
  isFavorite,
  isOpenExternal,
  setOpenExternal,
  type,
}: Program & {
  isOpenExternal: boolean
  type: TypeProgram
  setOpenExternal: (id: number | null) => void
}) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.program.loading)
  const navigate = useNavigate()

  const deleteProgram = () => {
    if (window.confirm('Вы действительно хотите удалить программу?')) {
      dispatch(deleteProgramThunk(id))
    }
  }

  const archiveProgramHandler = (isArchiveProp: boolean) => {
    dispatch(
      updateProgramThunk({
        id,
        data: { isArchived: isArchiveProp },
      }),
    )
  }

  const favoriteProgramHandler = () => {
    if (isFavorite === true) {
      if (
        window.confirm('Вы действительно хотите удалить программу из любимых?')
      ) {
        dispatch(
          updateProgramThunk({
            id,
            data: { isFavorite: !isFavorite },
          }),
        )
      }
    } else {
      dispatch(
        updateProgramThunk({
          id,
          data: { isFavorite: !isFavorite },
        }),
      )
    }
  }

  return (
    <Collapsible
      key={id}
      open={isOpenExternal}
      onOpenChange={(open) => {
        setOpenExternal(open ? id : null)
      }}
      className={`rounded-xl bg-secondary`}
    >
      <CollapsibleTrigger asChild>
        <button className="w-full group flex items-center gap-5 justify-between p-3">
          <h5
            className={`text-lg md:text-lg font-semibold truncate rounded-none duration-200 transition-all ${
              isOpenExternal ? 'text-foreground' : 'text-muted-foreground'
            } ${type === 'archived' ? 'line-through' : ''}`}
          >
            {name}
          </h5>

          <ChevronDownIcon
            className={`transition-transform duration-200 ${
              isOpenExternal ? 'rotate-180' : 'stroke-muted-foreground'
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="
          data-[state=closed]:animate-collapsible-up
          data-[state=open]:animate-collapsible-down
          overflow-hidden
        "
      >
        <div className="px-3 pb-3 space-y-3">
          <ul className="space-y-3 px-2 mb-7">
            {songs.map((s) => (
              <SongItem key={s.id} item={s.song} isEdit={false} />
            ))}
          </ul>
          {date && (
            <Badge variant={'outline'}>
              {new Date(date).toLocaleDateString('ru-RU')}
            </Badge>
          )}
          <div className="flex justify-between items-center gap-3 w-full">
            {type === 'ready' ? (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={favoriteProgramHandler}
                  className="text-center px-2 py-1.5 rounded-md bg-destructive/15 text-destructive disabled:opacity-50 dark:font-medium"
                >
                  {isFavorite ? <HeartOffIcon /> : <HeartIcon />}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => archiveProgramHandler(true)}
                  className="text-center px-2 py-1.5 rounded-md bg-third/15 text-third disabled:opacity-50 dark:font-medium"
                >
                  <ArchiveIcon />
                </button>
                <button
                  onClick={() => navigate(`/program/${id}/edit`)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-foreground/20 dark:border-border w-full text-center text-muted-foreground"
                >
                  <PenIcon size={14} />
                  редактировать
                </button>
              </>
            ) : type === 'favorite' ? (
              <div className="flex items-center gap-2">
                {isArchived && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => archiveProgramHandler(false)}
                    className="text-center px-2 py-1.5 rounded-md bg-primary/15 text-primary disabled:opacity-50 dark:font-medium"
                  >
                    <RefreshCwIcon />
                  </button>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={favoriteProgramHandler}
                  className="text-center px-2 py-1.5 rounded-md bg-destructive/15 text-destructive disabled:opacity-50 dark:font-medium"
                >
                  {isFavorite ? <HeartOffIcon /> : <HeartIcon />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={deleteProgram}
                  className="text-center px-2 py-1.5 rounded-md bg-muted-foreground/15 text-muted-foreground disabled:opacity-50 dark:font-medium"
                >
                  <Trash2Icon />
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => archiveProgramHandler(false)}
                  className="text-center px-2 py-1.5 rounded-md bg-primary/15 text-primary disabled:opacity-50 dark:font-medium"
                >
                  <RefreshCwIcon />
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={favoriteProgramHandler}
                  className="text-center px-2 py-1.5 rounded-md bg-destructive/15 text-destructive disabled:opacity-50 dark:font-medium"
                >
                  {isFavorite ? <HeartOffIcon /> : <HeartIcon />}
                </button>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
