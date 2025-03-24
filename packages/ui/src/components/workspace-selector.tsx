'use client'

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
import { Popover, PopoverContent, PopoverTrigger } from '@mc/ui/shadcn/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

const workspaces = [
  {
    value: 'personal',
    label: 'Personal Workspace',
  },
  {
    value: 'team-a',
    label: 'Team A',
  },
  {
    value: 'team-b',
    label: 'Team B',
  },
  {
    value: 'project-x',
    label: 'Project X',
  },
  {
    value: 'project-y',
    label: 'Project Y',
  },
]

export function WorkspaceSelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('personal')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {value
            ? workspaces.find(workspace => workspace.value === value)?.label
            : 'Select workspace...'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup>
              {workspaces.map(workspace => (
                <CommandItem
                  key={workspace.value}
                  value={workspace.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === workspace.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {workspace.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
