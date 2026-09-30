import { create } from 'zustand'
import type { FavoriteRef } from './navigation.types'

type NavigationState = {
  rail: boolean
  mobileNavOpen: boolean
  commandOpen: boolean
  favorites: FavoriteRef[]
  setRail: (rail: boolean) => void
  toggleRail: () => void
  setMobileNavOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  toggleFavorite: (ref: FavoriteRef) => void
  isFavorite: (id: string) => boolean
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  rail: false,
  mobileNavOpen: false,
  commandOpen: false,
  favorites: [
    { id: 'acme', label: 'Acme Corporation', kind: 'company', view: 'companies' },
    { id: 'd1', label: 'Enterprise Platform', kind: 'deal', view: 'deals' },
  ],
  setRail: (rail) => set({ rail }),
  toggleRail: () => set({ rail: !get().rail }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleFavorite: (ref) =>
    set((state) => ({
      favorites: state.favorites.some((item) => item.id === ref.id)
        ? state.favorites.filter((item) => item.id !== ref.id)
        : [...state.favorites, ref],
    })),
  isFavorite: (id) => get().favorites.some((item) => item.id === id),
}))
