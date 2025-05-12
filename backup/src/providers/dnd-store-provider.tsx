import {
  type DndStore,
  createDndStore,
  initDndStore,
} from "@/stores/dnd-store";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type DndStoreApi = ReturnType<typeof createDndStore>;

export const DndStoreContext = createContext<DndStoreApi | undefined>(
  undefined,
);

export interface DndStoreProviderProps {
  children: ReactNode;
}

export const DndStoreProvider = ({ children }: DndStoreProviderProps) => {
  const storeRef = useRef<DndStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createDndStore(initDndStore());
  }

  return (
    <DndStoreContext.Provider value={storeRef.current}>
      {children}
    </DndStoreContext.Provider>
  );
};

export const useDndStore = <T,>(selector: (store: DndStore) => T): T => {
  const dndStoreContext = useContext(DndStoreContext);

  if (!dndStoreContext) {
    throw new Error("useDndStore must be used within DndStoreProvider");
  }

  return useStore(dndStoreContext, selector);
};
