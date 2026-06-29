import React from 'react'
import { Navbar } from './Navbar'
import { Outlet } from "react-router-dom";

export const Body = ({ isMobileNavOpen, onCloseMobileNav }) => {
  return (
    <div className="flex">
      
      {/* FIXED NAVBAR */}
      <div className="hidden sm:block fixed left-0 top-20 w-64 h-[calc(100vh-80px)] border-r bg-white overflow-y-auto">
        <Navbar />
      </div>

      {isMobileNavOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobileNav} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
              <div className="font-semibold text-gray-900">Menu</div>
              <button
                type="button"
                className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-700"
                onClick={onCloseMobileNav}
                aria-label="Close menu"
              >
                <i className="ri-close-line ri-lg" />
              </button>
            </div>
            <div className="p-4" onClick={onCloseMobileNav}>
              <Navbar />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <main className="flex-1 ml-0 sm:ml-64 p-4 sm:p-6">
        <Outlet />
      </main>

    </div>
  )
}
