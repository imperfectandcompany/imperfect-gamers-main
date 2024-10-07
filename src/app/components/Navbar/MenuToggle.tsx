// src/components/Navigation/MenuToggle.tsx
import React from 'react';
import { X, Menu } from 'lucide-react';
import { MenuToggle as StyledMenuToggle } from '@components/Navbar/NavbarStyles';

interface MenuToggleProps {
  isOpen: boolean;
  redirecting: boolean;
  toggleMenu: () => void;
  cancelRedirect: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen = false, redirecting = false, toggleMenu, cancelRedirect }) => (
  <StyledMenuToggle
    onClick={redirecting ? cancelRedirect : toggleMenu}
    onKeyUp={(event) => {
      if (event.key === 'Enter') {
        redirecting ? cancelRedirect() : toggleMenu();
      }
    }}
    role="button"
    tabIndex={0}
  >
    {redirecting ? (
      <span className="cancel-text">Cancel</span>
    ) : (
      isOpen ? <X size={24} /> : <Menu size={24} />
    )}
  </StyledMenuToggle>
);

export default MenuToggle;
