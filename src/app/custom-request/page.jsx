"use client"

import { useState, useEffect, useMemo } from "react"
import { DataTable } from "@/components/ui"
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/Dropdown";
import ChevronDown from "@/components/ui/ChevronDown";
import { customRequestAPI } from "@/lib/api";

// 보류 사유 목록
const HOLD_REASONS = [
  "강아지 사진이 아닙니다. 업로드된 사진은 강아지와 관련된 이미지가 아닌 것으로 확인되었습니다.",
  "사진 해상도가 너무 낮습니다. 고화질 이미지를 제공해 주세요. 해상도가 너무 낮으면 정확한 처리가 어렵습니다.",
  "서비스 이용 정책에 위반되는 이미지입니다. 등록하신 이미지가 서비스 안내문 또는 이용 정책에 어긋납니다.",
  "부적절한 콘텐츠가 포함되어 있습니다. 폭력적이거나 선정적, 혐오 표현 등이 포함된 이미지로 확인되어 등록이 제한됩니다.",
  "기술적인 문제로 인해 이미지 처리가 불가능합니다. 업로드 과정에서 오류가 발생했거나, 이미지 파일이 손상되어 확인이 어렵습니다."
];

/**
 * 커스텀 요청 관리 페이지
 * @returns {JSX.Element} 커스텀 요청 관리 페이지 컴포넌트
 */
export default function CustomRequestPage() {
  // 드롭다운 상태 관리
  const [statusFilter, setStatusFilter] = useState("PENDING")
  const [requestDateSort, setRequestDateSort] = useState("oldest")
  const [searchTerm, setSearchTerm] = useState("")

  // 데이터 상태 관리
  const [requestData, setRequestData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 상태 변경 팝업 관련 상태
  const [statusChangeModal, setStatusChangeModal] = useState({
    isOpen: false,
    requestId: null,
    dogName: ""
  })

  // 완료 상태 변경 팝업 관련 상태
  const [completedModal, setCompletedModal] = useState({
    isOpen: false,
    requestId: null,
    dogName: ""
  })

  // 백엔드에서 커스텀 요청 데이터 로드하는 함수
  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const requests = await customRequestAPI.getAllCustomRequests()
      console.log('백엔드에서 받은 커스텀 요청 데이터:', requests)
      requests?.forEach((req, index) => {
        console.log(`요청 ${index + 1}:`, {
          id: req.id,
          status: req.status,
          adminNickname: req.adminNickname,
          dogName: req.dogName,
          adminId: req.adminId,
          ownerNickname: req.ownerNickname,
          createdAt: req.createdAt,
          startedAt: req.startedAt,
          completedAt: req.completedAt,
          canceledAt: req.canceledAt
        })

        // adminId가 있지만 adminNickname이 null인 경우 확인
        if (req.adminId && !req.adminNickname) {
          console.warn(`⚠️ 요청 ID ${req.id}: adminId=${req.adminId}이지만 adminNickname이 null입니다.`)
        }
      })
      setRequestData(requests || [])
    } catch (err) {
      console.error('커스텀 요청 데이터 로드 실패:', err)
      setError('커스텀 요청 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 백엔드에서 커스텀 요청 데이터 로드
  useEffect(() => {
    fetchRequests()
  }, [])

  // 필터링/정렬된 데이터를 useMemo로 계산
  const filteredData = useMemo(() => {
    let filtered = [...requestData]

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(r =>
        (r.dogName && r.dogName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.ownerNickname && r.ownerNickname.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 상태 필터링
    if (statusFilter !== "ALL") {
      console.log('필터링 전 데이터:', filtered.length, '개')
      filtered = filtered.filter(r => {
        console.log('데이터 status:', r.status, '필터:', statusFilter, '일치:', r.status === statusFilter)
        return r.status === statusFilter
      })
      console.log('필터링 후 데이터:', filtered.length, '개')
    }

    // 정렬
    if (requestDateSort === "latest") {
      filtered = filtered.sort((a, b) => {
        const dateA = a.createdAt || ''
        const dateB = b.createdAt || ''
        return dateB.localeCompare(dateA)
      })
    } else {
      filtered = filtered.sort((a, b) => {
        const dateA = a.createdAt || ''
        const dateB = b.createdAt || ''
        return dateA.localeCompare(dateB)
      })
    }

    return filtered
  }, [requestData, searchTerm, statusFilter, requestDateSort])

  // 상태 변경 처리
  const handleStatusChange = async (requestId, newStatus, reason = null, imageFile = null) => {
    try {
      // 임시로 adminId를 4로 설정 (실제로는 로그인된 관리자 ID를 사용해야 함)
      const adminId = 4;

      console.log(`요청 ${requestId}의 상태를 ${newStatus}로 변경`)

      let response;
      switch (newStatus) {
        case 'IN_PROGRESS':
          // 테스트용 API 사용
          response = await customRequestAPI.testUpdateStatusToInProgress(requestId, adminId);
          break;
        case 'HOLD':
          // 테스트용 API 사용
          response = await customRequestAPI.testUpdateStatusToHold(requestId, adminId, reason);
          break;
        case 'COMPLETED':
          console.log('완료 상태 변경 API 호출 - requestId:', requestId, 'adminId:', adminId, 'imageFile:', imageFile);
          response = await customRequestAPI.updateStatusToCompleted(requestId, adminId, imageFile);
          break;
        case 'CANCELLED':
          response = await customRequestAPI.updateStatusToCanceled(requestId, adminId);
          break;
        default:
          throw new Error(`지원하지 않는 상태: ${newStatus}`);
      }

      console.log('상태 변경 성공:', response);

      // 테스트용 API의 경우 응답 확인
      if (response instanceof Response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('테스트 API 응답 상태:', response.status);
      }

      // 성공 시 데이터 다시 로드
      await fetchRequests();

      alert(`요청 상태가 ${newStatus}로 변경되었습니다.`)
    } catch (error) {
      console.error('상태 변경 실패:', error)
      alert('상태 변경에 실패했습니다.')
      throw error
    }
  }

  // 상태 변경 팝업 열기
  const openStatusChangeModal = (requestId, dogName) => {
    setStatusChangeModal({
      isOpen: true,
      requestId,
      dogName
    })
  }

  // 상태 변경 팝업 닫기
  const closeStatusChangeModal = () => {
    setStatusChangeModal({
      isOpen: false,
      requestId: null,
      dogName: ""
    })
  }

  // 완료 상태 변경 팝업 열기
  const openCompletedModal = (requestId, dogName) => {
    setCompletedModal({
      isOpen: true,
      requestId,
      dogName
    })
  }

  // 완료 상태 변경 팝업 닫기
  const closeCompletedModal = () => {
    setCompletedModal({
      isOpen: false,
      requestId: null,
      dogName: ""
    })
  }

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#000000] mb-6">커스텀 요청</h2>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#000000] mb-6">커스텀 요청</h2>
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">오류 발생</div>
              <div className="text-gray-600">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 상태별 컬럼 정의
  const getColumnsByStatus = (status) => {
    const baseColumns = [
      { header: "요청ID", key: "id" },
      { header: "반려견 이름", key: "dogName" },
      { header: "주인 닉네임", key: "ownerNickname" },
      {
        header: "상태",
        key: "status",
        render: (v) => {
          switch (v) {
            case "PENDING":
              return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">대기중</span>
            case "IN_PROGRESS":
              return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">진행중</span>
            case "HOLD":
              return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">보류</span>
            case "COMPLETED":
              return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">완료됨</span>
            case "CANCELLED":
              return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">취소됨</span>
            default:
              return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{v}</span>
          }
        },
      },
      {
        header: "요청일",
        key: "createdAt",
        render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
      },
    ]

    switch (status) {
      case "PENDING":
        return [
          ...baseColumns,
          {
            header: "요청상태 변경",
            key: "statusChange",
            render: (v, row) => (
              <button
                onClick={() => openStatusChangeModal(row.id, row.dogName)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            ),
          },
        ]

      case "IN_PROGRESS":
        return [
          ...baseColumns,
          {
            header: "시작일",
            key: "startedAt",
            render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
          },
          {
            header: "담당자",
            key: "adminNickname",
            render: (v, row) => {
              if (v) return v;
              // adminId는 있지만 adminNickname이 없는 경우
              if (row.adminId) {
                return "삭제된 사용자";
              }
              return "미정";
            },
          },
          {
            header: "액션",
            key: "actions",
            render: (_, row) => (
              <button
                onClick={() => openCompletedModal(row.id, row.dogName)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                완료처리
              </button>
            ),
          },
        ]

      case "COMPLETED":
        return [
          ...baseColumns,
          {
            header: "완료일",
            key: "completedAt",
            render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
          },
          {
            header: "담당자",
            key: "adminNickname",
            render: (v, row) => {
              if (v) return v;
              // adminId는 있지만 adminNickname이 없는 경우
              if (row.adminId) {
                return "삭제된 사용자";
              }
              return "미정";
            },
          },
        ]

      case "HOLD":
        return [
          ...baseColumns,
          {
            header: "보류일",
            key: "holdCreatedAt",
            render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
          },
          {
            header: "담당자",
            key: "adminNickname",
            render: (v, row) => {
              if (v) return v;
              // adminId는 있지만 adminNickname이 없는 경우
              if (row.adminId) {
                return "삭제된 사용자";
              }
              return "미정";
            },
          },
        ]

      case "CANCELLED":
        return [
          ...baseColumns,
          {
            header: "취소일",
            key: "canceledAt",
            render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
          },
          {
            header: "담당자",
            key: "adminNickname",
            render: (v, row) => {
              if (v) return v;
              // adminId는 있지만 adminNickname이 없는 경우
              if (row.adminId) {
                return "삭제된 사용자";
              }
              return "미정";
            },
          },
        ]

      default:
        return baseColumns
    }
  }

  const columns = getColumnsByStatus(statusFilter)

  const handleRowAction = (row) => {
    // 상세 페이지로 이동
    window.location.href = `/custom-request/${row.id}`
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#000000] mb-6">커스텀 요청</h2>

          {/* 검색창 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="반려견 이름 또는 주인 닉네임으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Dropdown value={statusFilter} onValueChange={(value) => {
                console.log('드롭다운 값 변경:', value)
                console.log('이전 statusFilter:', statusFilter)
                setStatusFilter(value)
                console.log('새로운 statusFilter 설정됨:', value)
              }}>
                <DropdownTrigger className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    {statusFilter === "ALL" ? "모든 상태" :
                      statusFilter === "PENDING" ? "대기중" :
                        statusFilter === "IN_PROGRESS" ? "진행중" :
                          statusFilter === "HOLD" ? "보류" :
                            statusFilter === "COMPLETED" ? "완료됨" :
                              statusFilter === "CANCELLED" ? "취소됨" : "상태 선택"}
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="ALL">모든 상태</DropdownItem>
                  <DropdownItem value="PENDING">대기중</DropdownItem>
                  <DropdownItem value="IN_PROGRESS">진행중</DropdownItem>
                  <DropdownItem value="HOLD">보류</DropdownItem>
                  <DropdownItem value="COMPLETED">완료됨</DropdownItem>
                  <DropdownItem value="CANCELLED">취소됨</DropdownItem>
                </DropdownContent>
              </Dropdown>
              <Dropdown value={requestDateSort} onValueChange={setRequestDateSort}>
                <DropdownTrigger className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    {requestDateSort === "latest" ? "최신순" : "오래된순"}
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="latest">최신순</DropdownItem>
                  <DropdownItem value="oldest">오래된순</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            onRowAction={handleRowAction}
          />
        </div>
      </div>

      {/* 상태 변경 팝업 */}
      <StatusChangeModal
        isOpen={statusChangeModal.isOpen}
        onClose={closeStatusChangeModal}
        requestId={statusChangeModal.requestId}
        dogName={statusChangeModal.dogName}
        onStatusChange={handleStatusChange}
      />

      {/* 완료 상태 변경 팝업 */}
      <CompletedStatusModal
        isOpen={completedModal.isOpen}
        onClose={closeCompletedModal}
        requestId={completedModal.requestId}
        dogName={completedModal.dogName}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

// 완료 상태 변경 팝업 컴포넌트
function CompletedStatusModal({ isOpen, onClose, requestId, dogName, onStatusChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!imageFile) {
      alert('렌더링 이미지를 선택해주세요.')
      return
    }

    console.log('이미지 파일 정보:', {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    })

    setIsLoading(true)
    try {
      const adminId = 4 // 임시로 설정
      console.log('완료 처리 시작 - requestId:', requestId, 'adminId:', adminId, 'imageFile:', imageFile)
      await onStatusChange(requestId, 'COMPLETED', null, imageFile)
      onClose()
      setImageFile(null)
    } catch (error) {
      console.error('완료 처리 실패:', error)
      alert('완료 처리에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setImageFile(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">완료 처리</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">반려견: <span className="font-semibold">{dogName}</span></p>
          <p className="text-gray-600">요청 ID: <span className="font-semibold">{requestId}</span></p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              렌더링 이미지
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !imageFile}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '완료 처리'}
            </button>

            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 상태 변경 팝업 컴포넌트
function StatusChangeModal({ isOpen, onClose, requestId, dogName, onStatusChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedHoldReason, setSelectedHoldReason] = useState("")
  const [showHoldReasonInput, setShowHoldReasonInput] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true)
    try {
      console.log(`요청 ID ${requestId}의 상태를 ${newStatus}로 변경`)

      if (newStatus === 'HOLD') {
        if (!selectedHoldReason) {
          alert('보류 사유를 선택해주세요.');
          setIsLoading(false);
          return;
        }
        await onStatusChange(requestId, newStatus, selectedHoldReason);
      } else {
        await onStatusChange(requestId, newStatus);
      }

      onClose()
      setSelectedHoldReason("")
      setShowHoldReasonInput(false)
    } catch (error) {
      console.error('상태 변경 실패:', error)
      alert('상태 변경에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHoldClick = () => {
    setShowHoldReasonInput(true)
  }

  const handleClose = () => {
    onClose()
    setSelectedHoldReason("")
    setShowHoldReasonInput(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">요청 상태 변경</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">반려견: <span className="font-semibold">{dogName}</span></p>
          <p className="text-gray-600">요청 ID: <span className="font-semibold">{requestId}</span></p>
        </div>

        {!showHoldReasonInput ? (
          <div className="space-y-3">
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '진행'}
            </button>

            <button
              onClick={handleHoldClick}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '보류'}
            </button>

            <button
              onClick={() => handleStatusChange('CANCELLED')}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : '취소'}
            </button>

            <button
              onClick={handleClose}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              뒤로가기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보류 사유 선택
              </label>
              <Dropdown value={selectedHoldReason} onValueChange={setSelectedHoldReason}>
                <DropdownTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                  <span className="flex items-center justify-between">
                    <span className="truncate flex-1 text-left">
                      {selectedHoldReason ? selectedHoldReason.substring(0, 50) + "..." : "보류 사유를 선택해주세요..."}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </span>
                </DropdownTrigger>
                <DropdownContent className="w-full max-h-60 overflow-y-auto z-50">
                  {HOLD_REASONS.map((reason, index) => (
                    <DropdownItem key={index} value={reason} className="whitespace-normal text-sm p-3">
                      {reason}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('HOLD')}
                disabled={isLoading || !selectedHoldReason}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '처리 중...' : '보류 처리'}
              </button>

              <button
                onClick={() => setShowHoldReasonInput(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 