import React from 'react'
import { Home } from 'lucide-react'

interface NavItemProps {
  label: string
  url: string
  handleRedirect: (url: string) => void
  icon?: string
}

const NavItem: React.FC<NavItemProps> = ({ label, url, handleRedirect, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'home':
        return <Home size={24} />
      // Add other cases here for different icons
      default:
        return null
    }
  }

  return (
    <li
      className="w-full flex justify-center items-center py-4 text-white cursor-pointer hover:bg-[#2a2a2a] transition-all"
      onClick={() => handleRedirect(url)}
      onKeyUp={(event) => {
        if (event.key === 'Enter') handleRedirect(url)
      }}
      role="button"
      tabIndex={0}
    >
      {getIcon()}
      <span className="ml-2">{label}</span>
    </li>
  )
}

export default NavItem
