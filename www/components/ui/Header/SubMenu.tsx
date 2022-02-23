import type { FC } from 'react'
import type { SubLink } from './Header.types'
import { useClickOutside } from '@/hooks'

interface Props {
  items?: SubLink[]
  closeSubMenu: VoidFunction
}

export const SubMenu: FC<Props> = ({ closeSubMenu, items = [] }) => {
  const clickOutsideRef = useClickOutside({
    onClickOutside: closeSubMenu,
  })

  return (
    <div
      className="absolute w-80 bg-white border border-zinc-300 rounded-md top-8 z-50 shadow-md"
      ref={clickOutsideRef}>
      <ul>
        {items.map(item => (
          <li key={item.title}>
            <a
              href={item.href}
              className="flex p-3 hover:bg-zinc-50 m-2 text-black text-sm hover:no-underline dark:text-black">
              {item.icon}
              <div className="ml-4">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-zinc-600">{item.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
