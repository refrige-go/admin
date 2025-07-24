import styles from "@/assets/css/UserPage.module.css";

/**
 * 필터 선택 컴포넌트
 * @param {Object} props
 * @param {string} props.label - 필터 라벨 (예: '권한', '상태', '성별')
 * @param {string} props.value - 현재 선택된 값
 * @param {Function} props.onChange - 값 변경 핸들러
 * @param {Array} props.options - 옵션 배열 (예: [{value: 'ALL', label: '모두'}, {value: 'USER', label: '회원'}])
 * @returns {JSX.Element}
 */
export default function FilterSelect({
  label = "",
  value = "ALL",
  onChange = () => {},
  options = []
}) {
  return (
    <div className={styles.usersHeader}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => {
          console.log(`[FilterSelect] ${label} 변경:`, e.target.value);
          onChange(e.target.value);
        }}
        className={styles.usersSelect}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 