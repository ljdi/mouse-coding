'use client'

import { createStore, type InitialState } from '@mc/store'
import { createContext, useRef, type FC, type ReactNode } from 'react'

export const StoreContext = createContext<ReturnType<
  typeof createStore
> | null>(null)

interface StoreProviderProps {
  children: ReactNode
  initialState?: InitialState
}

export const StoreProvider: FC<StoreProviderProps> = ({
  children,
  initialState,
}) => {
  // 使用 useRef 确保 store 实例在重新渲染时保持不变
  const storeRef = useRef<ReturnType<typeof createStore>>(null)

  storeRef.current ??= createStore(initialState)

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}
