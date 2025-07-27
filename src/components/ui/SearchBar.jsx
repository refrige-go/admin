import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "@/assets/css/UserPage.module.css";

/**
 * 회원관리 검색바 컴포넌트
 * @param {Object} props
 * @param {string} props.searchField - 검색 필드값 (예: 'email')
 * @param {string} props.searchKeyword - 검색어
 * @param {Function} props.onSearchFieldChange - 검색 필드 변경 핸들러
 * @param {Function} props.onSearchKeywordChange - 검색어 변경 핸들러
 * @returns {JSX.Element}
 */
export default function SearchBar({
  searchField = "email",
  searchKeyword = "",
  onSearchFieldChange = () => {},
  onSearchKeywordChange = () => {},
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleFieldSelect = (field) => {
    onSearchFieldChange(field);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.usersSearchArea}>
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          onClick={handleDropdownToggle}
        >
          {searchField === 'email' ? '이메일' : '닉네임'}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFieldSelect('email')}
            >이메일</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFieldSelect('nickname')}
            >닉네임</li>
          </ul>
        )}
      </div>

      <input
        type="text"
        placeholder={`검색어(${searchField === 'email' ? '이메일' : '닉네임'})`}
        className={styles.usersSearchInput}
        value={searchKeyword}
        onChange={(e) => onSearchKeywordChange(e.target.value)}
      />
    </div>
  );
}
