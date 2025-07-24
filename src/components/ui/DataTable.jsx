"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import React, { useState } from "react"

/**
 * 재사용 가능한 데이터 테이블 컴포넌트 (디자인/구조 커스텀, 내부 8개 row 페이지네이션)
 * @param {Object} props
 * @param {Array} props.columns - 테이블 컬럼 정의 (header: string|JSX, key: string, render?: (value, row) => ReactNode)
 * @param {Array} props.data - 테이블 데이터
 * @param {Function} props.onRowAction - 행 액션 핸들러 (row 클릭 시)
 * @param {string} [props.loadingText] - 로딩 텍스트
 * @param {string} [props.errorText] - 에러 텍스트
 */
export default function DataTable({ 
  columns, 
  data, 
  onRowAction,
  loadingText = "데이터를 불러오는 중...",
  errorText = "에러가 발생했습니다.",
  loading = false,
  error = null,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 8
  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / rowsPerPage))

  // 페이지 데이터 슬라이스
  const pagedData = data?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) || []

  // 페이지 이동
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#fcfcfc]">
            {columns.map((column, idx) => (
              <th key={idx} className="text-[#1d1b20] font-semibold py-3 px-4 text-left align-middle">
                {column.header}
              </th>
            ))}
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8">{loadingText}</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8 text-red-500">{errorText}</td>
            </tr>
          ) : pagedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-8">조건에 맞는 데이터가 없습니다.</td>
            </tr>
          ) : (
            pagedData.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className="hover:bg-[#fcfcfc] border-b border-[#dfe1e3]">
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className="py-3 px-4 text-[#000000] align-middle">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td className="py-3 px-4">
                  <button
                    onClick={() => onRowAction && onRowAction(row)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    title="자세히"
                  >
                    <Search className="w-4 h-4 text-[#404040]" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
} 