'use client'

import { EditorView } from '@mc/shared/types/view'
import { cn } from '@mc/ui/lib/utils'
import { ScrollArea, ScrollBar } from '@mc/ui/shadcn/scroll-area'
import { useState, type FC } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

interface PlaygroundTabsProps {
  views: EditorView[]
}

export const EditorWithTabs: FC<PlaygroundTabsProps> = ({ views }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

  return (
    <Tabs
      className="w-full h-full bg-neutral-400 dark:bg-neutral-600"
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
    >
      <ScrollArea className="whitespace-nowrap">
        <TabList className="flex w-full h-10 bg-neutral-100 dark:bg-neutral-800">
          {views.map((view, index) => (
            <Tab key={index} className={cn('flex rounded-none! px-2 items-center', selectedIndex === index && 'outline-0 bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50')}>
              {view.icon}
              <span className="ml-2">{view.name}</span>
            </Tab>
          ))}
        </TabList>
        <ScrollBar orientation="horizontal" className="z-50" />
      </ScrollArea>

      {views.map((view, index) => (
        <TabPanel key={index}>
          <div className="h-full">{view.component}</div>
        </TabPanel>
      ))}
    </Tabs>
  )
}
