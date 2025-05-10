import { FC } from 'react'

interface WorkspacePageProps {
  projectId: string
}

export const ProjectPage: FC<WorkspacePageProps> = ({ projectId }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Project
        <span className="text-gray-500">
          (
          {projectId}
          )
        </span>
      </h1>
      <p className="text-gray-500">This is the workspace page.</p>
    </div>
  )
}
