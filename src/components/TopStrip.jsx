'use client'

import { Bell, Settings } from 'lucide-react'

export default function TopStrip() {
  return (
    <div className="app-topstrip sticky top-0 py-[15px] px-6 bg-gradient-to-r from-[#0f0533] to-[#1b0a5c] relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-white text-lg font-semibold">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white hover:text-gray-300 transition-colors">
            <Bell size={20} />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white"></div>
            <span className="text-white text-sm">Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
} 