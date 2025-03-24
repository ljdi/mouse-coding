'use client'

import { useStore } from '@mc/store'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@mc/ui/shadcn/resizable'
import { FC, Fragment, ReactNode } from 'react'

interface PanelWrapperProps {
  direction?: 'horizontal' | 'vertical'
  panelViews: ReactNode[]
}

export const PanelGroup: FC<PanelWrapperProps> = ({
  panelViews,
  direction = 'horizontal',
}) => {
  const defaultLayout = useStore(state => state.defaultLayout)
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
  }

  return (
    <ResizablePanelGroup
      autoSaveId="playground"
      direction={direction}
      onLayout={onLayout}
    >
      {panelViews.map((view, index) => (
        <Fragment key={index}>
          {index > 0 && <ResizableHandle />}
          <ResizablePanel
            defaultSize={defaultLayout ? defaultLayout[index] : undefined}
          >
            {view}
          </ResizablePanel>
        </Fragment>
      ))}
    </ResizablePanelGroup>
  )
}
