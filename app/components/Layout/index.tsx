import React, {useState, useRef, createContext} from 'react';
import {Global} from '..';
import {Footer} from './Footer';
import {Header} from './Header';
import {TopBar} from './TopBar';

export interface ILayoutProps {
  children: React.ReactNode;
  layout?: any;
}

export function Layout({children, layout}: ILayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {headerMenu} = layout;

  return (
    <div className="h-full relative">
      <TopBar />
      <Header isOpen={isOpen} setCartDrawerState={setIsOpen} />
      <main role="main" id="mainContent" className="flex-grow h-full relative">
        <Global.CartDrawer isOpen={isOpen} setCartDrawerState={setIsOpen} />
        {children}
      </main>
      <Footer />
    </div>
  );
}
