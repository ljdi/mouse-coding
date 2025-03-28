import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingKey } from '@mc/shared/constants/loading'
import { useLoading } from '@mc/shared/hooks/useLoading'
import { getWorkspaceNames } from '@mc/shared/lib/workspace'
import { useStore } from '@mc/store'
import { cn } from '@mc/ui/lib/utils'
import { Button } from '@mc/ui/shadcn/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@mc/ui/shadcn/command'
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
import { Popover, PopoverContent, PopoverTrigger } from '@mc/ui/shadcn/popover'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface WorkspaceCreateProps {
  trigger: React.ReactNode
  defaultValue: string
  onOpenChange: (isOpen: boolean) => void
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

export const WorkspaceCreate: FC<WorkspaceCreateProps> = ({
  trigger,
  defaultValue,
  onOpenChange,
}) => {
  const createWorkspace = useStore(state => state.createWorkspace)
  const isLoading = useStore(state => state.isLoading)
  const createWorkspaceWithLoading = useLoading(
    LoadingKey.WORKSPACE_CREATING,
    createWorkspace,
  )
  const createWorkspaceIsLoading = isLoading(LoadingKey.WORKSPACE_CREATING)

  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceName: defaultValue,
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    form
      .handleSubmit(async ({ workspaceName }: z.infer<typeof formSchema>) => {
        await createWorkspaceWithLoading(workspaceName)
        // setOpen(false) // 手动关闭不会触发 Dialog 的 onOpenChange 事件
        onOpenChange(false)
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

  const handleDialogOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
                  {/* <FormDescription>
                    The workspace name must be between 2 and 32 characters long and can only contain letters, numbers, hyphens, and underscores.
                  </FormDescription> */}
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

export function WorkspaceSelector() {
  const [open, setOpen] = useState(false)
  const [workspaceNames, setWorkspaceNames] = useState<string[]>([])
  const [inputWorkspaceName, setInputWorkspaceName] = useState('')

  const activeWorkspaceName = useStore(state => state.selectedWorkspaceName)
  const selectWorkspace = useStore(state => state.selectWorkspace)
  const workspaceInitialized = useStore(state => state.workspacesAreReady)

  useEffect(() => {
    if (workspaceInitialized) {
      getWorkspaceNames().then(setWorkspaceNames).catch(console.error)
    }
  }, [open, workspaceInitialized])

  const handleSelectWorkspace = (workspaceName: string) => {
    if (workspaceName !== activeWorkspaceName) {
      selectWorkspace(workspaceName)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {activeWorkspaceName ?? 'Select workspace...'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search workspace..."
            value={inputWorkspaceName}
            onValueChange={setInputWorkspaceName}
          />
          <CommandList>
            <CommandEmpty>
              <WorkspaceCreate
                trigger={`Create ${inputWorkspaceName} workspace`}
                defaultValue={inputWorkspaceName}
                onOpenChange={(isOpen) => {
                  console.log('-----', isOpen)
                  setOpen(isOpen)
                  if (!isOpen) {
                    setInputWorkspaceName('')
                  }
                }}
              />
            </CommandEmpty>
            {/* <CommandGroup>
              <CommandItem>
                <WorkspaceCreate
                  trigger="Create workspace"
                  onOpenChange={setOpen}
                />
              </CommandItem>
            </CommandGroup> */}
            <CommandGroup>
              {workspaceNames.map(workspaceName => (
                <CommandItem
                  key={workspaceName}
                  value={workspaceName}
                  onSelect={handleSelectWorkspace}
                >
                  {workspaceName}
                  <Check
                    className={cn(
                      'ml-auto',
                      activeWorkspaceName === workspaceName
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
