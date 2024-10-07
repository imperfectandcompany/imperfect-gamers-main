import React from 'react'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Bell, Search } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-zinc-950 border-b border-red-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg?height=40&width=40" alt="Imperfect Gamers Logo" className="h-10" />
            <span className="text-xl font-bold">Imperfect Gamers</span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="hover:text-red-500 transition">COMMUNITY</a>
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
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
