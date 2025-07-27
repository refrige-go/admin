import { classNames } from '../../lib/utils';

/**
 * 재사용 가능한 Input 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 CSS 클래스
 * @param {string} props.type - input 타입
 * @param {any} props.value - input 값
 * @param {Function} props.onChange - 변경 이벤트 핸들러
 * @param {boolean} props.disabled - 비활성화 여부
 * @returns {JSX.Element} Input 컴포넌트
 */
export function Input({
  placeholder,
  className = '',
  type = 'text',
  value,
  onChange,
  disabled = false,
  ...props
}) {
  const inputClasses = classNames(
    'w-full px-3 py-2 border rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    'placeholder:text-gray-400',
    className
  );

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputClasses}
      {...props}
    />
  );
} 