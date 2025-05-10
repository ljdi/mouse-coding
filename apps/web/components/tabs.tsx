'use client'

import { EditorView } from '@mc/shared/types/view'
import { ScrollArea, ScrollBar } from '@mc/ui/components/scroll-area'
import { cn } from '@mc/ui/lib/utils'
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
      className="h-full w-full bg-neutral-300 dark:bg-neutral-700"
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
    >
      <ScrollArea className="whitespace-nowrap">
        <TabList className="flex h-10 w-full bg-neutral-100 dark:bg-neutral-800">
          {views.map((view, index) => (
            <Tab
              key={index}
              className={cn(
                'rounded-none! flex items-center px-2',
                selectedIndex === index
                && 'bg-neutral-200 text-neutral-950 outline-0 dark:bg-neutral-800 dark:text-neutral-50',
              )}
            >
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
