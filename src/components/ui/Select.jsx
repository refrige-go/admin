import { classNames } from '../../lib/utils';

/**
 * 재사용 가능한 Select 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - select 옵션들
 * @param {string} props.className - 추가 CSS 클래스
 * @param {any} props.value - 선택된 값
 * @param {Function} props.onChange - 변경 이벤트 핸들러
 * @param {boolean} props.disabled - 비활성화 여부
 * @returns {JSX.Element} Select 컴포넌트
 */
export function Select({
  children,
  className = '',
  value,
  onChange,
  disabled = false,
  ...props
}) {
  const selectClasses = classNames(
    'w-full px-3 py-2 border rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    'bg-white',
    className
  );

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
} 