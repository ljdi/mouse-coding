'use client'

import { View } from '@mc/shared/types/view'
import { ScrollArea, ScrollBar } from '@mc/ui/shadcn/scroll-area'
import { type FC } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

interface PlaygroundTabsProps {
  views: View[]
}

export const PanelTabs: FC<PlaygroundTabsProps> = ({ views }) => {
  return (
    <Tabs className="w-full">
      <ScrollArea className="whitespace-nowrap">
        <TabList className="w-max flex">
          {views.map((view, index) => (
            <Tab
              key={index}
              className="flex py-0.5 px-2 !rounded-none"
            >
              {view.icon && (
                <div className="mr-2 flex items-center">
                  {view.icon}
                </div>
              )}
              {view.name}
            </Tab>
          ))}
        </TabList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {views.map((view, index) => (
        <TabPanel key={index}>
          <div className="h-full">{view.component}</div>
        </TabPanel>
      ))}
    </Tabs>
  )
}
