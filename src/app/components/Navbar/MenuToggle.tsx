import React from 'react'
import { X, Menu } from 'lucide-react'

interface MenuToggleProps {
  isOpen: boolean
  redirecting: boolean
  toggleMenu: () => void
  cancelRedirect: () => void
}

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, redirecting, toggleMenu, cancelRedirect }) => (
  <div
    onClick={redirecting ? cancelRedirect : toggleMenu}
    onKeyUp={(event) => {
      if (event.key === 'Enter') {
        redirecting ? cancelRedirect() : toggleMenu()
      }
    }}
    role="button"
    tabIndex={0}
    className="flex justify-center items-center p-4 bg-[#1a1a1a] cursor-pointer text-white transition-colors"
  >
    {redirecting ? (
      <span className="cancel-text">Cancel</span>
    ) : (
      isOpen ? <X size={24} /> : <Menu size={24} />
    )}
  </div>
)

export default MenuToggle
