import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

/**
 * 페이지네이션 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {number} props.currentPage - 현재 페이지
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @returns {JSX.Element} Pagination 컴포넌트
 */
export function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {} 
}) {
  const [inputPage, setInputPage] = useState('')

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // 숫자만 입력 가능
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value)
    }
  }

  const handleInputSubmit = (e) => {
    e.preventDefault()
    const pageNum = parseInt(inputPage)
    
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum)
      setInputPage('') // 입력값 초기화
    } else {
      alert(`1부터 ${totalPages}까지의 페이지 번호를 입력해주세요.`)
    }
  }  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit(e)
    }
  }  

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button 
        className="p-2 text-[#979797] hover:text-[#404040] transition-colors disabled:opacity-50"
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <span className="text-[#404040] text-sm">
        {currentPage} / {totalPages}
      </span>

      {/* 페이지 번호 직접 입력 */}
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="페이지"
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleInputSubmit}
          className="px-3 py-1 text-xs bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-colors font-medium shadow-sm"
        >
          이동
        </button>
      </div>

      <button 
        className="p-2 text-[#979797] hover:text-[#404040] transition-colors disabled:opacity-50"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
} 