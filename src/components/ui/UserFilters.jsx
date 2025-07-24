import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "@/assets/css/UserPage.module.css";

/**
 * 회원관리 필터 컴포넌트 (검색 + 필터)
 * @param {Object} props
 * @param {string} props.searchField - 검색 필드값 (예: 'email')
 * @param {string} props.searchKeyword - 검색어
 * @param {Function} props.onSearchFieldChange - 검색 필드 변경 핸들러
 * @param {Function} props.onSearchKeywordChange - 검색어 변경 핸들러
 * @param {string} props.roleFilter - 권한 필터 값
 * @param {Function} props.onRoleFilterChange - 권한 필터 변경 핸들러
 * @param {string} props.statusFilter - 상태 필터 값
 * @param {Function} props.onStatusFilterChange - 상태 필터 변경 핸들러
 * @param {string} props.genderFilter - 성별 필터 값
 * @param {Function} props.onGenderFilterChange - 성별 필터 변경 핸들러
 * @param {string} props.joinDateSort - 가입일 정렬 값
 * @param {Function} props.onJoinDateSortChange - 가입일 정렬 변경 핸들러
 * @param {string} props.deleteDateSort - 삭제일 정렬 값
 * @param {Function} props.onDeleteDateSortChange - 삭제일 정렬 변경 핸들러
 * @returns {JSX.Element}
 */
export default function UserFilters({
  searchField = "email",
  searchKeyword = "",
  onSearchFieldChange = () => {},
  onSearchKeywordChange = () => {},
  roleFilter = "ALL",
  onRoleFilterChange = () => {},
  statusFilter = "ALL",
  onStatusFilterChange = () => {},
  genderFilter = "ALL",
  onGenderFilterChange = () => {},
  joinDateSort = "latest",
  onJoinDateSortChange = () => {},
  deleteDateSort = "latest",
  onDeleteDateSortChange = () => {},
}) {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isJoinDateDropdownOpen, setIsJoinDateDropdownOpen] = useState(false);
  const [isDeleteDateDropdownOpen, setIsDeleteDateDropdownOpen] = useState(false);

  const handleSearchDropdownToggle = () => {
    setIsSearchDropdownOpen(prev => !prev);
  };

  const handleRoleDropdownToggle = () => {
    setIsRoleDropdownOpen(prev => !prev);
  };

  const handleStatusDropdownToggle = () => {
    setIsStatusDropdownOpen(prev => !prev);
  };

  const handleGenderDropdownToggle = () => {
    setIsGenderDropdownOpen(prev => !prev);
  };

  const handleJoinDateDropdownToggle = () => {
    setIsJoinDateDropdownOpen(prev => !prev);
  };

  const handleDeleteDateDropdownToggle = () => {
    setIsDeleteDateDropdownOpen(prev => !prev);
  };

  const handleFieldSelect = (field) => {
    onSearchFieldChange(field);
    setIsSearchDropdownOpen(false);
  };

  const handleRoleSelect = (role) => {
    onRoleFilterChange(role);
    setIsRoleDropdownOpen(false);
  };

  const handleStatusSelect = (status) => {
    onStatusFilterChange(status);
    setIsStatusDropdownOpen(false);
  };

  const handleGenderSelect = (gender) => {
    onGenderFilterChange(gender);
    setIsGenderDropdownOpen(false);
  };

  const handleJoinDateSelect = (sort) => {
    onJoinDateSortChange(sort);
    setIsJoinDateDropdownOpen(false);
  };

  const handleDeleteDateSelect = (sort) => {
    onDeleteDateSortChange(sort);
    setIsDeleteDateDropdownOpen(false);
  };

  return (
    <div className={styles.usersSearchArea}>
      {/* 검색 필드 선택 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleSearchDropdownToggle}
        >
          {searchField === 'email' ? '이메일' : '닉네임'}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isSearchDropdownOpen && (
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

      {/* 검색어 입력 */}
      <input
        type="text"
        placeholder={`검색어(${searchField === 'email' ? '이메일' : '닉네임'})`}
        className={styles.usersSearchInput}
        value={searchKeyword}
        onChange={(e) => onSearchKeywordChange(e.target.value)}
      />

      {/* 권한 필터 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleRoleDropdownToggle}
        >
          {roleFilter === "ALL" ? "권한: 모두" : roleFilter === "USER" ? "권한: 회원" : "권한: 관리자"}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isRoleDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRoleSelect('ALL')}
            >모두</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRoleSelect('USER')}
            >회원</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRoleSelect('ADMIN')}
            >관리자</li>
          </ul>
        )}
      </div>

      {/* 상태 필터 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleStatusDropdownToggle}
        >
          {statusFilter === "ALL" ? "상태: 모두" : statusFilter === "ACTIVE" ? "상태: 정상" : statusFilter === "SUSPENDED" ? "상태: 차단" : "상태: 탈퇴"}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isStatusDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStatusSelect('ALL')}
            >모두</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStatusSelect('ACTIVE')}
            >정상</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStatusSelect('SUSPENDED')}
            >차단</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStatusSelect('WITHDRAWN')}
            >탈퇴</li>
          </ul>
        )}
      </div>

      {/* 성별 필터 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleGenderDropdownToggle}
        >
          {genderFilter === "ALL" ? "성별: 전체" : genderFilter === "F" ? "성별: 여" : "성별: 남"}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isGenderDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleGenderSelect('ALL')}
            >모두</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleGenderSelect('F')}
            >여</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleGenderSelect('M')}
            >남</li>
          </ul>
        )}
      </div>

      {/* 가입일 정렬 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleJoinDateDropdownToggle}
        >
          {joinDateSort === "latest" ? "가입일: 최신순" : "가입일: 오래된순"}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isJoinDateDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleJoinDateSelect('latest')}
            >최신순</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleJoinDateSelect('oldest')}
            >오래된순</li>
          </ul>
        )}
      </div>

      {/* 삭제일 정렬 */}
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 border border-[#ddd] rounded px-3 py-2 text-sm bg-white hover:bg-gray-50"
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, minHeight: 42 }}
          onClick={handleDeleteDateDropdownToggle}
        >
          {deleteDateSort === "latest" ? "삭제일: 최신순" : "삭제일: 오래된순"}
          <ChevronDown className="w-4 h-4 text-[#777]" />
        </button>

        {isDeleteDateDropdownOpen && (
          <ul className="absolute z-10 mt-1 w-full border border-[#ddd] rounded bg-white text-sm shadow">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleDeleteDateSelect('latest')}
            >최신순</li>
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleDeleteDateSelect('oldest')}
            >오래된순</li>
          </ul>
        )}
      </div>
    </div>
  );
} 