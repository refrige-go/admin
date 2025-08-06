"use client"
import { useState } from 'react'
import Dashboard from '../../components/Dashboard'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-[#e2e9ef]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          <main className="flex-1">
            <Dashboard />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}