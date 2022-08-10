import {
  LightningBoltIcon,
  CashIcon,
  EyeOffIcon,
  EmojiHappyIcon,
} from '@heroicons/react/outline'
import { SellingPointProps } from './SellingPoints.types'

export const SELLING_POINTS: SellingPointProps[] = [
  {
    Icon: EmojiHappyIcon,
    description:
      'Use one account to fulfill all your API needs. Access multiple APIs with a single API token.',
    title: 'Simple',
  },
  {
    Icon: LightningBoltIcon,
    description:
      "Using a new API is simple - no need to learn yet another API style, it's all the same Dev UX.",
    title: 'Fast',
  },
  {
    Icon: CashIcon,
    description:
      "Start for free. It's a simple pay as you grow model and everything is priced per request.",
    title: 'Affordable',
  },
]
