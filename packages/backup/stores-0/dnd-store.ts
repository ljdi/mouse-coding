import { createStore } from "zustand/vanilla";

export type DndState = {
  isDragging: boolean;
};

export type DndActions = {
  onDragging: (isDragging: boolean) => void;
};

export type DndStore = DndState & DndActions;

export const initDndStore = (): DndState => {
  return { isDragging: false };
};

export const defaultInitState: DndState = {
  isDragging: false,
};

export const createDndStore = (initState: DndState = defaultInitState) => {
  return createStore<DndStore>()((set) => ({
    ...initState,
    onDragging: (isDragging) => set(() => ({ isDragging })),
  }));
};
