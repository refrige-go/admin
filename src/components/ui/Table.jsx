import { classNames } from '../../lib/utils';

/**
 * 테이블 컴포넌트
 */
export function Table({ children, className = '', ...props }) {
  return (
    <div className="overflow-x-auto">
      <table className={classNames('min-w-full', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

/**
 * 테이블 헤더 컴포넌트
 */
export function TableHeader({ children, className = '', ...props }) {
  return (
    <thead className={classNames('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  );
}

/**
 * 테이블 바디 컴포넌트
 */
export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={classNames('bg-white divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  );
}

/**
 * 테이블 행 컴포넌트
 */
export function TableRow({ children, className = '', ...props }) {
  return (
    <tr className={classNames('hover:bg-gray-50', className)} {...props}>
      {children}
    </tr>
  );
}

/**
 * 테이블 헤더 셀 컴포넌트
 */
export function TableHead({ children, className = '', ...props }) {
  return (
    <th 
      className={classNames(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )} 
      {...props}
    >
      {children}
    </th>
  );
}

/**
 * 테이블 데이터 셀 컴포넌트
 */
export function TableCell({ children, className = '', ...props }) {
  return (
    <td 
      className={classNames('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)} 
      {...props}
    >
      {children}
    </td>
  );
} 