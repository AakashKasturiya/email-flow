import React, { useState } from 'react'
import { Header } from './Header';
import { Body } from './Body';

export const Layout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
      </div>

      {/* Padding to avoid header overlap */}
      <div className="pt-20">
        <Body
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobileNav={() => setIsMobileNavOpen(false)}
        />
      </div>

    </div>
  )
}
