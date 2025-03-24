'use client'

import { GitBranch, GitCommit, GitPullRequest } from 'lucide-react'

export function SidebarViewGit() {
  return (
    <>
      <div className="mb-4 flex items-center">
        <GitBranch className="mr-2 size-4" />
        <span className="text-sm">main</span>
      </div>
      <div className="text-muted-foreground mb-4 text-sm">没有暂存的更改</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <GitCommit className="mr-2 size-4" />
          <span className="text-sm">最近提交</span>
        </div>
        <div className="flex items-center">
          <GitPullRequest className="mr-2 size-4" />
          <span className="text-sm">拉取请求</span>
        </div>
      </div>
    </>
  )
}
