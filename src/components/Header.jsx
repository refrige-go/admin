'use client'

import { Bell, Settings } from 'lucide-react'
import { Button } from './ui/Button'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from "next/navigation";

/**
 * 애플리케이션 헤더 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onMenuClick - 메뉴 클릭 핸들러
 * @returns {JSX.Element} Header 컴포넌트
 */
function Header({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-[#190a49] text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Refrige-go Admin Page</h1>
      
      <div className="flex items-center gap-4">
        {/* 알림 */}
        <button 
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="알림"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* 설정 */}
        <button 
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="설정"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 인증된 사용자: 프로필 및 로그아웃 */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#190a49] text-sm font-medium">
                {user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </span>
            </div>
            <span className="text-sm">
              {user?.nickname || user?.username || 'Admin'}
            </span>
            <Button variant="outline" size="sm" className="text-white border-white ml-2" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-white border-white">
                로그인
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header; 