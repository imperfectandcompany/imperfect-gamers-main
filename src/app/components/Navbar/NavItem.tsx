// src/components/Navigation/NavItem.tsx
import React from 'react';
import { Home } from 'lucide-react';
import { NavItem as StyledNavItem } from '@components/Navbar/NavbarStyles';

interface NavItemProps {
  label: string;
  url: string;
  handleRedirect: (url: string) => void;
  icon?: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, url, handleRedirect, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'home':
        return <Home size={24} />;
      // Add other cases here for different icons
      default:
        return null;
    }
  };

  return (
    <StyledNavItem
      onClick={() => handleRedirect(url)}
      onKeyUp={(event) => {
        if (event.key === 'Enter') handleRedirect(url);
      }}
      role="button"
      tabIndex={0}
      className={label === 'HOME' ? 'list__icon active' : ''}
    > 
      {getIcon()}
      <span className="ml-2">{label === 'HOME' ? null : label}</span>
    </StyledNavItem>
  );
};

export default NavItem;