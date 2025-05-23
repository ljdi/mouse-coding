'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingKey } from '@mc/shared/constants/loading'
import { useLoading } from '@mc/shared/hooks/useLoading'
import { getProjectNameList } from '@mc/shared/utils/project'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mc/ui/components/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@mc/ui/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@mc/ui/components/form'
import { Input } from '@mc/ui/components/input'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface ProjectCreateFormProps {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmitted: () => void
}

const formSchema = z.object({
  projectName: z
    .string()
    .min(2)
    .max(32)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Workspace name can only contain letters, numbers, hyphens, and underscores',
    ),
})

export const ProjectCreateFormDialog: FC<ProjectCreateFormProps> = ({
  trigger,
  open,
  onOpenChange,
  onSubmitted,
}) => {
  const createProject = useStore(state => state.createProject)
  const isLoading = useStore(state => state.isLoading)
  const createWorkspaceWithLoading = useLoading(
    LoadingKey.PROJECT_CREATING,
    async (projectName: string) => {
      await createProject(projectName)
    },
  )
  const createWorkspaceIsLoading = isLoading(LoadingKey.PROJECT_CREATING)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    form
      .handleSubmit(async ({ projectName }: z.infer<typeof formSchema>) => {
        await createWorkspaceWithLoading(projectName)
        onSubmitted()

        // 关闭 Dialog
        onOpenChange?.(false)
      })(e)
      .catch((error: unknown) => {
        form.setError('projectName', {
          type: 'manual',
          message:
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'Failed to create project',
        })
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex-1">{trigger}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Choose a unique name for your workspace. This will help identify it
            within your projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="hello-world" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createWorkspaceIsLoading}>
                {createWorkspaceIsLoading && (
                  <Loader2 className="animate-spin" />
                )}
                Create
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
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

export const DashboardPage: FC = () => {
  const isFsInitialized = useStore(state => state.isFsInitialized)
  const [projectNameList, setProjectNameList] = useState<string[]>([])

  const fetchProjectNameList = useCallback(() => {
    getProjectNameList().then(setProjectNameList).catch(console.error)
  }, [])

  useEffect(() => {
    if (isFsInitialized) {
      fetchProjectNameList()
    }
  }, [isFsInitialized, fetchProjectNameList])

  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="p-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="mb-4 flex-1 text-lg font-medium">Projects</h2>
          <div className="flex items-center gap-2">
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

            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              <ProjectCreateFormDialog
                open={open}
                trigger="Create"
                onOpenChange={setOpen}
                onSubmitted={fetchProjectNameList}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap">
          {projectNameList.map(name => (
            <div
              className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6"
              key={name}
            >
              <Link href={`/dashboard/${name}/playground`}>
                <ProjectCard name={name} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
