import { classNames } from '../../lib/utils';

/**
 * 재사용 가능한 Card 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 카드 내용
 * @param {string} props.className - 추가 CSS 클래스
 * @param {boolean} props.hover - 호버 효과 여부
 * @param {Function} props.onClick - 클릭 이벤트 핸들러
 * @returns {JSX.Element} Card 컴포넌트
 */
export function Card({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  ...props 
}) {
  const cardClasses = classNames(
    'bg-white shadow rounded-lg p-6',
    hover && 'hover:shadow-lg transition-shadow cursor-pointer',
    className
  );

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header 컴포넌트
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={classNames('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * Card Title 컴포넌트
 */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={classNames('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

/**
 * Card Content 컴포넌트
 */
export function CardContent({ children, className = '' }) {
  return (
    <div className={classNames('text-gray-600', className)}>
      {children}
    </div>
  );
}

/**
 * Card Footer 컴포넌트
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={classNames('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
} 