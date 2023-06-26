import type { FC } from 'react'

type ExternalLink = {
  name: string
  link: string
}

interface ExternalLinksProps {
  externalLinks: ExternalLink[]
  title: string
}

export const ExternalLinks: FC<ExternalLinksProps> = ({
  externalLinks,
  title,
}) => {
  return (
    <div className="mb-4 md:mb-0">
      <h5 className="text-black font-medium mb-2 dark:text-white">{title}</h5>
      <ul>
        {externalLinks.map(item => (
          <li key={item.link}>
            <a
              href={item.link}
              rel="noreferrer"
              className="hover:text-indigo-600 text-zinc-800 transition-colors font-light dark:text-zinc-400 text-sm"
              target="_blank">
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
