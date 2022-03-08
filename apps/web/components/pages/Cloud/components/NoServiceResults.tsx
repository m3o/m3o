import { LinkButton } from '@/components/ui'

interface Props {
  serviceName: string
  startLink: string
}

export function NoServiceResults({ startLink, serviceName }: Props) {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-xl mb-6">You currently have no {serviceName}</h2>
      <LinkButton href={startLink} className="inline-block">
        Add
      </LinkButton>
    </div>
  )
}
