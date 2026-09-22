import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/button'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Непредвиденная ошибка приложения:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen px-8 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <img
              src="/error-state.png"
              alt="ошибка"
              className="mx-auto mb-6 object-contain"
            />
            <h1 className="font-bold text-xl">Что-то пошло не так :(</h1>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              Не переживайте, обычно помогает простая <br /> перезагрузка
              страницы
            </p>
            <Button
              className="active:scale-95 select-none text-white"
              onClick={() => window.location.reload()}
              type="button"
            >
              Обновить
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
