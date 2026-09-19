import { EyeIcon, EyeOffIcon, KeySquareIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [isHide, setIsHide] = useState(true)
  const [loginValue, setLoginValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh relative max-w-[420px] mx-auto">
      <img
        className="w-full object-cover select-none pointer-events-none"
        draggable={false}
        src="./bg.png"
        alt="фон"
      />
      <div className="absolute top-7 right-6 flex items-center gap-2 text-white">
        <img
          draggable={false}
          className="max-w-14 select-none pointer-events-none"
          src="/logo.png?v=1"
          width={56}
          height={56}
          decoding="async"
          alt="Логотип"
        />
        <div className="flex gap-0.5 items-end">
          <span className="font-bold text-[26px]">Nord App</span>
          <div className="size-2 rounded-full bg-primary -translate-y-1.5" />
        </div>
      </div>
      <div className="px-5 -mt-10 pb-[120px] md:pb-0">
        <h2 className="text-4xl font-semibold">Войти</h2>
        <div className="w-20 mt-2 h-[3px] bg-primary rounded-full" />
        <form
          id="auth-form"
          onSubmit={() => {
            navigate('/')
          }}
          className="flex flex-col gap-6 mt-8 tracking-wide"
        >
          <label className="relative group">
            <div className="text-lg font-semibold">Логин</div>
            <div className="relative">
              <UserIcon
                size={20}
                className={`absolute top-1/2 -translate-y-1/2 duration-300 ${loginValue.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-6.5 w-[1.25px] duration-300 rounded-full h-4 ${loginValue.length > 0 ? 'bg-foreground' : 'bg-muted-foreground'}`}
              />
              <input
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                type="text"
                className="rounded-none shadow-none border-0 border-b-2 font-medium py-2 pl-8.5 outline-none w-full"
                placeholder="введите логин"
              />
            </div>
            <div className="border-b-2 border-primary absolute bottom-0 left-0 w-0 duration-300 group-has-focus-visible:w-full" />
          </label>
          <label className="relative group">
            <div className="text-lg font-semibold">Пароль</div>
            <div className="relative">
              <KeySquareIcon
                size={20}
                className={`absolute top-1/2 -translate-y-1/2 duration-300 ${passwordValue.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-6.5 w-[1.25px] duration-300 rounded-full h-4 ${passwordValue.length > 0 ? 'bg-foreground' : 'bg-muted-foreground'} `}
              />
              <input
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                type={isHide ? 'password' : 'text'}
                className="rounded-none shadow-none border-0 border-b-2 font-medium py-2 pl-8.5 outline-none w-full"
                placeholder="введите пароль"
              />
              {isHide ? (
                <EyeIcon
                  size={22}
                  onClick={() => setIsHide(false)}
                  className={`absolute top-1/2 -translate-y-1/2 right-0 duration-300 ${passwordValue.length > 0 ? 'text-foreground' : 'text-muted-foreground'}`}
                />
              ) : (
                <EyeOffIcon
                  size={22}
                  onClick={() => setIsHide(true)}
                  className="absolute top-1/2 -translate-y-1/2 right-0 text-muted-foreground duration-300 group-has-focus-visible:text-foreground"
                />
              )}
            </div>
            <div className="border-b-2 border-primary absolute bottom-0 left-0 w-0 duration-300 group-has-focus-visible:w-full" />
          </label>
        </form>
      </div>
      <div className="fixed bottom-5 left-0 right-0 max-w-[420px] mx-auto px-5">
        <button
          type="submit"
          form="auth-form"
          className="w-full bg-primary rounded-lg text-background py-2.5 text-lg font-semibold"
        >
          Войти
        </button>
        <p className="font-medium text-muted-foreground text-center mt-3">
          У вас нет аккаунта?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-primary font-semibold "
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  )
}
