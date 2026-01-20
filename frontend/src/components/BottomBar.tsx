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
    icon: <HomeIcon size={25} className="stroke-inherit" />,
  },
  {
    title: 'Live Mode',
    to: '/live-mode',
    icon: <RadioIcon size={25} className="stroke-inherit" />,
  },
  {
    title: 'Хвалы',
    to: '/songs',
    icon: <Music4Icon size={25} className="stroke-inherit" />,
  },
]

export function BottomBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNavigate = useCallback(
    (to: string) => {
      if (pathname !== to) navigate(to)
    },
    [navigate, pathname]
  )

  return (
    <ul
      className="
        test
        fixed bottom-3 left-2.5 right-2.5 z-1
        flex gap-2 justify-around items-center
        rounded-4xl py-2.5
        bg-secondary/20 backdrop-blur-sm
        border-2 border-white/50
        drop-shadow-xs
        shadow-[0_0_1px_rgba(0,0,0,0.07),0_0_2px_rgba(0,0,0,0.07),0_0_7px_rgba(0,0,0,0.04)]
      "
    >
      {navLink.map((nav) => {
        const isActive =
          pathname === nav.to ||
          (pathname.startsWith(`${nav.to}/`) && nav.to !== '/')
        return (
          <li
            onClick={() => handleNavigate(nav.to)}
            className="relative text-[13px] flex flex-col   items-center dupration-200"
            key={nav.title}
          >
            <div
              className={` duration-200 ${
                isActive
                  ? 'stroke-primary scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]'
                  : 'stroke-secondary-foreground'
              }`}
            >
              {nav.icon}
            </div>
            <span
              className={`${
                isActive ? 'text-primary' : 'text-secondary-foreground'
              } font-semibold`}
            >
              {nav.title}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
