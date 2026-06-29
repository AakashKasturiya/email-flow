import React from 'react'

export const Footer = () => {
  return (
    <footer>
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex items-center justify-center space-x-4">
            <button class="px-8 py-3 bg-primary text-white rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap">
                <div class="w-5 h-5 flex items-center justify-center mr-2 inline-block">
                    <i class="ri-send-plane-line"></i>
                </div>
                Send Now
            </button>
            <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-button font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                Save Draft
            </button>
            <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-button font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                <div class="w-5 h-5 flex items-center justify-center mr-2 inline-block">
                    <i class="ri-calendar-line"></i>
                </div>
                Schedule Send
            </button>
        </div>
    </div>
    </footer>
  )
}
