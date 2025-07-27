'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react';
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Carrot,
  BarChart3,
  HelpCircle,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  X,
  ListTodo
} from 'lucide-react'
import { classNames } from '../lib/utils'

/**
 * 사이드바 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 사이드바 열림 상태 (모바일)
 * @param {Function} props.onClose - 사이드바 닫기 핸들러
 * @returns {JSX.Element} Sidebar 컴포넌트
 */
function Sidebar({ isOpen = false, onClose = () => { } }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "대시보드", key: "dashboard", href: "/" },
    { icon: Users, label: "회원 관리", key: "회원관리", href: "/users" },
    { icon: Package, label: "식재료 관리", key: "ingredient", href: "/ingredients" },
    { icon: BarChart3, label: "통계/분석", key: "analytics", href: "/analytics" },
    { icon: HelpCircle, label: "문의사항", key: "inquiry", href: "/inquiry" },
    { icon: Megaphone, label: "공지사항", key: "notice", href: "/notice" },
  ]

  const getSelectedNav = () => {
    console.log('현재 경로:', pathname); // 디버깅용
    if (pathname === '/' || pathname === '') {
      return 'dashboard';
    }
    if (pathname.startsWith('/users')) {
      return '회원관리';
    }
    if (pathname.startsWith('/ingredients')) {
      return 'ingredient';
    }
    if (pathname.startsWith('/analytics')) {
      return 'analytics';
    }
    if (pathname.startsWith('/inquiry')) {
      return 'inquiry';
    }
    if (pathname.startsWith('/notice')) {
      return 'notice';
    }


    return 'dashboard' // 기본값
  }  

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  // 현재 선택된 네비게이션 항목
  const selectedNav = getSelectedNav();
  console.log('선택된 네비게이션:', selectedNav); // 디버깅용

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside className={classNames(
        'fixed xl:static top-0 left-0 z-20 bg-white shadow-md',
        'transform transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
        collapsed ? 'w-[70px]' : 'w-64',
        'min-h-[calc(100vh-72px)]'
      )}>
        {/* 토글 버튼 */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-[#190a49] text-white w-6 h-6 rounded-full flex items-center justify-center z-50 shadow-md hover:bg-[#0f0533] transition-colors"
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* 모바일 닫기 버튼 */}
        <button
          onClick={onClose}
          className="xl:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          aria-label="사이드바 닫기"
        >
          <X size={20} />
        </button>

        <div className="p-4">
          {/* 관리자 프로필 */}
          {!collapsed && (
            <div className="mb-6">
              <div className="flex items-center gap-3 p-3 bg-[#f5f5f5] rounded-lg">
                <div className="w-10 h-10 bg-[#0078d2] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">A</span>
                </div>
                <span className="text-[#bfc5c8] font-medium">Admin</span>
              </div>
            </div>
          )}

          {/* 네비게이션 */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = getSelectedNav === item.key

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={classNames(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-[#0078d2] text-white'
                      : 'text-[#bfc5c8] hover:bg-[#f5f5f5]',
                    collapsed && 'justify-center'
                  )}
                  onClick={() => setSelectedNav(item.key)}
                  title={collapsed ? item.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar; 