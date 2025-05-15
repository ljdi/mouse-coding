import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import { type FC, type FormEvent, type ReactNode, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProjectAction } from '@/constants/action'
import { useLoading } from '@/hooks/use-loading'
import { useStore } from '@/store'
import { getProjectIds } from '@/utils/project'

interface ProjectCreateFormProps {
  trigger: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmitted: () => void
}

const formSchema = z.object({
  projectName: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Project name can only contain letters, numbers, hyphens, and underscores'),
})

export const ProjectCreateFormDialog: FC<ProjectCreateFormProps> = ({ trigger, open, onOpenChange, onSubmitted }) => {
  const createProject = useStore((state) => state.createProject)
  const [createProjectWithLoading, isLoading] = useLoading(createProject, ProjectAction.CREATE_PROJECT)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    form
      .handleSubmit(async ({ projectName }: z.infer<typeof formSchema>) => {
        await Promise.all(createProjectWithLoading(projectName))

        onSubmitted()

        // 关闭 Dialog
        onOpenChange?.(false)
      })(e)
      .catch((error: unknown) => {
        form.setError('projectName', {
          type: 'manual',
          message:
            error instanceof Error ? error.message : typeof error === 'string' ? error : 'Failed to create project',
        })
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className='flex-1'>
          <Button size='sm'>
            <Plus className='mr-1 h-4 w-4' />
            {trigger}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Choose a unique name for your project. This will help identify it within your projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <FormField
              control={form.control}
              name='projectName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder='hello-world' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='animate-spin' />}
                Create
              </Button>
              <DialogClose asChild>
                <Button variant='secondary'>Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export const ProjectCard: FC<{
  name: string
}> = ({ name }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export const Dashboard: FC = () => {
  const isFsInitialized = useStore((state) => state.isFsInitialized)
  const [projectIds, setProjectIds] = useState<string[]>([])

  const fetchProjectIds = useCallback(() => {
    getProjectIds().then(setProjectIds).catch(console.error)
  }, [])

  useEffect(() => {
    if (isFsInitialized) {
      fetchProjectIds()
    }
  }, [isFsInitialized, fetchProjectIds])

  const [open, setOpen] = useState(false)

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='p-4'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='mb-4 flex-1 text-lg font-medium'>Projects</h2>
          <div className='flex items-center gap-2'>
            {/* <div className="border-border flex items-center rounded-md border">
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

            <ProjectCreateFormDialog
              open={open}
              trigger='Create'
              onOpenChange={setOpen}
              onSubmitted={fetchProjectIds}
            />
          </div>
        </div>
        <div className='flex flex-wrap'>
          {projectIds.map((name) => (
            <div className='w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6' key={name}>
              <Link to='/dashboard/$projectId/playground' params={{ projectId: name }}>
                <ProjectCard name={name} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
