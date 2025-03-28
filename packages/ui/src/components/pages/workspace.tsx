'use client'

import { LayoutId } from '@mc/shared/constants/layout'
import { useStore } from '@mc/store'
import { DefaultLayout } from '@mc/ui/components/layout/default'
import { SearchBar } from '@mc/ui/components/search-bar'
import { WorkspaceCreateFormDialog } from '@mc/ui/components/workspace'
import { Button } from '@mc/ui/shadcn/button'
import { ChevronDown, Grid, List, Plus } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

interface WorkspacePageProps {
  defaultSize?: number[]
}
export const WorkspacePage: FC<WorkspacePageProps> = () => {
  const isMounted = useStore(state => state.isMounted)
  const workspaceMount = useStore(state => state.mount)
  useEffect(() => {
    if (isMounted) {
      workspaceMount().catch(console.error)
    }
  }, [isMounted, workspaceMount])

  const [open, setOpen] = useState(false)

  return (
    <DefaultLayout
      id={LayoutId.WORKSPACE}
      search={<SearchBar />}
    >
      <div className="flex min-h-screen flex-col">
        <div className="p-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="mb-4 flex-1 text-lg font-medium">项目</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                按活跃度排序
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>

              <div className="border-border flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none rounded-l-md"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none rounded-r-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                <span>Create</span>
                <WorkspaceCreateFormDialog
                  open={open}
                  trigger="Create"
                  onOpenChange={setOpen}
                  onSubmitted={() => {
                  // TODO: 刷新列表
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
