import React from 'react'
import Logo from '../assets/mail.png';

export const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="sm:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open menu"
                >
                    <i className="ri-menu-line ri-lg"></i>
                </button>
                <div className="flex items-center space-x-2">
                    <img src={Logo} alt="SingleInterface Logo" width="40" height="40"  />
                    <span className="text-xl font-semibold text-gray-900">Mail <span className="text-yellow-600">Flow</span></span>
                </div>
             
            </div>
            <div className="flex items-center space-x-4">
             
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-white"></i>
                </div>
            </div>
        </div>
    </header>
  )
}
