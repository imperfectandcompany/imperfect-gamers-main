// src/components/Navigation/NavList.tsx
import React from 'react';
import { NavList as StyledNavList } from '@components/Navbar/NavbarStyles';
import NavItem from '@components/Navbar/NavItem';

interface NavListProps {
  isOpen: boolean;
  redirecting: boolean;
  handleRedirect: (url: string) => void;
}

const NavList: React.FC<NavListProps> = ({ isOpen, redirecting, handleRedirect }) => {
  if (redirecting) {
    return null; // Will handle redirect message separately
  }

  const navItems = [
    { label: 'HOME', url: 'https://imperfectgamers.org/', icon: 'home' },
    { label: 'STATS', url: 'https://imperfectgamers.org/stats' },
    { label: 'INFRACTIONS', url: 'https://imperfectgamers.org/infractions' },
    { label: 'STORE', url: 'https://store.imperfectgamers.org' },
    { label: 'Blog', url: 'https://blog.imperfectgamers.org' },
    { label: 'SUPPORT', url: 'https://support.imperfectgamers.org' },
  ];

  return (
    <StyledNavList isOpen={isOpen} redirecting={redirecting}>
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          label={item.label}
          url={item.url}
          handleRedirect={handleRedirect}
          icon={item.icon}
        />
      ))}
    </StyledNavList>
  );
};

export default NavList;
