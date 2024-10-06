import React from 'react'
import NavItem from './NavItem'

interface NavListProps {
  isOpen: boolean
  redirecting: boolean
  handleRedirect: (url: string) => void
}

const NavList: React.FC<NavListProps> = ({ isOpen, redirecting, handleRedirect }) => {
  if (redirecting) {
    return null // Will handle redirect message separately
  }

  const navItems = [
    { label: 'HOME', url: 'https://imperfectgamers.org/', icon: 'home' },
    { label: 'STATS', url: 'https://imperfectgamers.org/stats' },
    { label: 'INFRACTIONS', url: 'https://imperfectgamers.org/infractions' },
    { label: 'STORE', url: 'https://store.imperfectgamers.org' },
    { label: 'SUPPORT', url: 'https://support.imperfectgamers.org' },
  ]

  return (
    <ul
      className={`flex flex-col items-center transition-all duration-300 ease-out ${
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      } md:flex-row md:max-h-none md:opacity-100`}
    >
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          label={item.label}
          url={item.url}
          handleRedirect={handleRedirect}
          icon={item.icon}
        />
      ))}
    </ul>
  )
}

export default NavList
