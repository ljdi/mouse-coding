'use client'

import { LayoutId } from '@mc/shared/constants/layout'
import { useStore } from '@mc/store'
import { DefaultLayout } from '@mc/ui/components/layout/default'
import { WorkspaceCard } from '@mc/ui/components/pages/dashboard/workspace-card'
import { WorkspaceCreateFormDialog } from '@mc/ui/components/pages/dashboard/workspace-create-form-dialog'
import { SearchBar } from '@mc/ui/components/search-bar'
import { Button } from '@mc/ui/shadcn/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { FC, useCallback, useEffect, useState } from 'react'

interface DashboardPageProps {
  defaultSize?: number[]
}
export const DashboardPage: FC<DashboardPageProps> = () => {
  const isMounted = useStore(state => state.isMounted)
  const listWorkspace = useStore(state => state.listWorkspace)
  const [workspaceList, setWorkspaceList] = useState<string[]>([])

  const getWorkspaceList = useCallback(() => {
    listWorkspace().then(setWorkspaceList).catch(console.error)
  }, [listWorkspace])

  useEffect(() => {
    if (isMounted) {
      getWorkspaceList()
    }
  }, [isMounted, getWorkspaceList])

  const [open, setOpen] = useState(false)

  return (
    <DefaultLayout id={LayoutId.WORKSPACE} search={<SearchBar />}>
      <div className="flex min-h-screen flex-col">
        <div className="p-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="mb-4 flex-1 text-lg font-medium">
              Workspace List
            </h2>
            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm">
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
              </div> */}

              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                <WorkspaceCreateFormDialog
                  open={open}
                  trigger="Create"
                  onOpenChange={setOpen}
                  onSubmitted={getWorkspaceList}
                />
              </Button>
            </div>
          </div>
          <div>
            {workspaceList.map(name => (
              <Link
                href={`/workspace/${name}/playground`}
                key={name}
              >
                <WorkspaceCard name={name} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
