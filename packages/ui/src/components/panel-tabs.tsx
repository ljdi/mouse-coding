'use client'

import { type Editor } from '@mc/shared/types/editor'
import { ScrollArea, ScrollBar } from '@mc/ui/shadcn/scroll-area'
import { type FC } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

interface PlaygroundTabsProps {
  editors: Editor[]
}

export const PanelTabs: FC<PlaygroundTabsProps> = ({ editors }) => {
  return (
    <Tabs className="w-full">
      <ScrollArea className="whitespace-nowrap">
        <TabList className="w-max">
          {editors.map((editor, index) => (
            <Tab key={index}>{editor.name}</Tab>
          ))}
        </TabList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {editors.map((editor, index) => (
        <TabPanel key={index}>
          <div className="h-full bg-gray-100">{editor.component}</div>
        </TabPanel>
      ))}
    </Tabs>
  )
}
