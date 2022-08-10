import create from 'zustand'
import { OutputTypes } from '@/lib/constants'

type PlaygroundState = {
  currentTab: OutputTypes
  selectedApi: string
  setSelectedApi: (selectedApi: string) => void
  setCurrentTab: (currentTab: OutputTypes) => void
}

export const usePlaygroundStore = create<PlaygroundState>(set => ({
  currentTab: OutputTypes.Response,
  selectedApi: '',
  // Methods
  setSelectedApi: (selectedApi: string) =>
    set(state => ({ ...state, selectedApi })),
  setCurrentTab: (currentTab: OutputTypes) =>
    set(state => ({ ...state, currentTab })),
}))
