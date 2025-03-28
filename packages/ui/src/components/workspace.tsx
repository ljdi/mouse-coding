import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingKey } from '@mc/shared/constants/loading'
import { useLoading } from '@mc/shared/hooks/useLoading'
import { Workspace } from '@mc/shared/lib/workspace'
import { useStore } from '@mc/store'
import { Button } from '@mc/ui/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@mc/ui/shadcn/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@mc/ui/shadcn/form'
import { Input } from '@mc/ui/shadcn/input'
import { Loader2 } from 'lucide-react'
import { FC, FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface WorkspaceCreateProps {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmitted: () => void
}

const formSchema = z.object({
  workspaceName: z
    .string()
    .min(2)
    .max(32)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Workspace name can only contain letters, numbers, hyphens, and underscores',
    ),
})

export const WorkspaceCreateFormDialog: FC<WorkspaceCreateProps> = ({
  trigger,
  open,
  onOpenChange,
  onSubmitted,
}) => {
  const isLoading = useStore(state => state.isLoading)
  const createWorkspaceWithLoading = useLoading(
    LoadingKey.WORKSPACE_CREATING,
    async (workspaceName: string) => {
      const workspace = new Workspace(workspaceName)
      await workspace.create()
      await workspace.init()
    },
  )
  const createWorkspaceIsLoading = isLoading(LoadingKey.WORKSPACE_CREATING)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceName: '',
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    form
      .handleSubmit(async ({ workspaceName }: z.infer<typeof formSchema>) => {
        await createWorkspaceWithLoading(workspaceName)
        onSubmitted()

        // 关闭 Dialog
        onOpenChange?.(false)
      })(e)
      .catch((error: unknown) => {
        form.setError('workspaceName', {
          type: 'manual',
          message:
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'Failed to create workspace',
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
              name="workspaceName"
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
