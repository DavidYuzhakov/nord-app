import { Spinner } from './ui/spinner'

export function Loading() {
  return (
    <div className="flex items-center justify-between h-screen w-full">
      <Spinner className="size-10 flex-1" />
    </div>
  )
}
