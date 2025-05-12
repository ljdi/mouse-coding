import { useParams } from '@tanstack/react-router'
import type { FC } from 'react'

export const Project: FC = () => {
  const { projectId } = useParams({ strict: false })

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold'>
        Project
        <span className='text-gray-500'>({projectId})</span>
      </h1>
      <p className='text-gray-500'>This is the workspace page.</p>
    </div>
  )
}
