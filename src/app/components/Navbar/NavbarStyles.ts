// src/components/Navigation/NavbarStyles.ts
import styled, { keyframes } from 'styled-components';

export const NavWrapper = styled.nav`
 width: 100%;
 box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

export const NavList = styled.ul<{ isOpen: boolean; redirecting: boolean }>`
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 width: 100%;
 padding: 0;
 margin: 0;
 background-color: #1a1a1a;
 transition: max-height 0.3s ease-out, background-color 0.3s, opacity 0.3s;
 overflow: hidden;
 max-height: ${props => (props.isOpen || props.redirecting ? '500px' : '0')};
 opacity: ${props => (props.isOpen || props.redirecting ? '1' : '0')};
 background-color: ${props => (props.redirecting ? '#2a2a2a' : '#1a1a1a')};

 @media (min-width: 768px) {
   flex-direction: row;
   max-height: none;
   opacity: 1;
 }
`

export const NavItem = styled.button`
 flex: 1;
 display: flex;
 justify-content: center;
 align-items: center;
 padding: 15px 0;
 margin: 0;
 background-color: transparent;
 border: none;
 color: #ffffff;
 height: 50px;
 line-height: 50px;
 width: 100%;
 transition: background-color 0.3s, color 0.3s, transform 0.3s, opacity 0.3s;


   border-bottom: 2px solid #3a3a3a;


 &:hover, &.active {
   background-color: #2a2a2a;
   color: #bfbfbf;
 }

 @media (min-width: 768px) {
   border-right: 2px solid #3a3a3a;
 }

 &:last-child {
   border-bottom: 2px solid #3a3a3a;
   @media (min-width: 768px) {
     border-right: none;
   }
 }
`

export const MenuToggle = styled.div`
 display: flex;
 justify-content: center;
 align-items: center;
 padding: 15px 0;
 margin: 0;
 font-size: 20px;
 background-color: #1a1a1a;
 transition: background-color 0.3s, color 0.3s;
 color: #ffffff;
 cursor: pointer;

 @media (min-width: 768px) {
   display: none;
 }
`

export const RedirectMessage = styled.div<{ redirecting: boolean }>`
 padding: 15px;
 width: 100%;
 background-color: #1a1a1a;
 color: #ffffff;
 transition: background-color 0.3s, color 0.3s, transform 0.3s, opacity 0.3s;
 transform: translateY(${props => (props.redirecting ? '0' : '-20px')});
 opacity: ${props => (props.redirecting ? '1' : '0')};
 cursor: default !important;
 height: 50px;
 line-height: 50px;
`

export const CancelButton = styled.button`
 cursor: pointer;
 background: none;
 border: none;
 color: #ffffff;
 font-size: 16px;
 transition: color 0.3s;

 &:hover {
   color: #bfbfbf;
 }
   `;