import { Fragment, isValidElement, type FC, type ReactNode } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

interface PanelWrapperProps {
  direction?: 'horizontal' | 'vertical'
  defaultSize?: number[]
  views: ReactNode[]
}

export const PanelGroup: FC<PanelWrapperProps> = ({
  views,
  direction = 'horizontal',
  defaultSize,
}) => {
  return (
    <ResizablePanelGroup direction={direction}>
      {views.map(
        (view, index) =>
          isValidElement(view) && (
            <Fragment key={view.key}>
              {index > 0 && <ResizableHandle className='w-0 after:w-0' />}
              <ResizablePanel defaultSize={defaultSize?.[index]}>
                {view}
              </ResizablePanel>
            </Fragment>
          )
      )}
    </ResizablePanelGroup>
  )
}
