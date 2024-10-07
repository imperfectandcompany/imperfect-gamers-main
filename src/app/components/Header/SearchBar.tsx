import React from 'react'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Search } from 'lucide-react'

const SearchBar: React.FC = () => {
  return (
    <div className="relative">
      <Input 
        type="text" 
        placeholder="Search players..." 
        className="w-64 bg-zinc-900 border-zinc-700 pr-10"
      />
      <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  )
}

export default SearchBar
