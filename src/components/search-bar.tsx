import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

export function SearchBar () {
  return (
    <div className='flex items-center justify-between'>
      <div className='relative w-full max-w-md'>
        <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
        <Input placeholder='Search workspace' className='pl-10 pr-5' />
        {/* <div className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
          <kbd className="border-border bg-muted rounded border px-1.5">⌘</kbd>
          <kbd className="border-border bg-muted ml-1 rounded border px-1.5">
            K
          </kbd>
        </div> */}
      </div>
    </div>
  )
}
