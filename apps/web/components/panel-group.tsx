'use client'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@mc/ui/components/resizable'
import { FC, Fragment, ReactNode } from 'react'

interface PanelWrapperProps {
  direction?: 'horizontal' | 'vertical'
  defaultSize?: number[]
  views: ReactNode[]
  onLayout?: (sizes: number[]) => void
}

export const PanelGroup: FC<PanelWrapperProps> = ({
  views,
  direction = 'horizontal',
  defaultSize,
  onLayout,
}) => {
  return (
    <ResizablePanelGroup
      autoSaveId="playground"
      direction={direction}
      onLayout={onLayout}
    >
      {views.map(
        (view, index) =>
          view && (
            <Fragment key={index}>
              {index > 0 && <ResizableHandle className="w-0 after:w-0" />}
              <ResizablePanel defaultSize={defaultSize?.[index]}>
                {view}
              </ResizablePanel>
            </Fragment>
          ),
      )}
    </ResizablePanelGroup>
  )
}
