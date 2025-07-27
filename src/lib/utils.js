/**
 * 날짜를 포맷팅하는 함수
 * @param {Date} date - 포맷팅할 날짜
 * @param {string} locale - 로케일 (기본값: 'ko-KR')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export function formatDate(date, locale = 'ko-KR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * 숫자를 통화 형식으로 포맷팅하는 함수
 * @param {number} amount - 포맷팅할 금액
 * @param {string} currency - 통화 코드 (기본값: 'KRW')
 * @returns {string} 포맷팅된 통화 문자열
 */
export function formatCurrency(amount, currency = 'KRW') {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * 클래스명을 조건부로 결합하는 함수
 * @param {...any} classes - 클래스명들
 * @returns {string} 결합된 클래스명
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * 문자열을 케밥 케이스로 변환하는 함수
 * @param {string} str - 변환할 문자열
 * @returns {string} 케밥 케이스로 변환된 문자열
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
} 