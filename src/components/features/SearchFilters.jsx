import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Search } from 'lucide-react'

/**
 * 검색 필터 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.filters - 현재 필터 값들
 * @param {Function} props.onFilterChange - 필터 변경 핸들러
 * @returns {JSX.Element} SearchFilters 컴포넌트
 */
export function SearchFilters({ filters = {}, onFilterChange = () => {} }) {
  const handleInputChange = (field) => (e) => {
    onFilterChange({
      ...filters,
      [field]: e.target.value
    })
  }

  const handleSelectChange = (field) => (e) => {
    onFilterChange({
      ...filters,
      [field]: e.target.value
    })
  }

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="relative">
        <Input 
          placeholder="이메일" 
          className="pr-10 border-[#dfe1e3] focus:border-[#0078d2] focus:ring-[#0078d2]"
          value={filters.email || ''}
          onChange={handleInputChange('email')}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bfc5c8]" />
      </div>
      
      <div className="relative">
        <Input 
          placeholder="닉네임" 
          className="pr-10 border-[#dfe1e3] focus:border-[#0078d2] focus:ring-[#0078d2]"
          value={filters.nickname || ''}
          onChange={handleInputChange('nickname')}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bfc5c8]" />
      </div>
      
      <Select 
        className="border-[#dfe1e3] focus:border-[#0078d2] focus:ring-[#0078d2]"
        value={filters.sortOrder || ''}
        onChange={handleSelectChange('sortOrder')}
      >
        <option value="">정렬</option>
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
      </Select>
      
      <Select 
        className="border-[#dfe1e3] focus:border-[#0078d2] focus:ring-[#0078d2]"
        value={filters.permission || ''}
        onChange={handleSelectChange('permission')}
      >
        <option value="">권한</option>
        <option value="member">회원</option>
        <option value="admin">관리자</option>
      </Select>
      
      <Select 
        className="border-[#dfe1e3] focus:border-[#0078d2] focus:ring-[#0078d2]"
        value={filters.status || ''}
        onChange={handleSelectChange('status')}
      >
        <option value="">상태</option>
        <option value="active">활성화</option>
        <option value="inactive">비활성화</option>
      </Select>
    </div>
  )
} 