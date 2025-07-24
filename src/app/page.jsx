"use client"

import { useState } from "react"
import { DataTable, FilterPanel } from "@/components/ui"

export default function HomePage() {
  const [filters, setFilters] = useState({
    email: '',
    nickname: '',
    sortOrder: '',
    permission: '',
    status: ''
  })

  const [currentPage, setCurrentPage] = useState(1)

  const memberData = [
    {
      email: "dansunmusik7@gmail.com",
      nickname: "서진",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "활성화",
    },
    {
      email: "gaeunyjragogo@gmail.com",
      nickname: "가은",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "관리자",
      status: "활성화",
    },
    {
      email: "nanunyunjiya@gmail.com",
      nickname: "윤지",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "비활성화",
    },
    {
      email: "dansunmusik7@gmail.com",
      nickname: "당우",
      gender: "남",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "활성화",
    },
    {
      email: "dansunmusik7@gmail.com",
      nickname: "당당",
      gender: "남",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "비활성화",
    },
  ]

  // 필터 정의
  const filterConfig = [
    { type: 'search', key: 'email', placeholder: '이메일' },
    { type: 'search', key: 'nickname', placeholder: '닉네임' },
    { 
      type: 'select', 
      key: 'sortOrder', 
      placeholder: '최신순',
      options: [
        { value: 'latest', label: '최신순' },
        { value: 'oldest', label: '오래된순' }
      ]
    },
    { 
      type: 'select', 
      key: 'permission', 
      placeholder: '권한',
      options: [
        { value: '회원', label: '회원' },
        { value: '관리자', label: '관리자' }
      ]
    },
    { 
      type: 'select', 
      key: 'status', 
      placeholder: '상태',
      options: [
        { value: '활성화', label: '활성화' },
        { value: '비활성화', label: '비활성화' }
      ]
    }
  ]

  // 테이블 컬럼 정의
  const columns = [
    { key: 'email', header: '이메일' },
    { key: 'nickname', header: '닉네임' },
    { key: 'gender', header: '성별' },
    { key: 'joinDate', header: '가입일' },
    { key: 'permission', header: '권한' },
    { key: 'status', header: '상태' }
  ]

  // 페이지네이션 계산
  const itemsPerPage = 10
  const totalPages = Math.ceil(memberData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = memberData.slice(startIndex, endIndex)

  const pagination = {
    currentPage,
    totalPages
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  const handleRowAction = (member) => {
    console.log('회원 상세 정보:', member)
    // 실제로는 상세 페이지로 이동하거나 모달을 열 것
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#000000] mb-6">회원정보</h2>

          <FilterPanel 
            filters={filterConfig}
            values={filters}
            onChange={handleFilterChange}
          />

          <DataTable 
            columns={columns}
            data={currentData}
            onRowAction={handleRowAction}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
} 