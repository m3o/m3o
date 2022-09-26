import type { ComponentType, ComponentProps } from 'react'
import {
  AnnotationIcon,
  ClockIcon,
  CodeIcon,
  CogIcon,
  ChartBarIcon,
  ChatIcon,
  ChatAltIcon,
  CloudIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DesktopComputerIcon,
  IdentificationIcon,
  KeyIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  DatabaseIcon,
  EmojiHappyIcon,
  FilmIcon,
  MailIcon,
  MapIcon,
  MoonIcon,
  GlobeIcon,
  DocumentIcon,
  PhotographIcon,
  LinkIcon,
  HandIcon,
  PuzzleIcon,
  ShareIcon,
  SunIcon,
  ChatAlt2Icon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  QrcodeIcon,
  TerminalIcon,
  TicketIcon,
  TrendingUpIcon,
  RssIcon,
  SearchIcon,
  SwitchHorizontalIcon,
  TranslateIcon,
  TruckIcon,
  VideoCameraIcon,
  UserIcon,
  UserCircleIcon,
  UserGroupIcon,
  BanIcon,
  ViewListIcon,
} from '@heroicons/react/outline'

type Icons = Record<string, ComponentType<ComponentProps<'svg'>> | undefined>

export const ICONS: Icons = {
  address: LocationMarkerIcon,
  analytics: ChartBarIcon,
  answer: QuestionMarkCircleIcon,
  app: TerminalIcon,
  avatar: UserCircleIcon,
  bitcoin: MoonIcon,
  cache: DatabaseIcon,
  carbon: CloudIcon,
  chat: ChatAltIcon,
  contact: UserGroupIcon,
  comments: AnnotationIcon,
  cron: CogIcon,
  crypto: MoonIcon,
  currency: CurrencyDollarIcon,
  db: DatabaseIcon,
  dns: QuestionMarkCircleIcon,
  email: MailIcon,
  emoji: EmojiHappyIcon,
  ethereum: MoonIcon,
  evchargers: LightningBoltIcon,
  event: ShareIcon,
  file: DocumentIcon,
  forex: CurrencyDollarIcon,
  function: CodeIcon,
  geocoding: LocationMarkerIcon,
  gifs: PhotographIcon,
  google: SearchIcon,
  helloworld: HandIcon,
  holidays: SunIcon,
  id: DesktopComputerIcon,
  ip: DesktopComputerIcon,
  image: PhotographIcon,
  joke: EmojiHappyIcon,
  lists: ViewListIcon,
  location: LocationMarkerIcon,
  memegen: EmojiHappyIcon,
  minecraft: GlobeIcon,
  movie: FilmIcon,
  mq: ShareIcon,
  news: NewspaperIcon,
  nft: TicketIcon,
  notes: DocumentIcon,
  otp: IdentificationIcon,
  password: KeyIcon,
  ping: GlobeIcon,
  place: MapIcon,
  postcode: LocationMarkerIcon,
  prayer: GlobeIcon,
  price: CurrencyDollarIcon,
  quran: GlobeIcon,
  qr: QrcodeIcon,
  routing: LocationMarkerIcon,
  rss: RssIcon,
  search: SearchIcon,
  sentiment: DesktopComputerIcon,
  sms: ChatIcon,
  space: DatabaseIcon,
  spam: BanIcon,
  sunnah: GlobeIcon,
  stock: TrendingUpIcon,
  stream: ChatAlt2Icon,
  thumbnail: PhotographIcon,
  time: ClockIcon,
  translate: TranslateIcon,
  tunnel: SwitchHorizontalIcon,
  twitter: DesktopComputerIcon,
  url: LinkIcon,
  user: UserIcon,
  wallet: CreditCardIcon,
  weather: SunIcon,
  wordle: PuzzleIcon,
  vehicle: TruckIcon,
  youtube: VideoCameraIcon,
}
