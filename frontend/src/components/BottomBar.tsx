import { HomeIcon, Music4Icon, RadioIcon } from 'lucide-react'
import type React from 'react'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface INavLink {
  title: string
  to: string
  icon: React.JSX.Element
}

const navLink: INavLink[] = [
  {
    title: 'Главная',
    to: '/',
    icon: <HomeIcon size={23} className="stroke-inherit" />,
  },
  {
    title: 'Live Mode',
    to: '/live-mode',
    icon: <RadioIcon size={23} className="stroke-inherit" />,
  },
  {
    title: 'Хвалы',
    to: '/songs',
    icon: <Music4Icon size={23} className="stroke-inherit" />,
  },
]

export function BottomBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNavigate = useCallback(
    (to: string) => {
      if (pathname !== to) navigate(to)
    },
    [navigate, pathname],
  )

  return (
    <ul
      className="
        max-w-md
        mx-auto
        test
        fixed bottom-3 left-2.5 right-2.5 z-1
        flex gap-2 justify-around items-center
        rounded-4xl pt-1.5 pb-1
        bg-secondary/60 backdrop-blur-xs
        border-2 border-background/50
        dark:border-muted/50
        drop-shadow-xs
        shadow-[0_0_1px_rgba(0,0,0,0.07),0_0_2px_rgba(0,0,0,0.07),0_0_7px_rgba(0,0,0,0.04)]
        dark:shadow-[0_0_1px_rgba(0,0,0,0.27),0_0_2px_rgba(0,0,0,0.27),0_0_7px_rgba(0,0,0,0.24)]
      "
    >
      {navLink.map((nav) => {
        const isActive =
          pathname === nav.to ||
          (pathname.startsWith(`${nav.to}/`) && nav.to !== '/')
        return (
          <li
            onClick={() => handleNavigate(nav.to)}
            className="relative text-[11px] flex flex-col items-center dupration-200"
            key={nav.title}
          >
            <div
              className={`transition-all duration-200 drop-shadow-sm ${
                isActive
                  ? 'stroke-primary scale-115 drop-shadow-primary/30'
                  : 'stroke-secondary-foreground drop-shadow-transparent'
              }`}
            >
              {nav.icon}
            </div>
            <span
              className={`${
                isActive ? 'text-primary' : 'text-secondary-foreground'
              } font-semibold select-none`}
            >
              {nav.title}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
