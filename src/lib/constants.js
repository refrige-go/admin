// API 관련 상수
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// 애플리케이션 설정
export const APP_CONFIG = {
  name: 'Admin Dashboard',
  version: '1.0.0',
  description: '관리자 대시보드',
};

// TogeDaeng 색상 시스템
export const COLORS = {
  primary: '#190a49',      // 메인 헤더 색상
  accent: '#0078d2',       // 액센트 색상 (버튼, 링크)
  background: '#e2e9ef',   // 메인 배경
  white: '#ffffff',        // 카드 배경
  border: '#dfe1e3',       // 보더 색상
  textPrimary: '#000000',  // 메인 텍스트
  textSecondary: '#404040', // 서브 텍스트
  textMuted: '#bfc5c8',    // 비활성 텍스트
  textLight: '#979797',    // 라이트 텍스트
};

// 상태별 색상 정의
export const STATUS_COLORS = {
  Active: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  Hold: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  Requested: {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-200'
  },
  Inactive: {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200'
  }
};

// 네비게이션 메뉴 구성
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'ti-layout-dashboard',
  },
  {
    id: 'users',
    label: '사용자 관리',
    href: '/users',
    icon: 'ti-users',
  },
  {
    id: 'products',
    label: '상품 관리',
    href: '/products',
    icon: 'ti-package',
  },
  {
    id: 'orders',
    label: '주문 관리',
    href: '/orders',
    icon: 'ti-shopping-cart',
  },
  {
    id: 'settings',
    label: '설정',
    href: '/settings',
    icon: 'ti-settings',
  },
];

// 사용자 역할
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

// 상태 코드
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
}; 