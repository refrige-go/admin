import { ChevronLeft, ChevronRight } from 'lucide-react'

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