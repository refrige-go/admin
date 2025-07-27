"use client"

import { Search } from "lucide-react"

/**
 * 재사용 가능한 필터 패널 컴포넌트
 * @param {Object} props
 * @param {Array} props.filters - 필터 정의 배열
 * @param {Object} props.values - 현재 필터 값들
 * @param {Function} props.onChange - 필터 변경 핸들러
 * @param {Array} props.checkboxes - 체크박스 필터들
 */
export default function FilterPanel({ 
  searchTerm,
  onSearchChange,
  searchPlaceholder, 
  filters = [],
  values, onChange, checkboxes = [] 
}) {
  const handleInputChange = (key, value) => {
    if (onChange) {
      onChange({ ...values, [key]: value })
    } else if (key === 'search' && onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleCheckboxChange = (key, checked) => {
    if (onChange) {
      onChange({ ...values, [key]: checked })
    }
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      {searchTerm !== undefined && (
        <div className="relative">
          <input 
            placeholder={searchPlaceholder || "검색..."}
            value={searchTerm || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pr-10 px-3 py-2 border border-[#dfe1e3] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bfc5c8]" />
        </div>
      )}

      {/* Main Filters */}
      <div className="grid grid-cols-5 gap-4">
        {filters.map((filter, index) => (
          <div key={index} className="relative">
            {filter.type === 'search' ? (
              <>
                <input 
                  placeholder={filter.placeholder}
                  value={values[filter.key] || ''}
                  onChange={(e) => handleInputChange(filter.key, e.target.value)}
                  className="w-full pr-10 px-3 py-2 border border-[#dfe1e3] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#bfc5c8]" />
              </>
            ) : filter.type === 'select' ? (
              <select 
                value={values[filter.key] || ''}
                onChange={(e) => handleInputChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-[#dfe1e3] rounded-md focus:border-[#0078d2] focus:ring-[#0078d2] focus:outline-none"
              >
                <option value="">{filter.placeholder}</option>
                {filter.options?.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : filter.type === 'empty' ? (
              <div className="h-10"></div> // 빈 공간 유지
            ) : null}
          </div>
        ))}
      </div>

      {/* Checkbox Filters */}
      {checkboxes.length > 0 && (
        <div className="flex items-center gap-4">
          {checkboxes.map((checkbox, index) => (
            <div key={index} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id={checkbox.key}
                checked={values[checkbox.key] || false}
                onChange={(e) => handleCheckboxChange(checkbox.key, e.target.checked)}
                className="w-4 h-4 text-[#0078d2] border-[#dfe1e3] rounded focus:ring-[#0078d2]" 
              />
              <label htmlFor={checkbox.key} className="text-sm text-[#979797]">
                {checkbox.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 