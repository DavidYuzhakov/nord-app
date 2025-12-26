import { MusicIcon, PlusCircleIcon } from 'lucide-react'
import { programs } from '../mocks/programs'
import { Button } from '@/components/ui/button'
import { ProgramCard } from '@/components/ProgramCard'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-2.5 pb-36">
      <div className="flex items-center gap-2 py-3">
        <span className="bg-primary text-background p-2 flex items-center justify-center rounded-full text-2xl">
          <MusicIcon />
        </span>
        <span className="flex-1 text-xl tracking-tighter font-bold flex gap-0.5 items-end">
          Nord App{' '}
          <div className="size-1.5 rounded-full bg-primary -translate-y-1" />
        </span>
      </div>
      <h3 className="text-xl font-semibold">Готовые программы</h3>

      <div className="space-y-3">
        {programs.map((program) => (
          <ProgramCard key={program.id} {...program} />
        ))}
      </div>

      <Button
        onClick={() => navigate('/new-program')}
        className="flex items-center fixed bottom-24 left-7 right-7 text-xl font-semibold py-6 px-2 shadow-md "
      >
        Новая программа <PlusCircleIcon className="size-6" />
      </Button>
    </div>
  )
}
