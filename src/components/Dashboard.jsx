'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/Card'
import { SearchFilters } from './features/SearchFilters'
import { MemberTable } from './features/MemberTable'
import { Pagination } from './features/Pagination'
import { useFetch } from '../hooks/useFetch'

/**
 * 대시보드 컴포넌트 (TogeDaeng 스타일)
 * @returns {JSX.Element} Dashboard 컴포넌트
 */
function Dashboard() {
  const [filters, setFilters] = useState({
    email: '',
    nickname: '',
    sortOrder: '',
    permission: '',
    status: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMembers, setFilteredMembers] = useState([])

  // 임시 회원 데이터 (실제로는 API에서 가져올 데이터)
  const memberData = [
    {
      id: 1,
      email: "dansunmusik7@gmail.com",
      nickname: "서진",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "활성화",
    },
    {
      id: 2,
      email: "gaeunyjragogo@gmail.com",
      nickname: "가은",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "관리자",
      status: "활성화",
    },
    {
      id: 3,
      email: "nanunyunjiya@gmail.com",
      nickname: "윤지",
      gender: "여",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "비활성화",
    },
    {
      id: 4,
      email: "dangwoo@gmail.com",
      nickname: "당우",
      gender: "남",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "활성화",
    },
    {
      id: 5,
      email: "dangdang@gmail.com",
      nickname: "당당",
      gender: "남",
      joinDate: "2025-01-01",
      permission: "회원",
      status: "비활성화",
    },
  ]

  // 필터링 로직
  useEffect(() => {
    let filtered = memberData.filter(member => {
      const emailMatch = !filters.email || member.email.toLowerCase().includes(filters.email.toLowerCase())
      const nicknameMatch = !filters.nickname || member.nickname.toLowerCase().includes(filters.nickname.toLowerCase())
      const permissionMatch = !filters.permission || member.permission === filters.permission
      const statusMatch = !filters.status || 
        (filters.status === 'active' && member.status === '활성화') ||
        (filters.status === 'inactive' && member.status === '비활성화')

      return emailMatch && nicknameMatch && permissionMatch && statusMatch
    })

    // 정렬 적용
    if (filters.sortOrder === 'latest') {
      filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    } else if (filters.sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate))
    }

    setFilteredMembers(filtered)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleViewDetail = (member) => {
    console.log('회원 상세 정보:', member)
    // 실제로는 상세 페이지로 이동하거나 모달을 열 것
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 페이지네이션 계산
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-[#e2e9ef] p-6">
      <Card className="bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#000000] mb-6">
            회원정보 ({filteredMembers.length}명)
          </h2>

          <SearchFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <MemberTable 
            members={currentMembers}
            onViewDetail={handleViewDetail}
          />

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard; 