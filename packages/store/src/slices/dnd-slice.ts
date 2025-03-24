import { type StateCreator } from 'zustand'

export interface DndSlice {
  components: string[]
  addComponent: (component: string) => void
}

export const createDndSlice: StateCreator<DndSlice> = set => ({
  components: [],
  addComponent: (component) => { set(state => ({ components: [...state.components, component] })) },
})
