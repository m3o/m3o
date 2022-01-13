import type { FC } from 'react'
import { ChatAlt2Icon } from '@heroicons/react/outline'

export const FeedbackButton: FC = () => {
  return (
    <a
      href="mailto:support@m3o.com?subject=M3O Cloud Feedback"
      className="mt-4 inline-flex px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700"
    >
      <ChatAlt2Icon className="w-5 mr-2" /> Feedback
    </a>
  )
}
