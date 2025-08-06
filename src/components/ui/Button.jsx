import { classNames } from '../../lib/utils';

/**
 * 재사용 가능한 Button 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {string} props.variant - 버튼 스타일 ('primary' | 'secondary' | 'danger')
 * @param {string} props.size - 버튼 크기 ('sm' | 'md' | 'lg')
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {boolean} props.loading - 로딩 상태
 * @param {Function} props.onClick - 클릭 이벤트 핸들러
 * @param {string} props.className - 추가 CSS 클래스
 * @returns {JSX.Element} Button 컴포넌트
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#f9bf52] text-[#2d1b0a] hover:bg-[#e6a94a] focus:ring-[#f9bf52]/50',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-[#f9bf52] text-[#2d1b0a] hover:bg-[#f9bf52] hover:text-[#2d1b0a] focus:ring-[#f9bf52]/50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
} 