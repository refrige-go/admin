"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { customRequestAPI, dogsAPI } from "@/lib/api"

/**
 * 커스텀 요청 상세 조회 페이지
 * @returns {JSX.Element} 커스텀 요청 상세 조회 페이지 컴포넌트
 */
export default function CustomRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customId = params.id

  // 상태 관리
  const [customRequest, setCustomRequest] = useState(null)
  const [dog, setDog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 커스텀 요청 + 강아지 정보 로드
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const req = await customRequestAPI.getCustomRequest(customId)
        setCustomRequest(req)
        if (req && req.dogId) {
          const dogData = await dogsAPI.getDog(req.dogId)
          setDog(dogData)
        }
      } catch (err) {
        console.error('커스텀 요청 상세 조회 실패:', err)
        setError('상세 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    if (customId) fetchAll()
  }, [customId])

  // 상태 텍스트 변환 함수
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'IN_PROGRESS':
        return '진행중'
      case 'HOLD':
        return '보류'
      case 'COMPLETED':
        return '완료'
      case 'CANCELLED':
        return '취소'
      default:
        return status
    }
  }

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'HOLD':
        return 'bg-orange-100 text-orange-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 날짜 포맷팅 함수
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-'
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">커스텀 요청 상세</h2>
                  <p className="text-gray-500 text-sm mt-1">로딩 중...</p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← 뒤로가기
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4"></div>
                  <span className="text-gray-600">데이터를 불러오는 중...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">커스텀 요청 상세</h2>
                  <p className="text-gray-500 text-sm mt-1">오류 발생</p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← 뒤로가기
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">오류 발생</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 데이터가 없을 때 표시
  if (!customRequest) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">커스텀 요청 상세</h2>
                  <p className="text-gray-500 text-sm mt-1">데이터 없음</p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ← 뒤로가기
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">커스텀 요청을 찾을 수 없습니다</h3>
                  <p className="text-gray-600 mb-6">요청하신 ID의 커스텀 요청이 존재하지 않습니다.</p>
                  <button
                    onClick={() => router.push('/custom-request')}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                  >
                    목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 헤더 */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">커스텀 요청 상세</h2>
                <p className="text-gray-500 text-sm mt-1">요청 ID: #{customRequest.id}</p>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← 뒤로가기
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* 상태 배지 */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(customRequest.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${customRequest.status === 'PENDING' ? 'bg-yellow-500' : customRequest.status === 'IN_PROGRESS' ? 'bg-blue-500' : customRequest.status === 'HOLD' ? 'bg-orange-500' : customRequest.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {getStatusText(customRequest.status)}
              </div>
            </div>

            {/* 요청 정보 (기본+시간) */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">요청 정보</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">요청자 이메일</span>
                  <span className="font-semibold text-gray-900">{customRequest.requesterEmail || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">요청자 닉네임</span>
                  <span className="font-semibold text-gray-900">{customRequest.requesterNickname || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">담당자</span>
                  <span className="font-semibold text-gray-900">{customRequest.adminNickname || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">요청일</span>
                  <span className="font-semibold text-gray-900">{formatDateTime(customRequest.createdAt)}</span>
                </div>
                {customRequest.startedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">시작일</span>
                    <span className="font-semibold text-gray-900">{formatDateTime(customRequest.startedAt)}</span>
                  </div>
                )}
                {customRequest.holdCreatedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">보류일</span>
                    <span className="font-semibold text-gray-900">{formatDateTime(customRequest.holdCreatedAt)}</span>
                  </div>
                )}
                {customRequest.completedAt && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">완료일</span>
                    <span className="font-semibold text-gray-900">{formatDateTime(customRequest.completedAt)}</span>
                  </div>
                )}
                {customRequest.canceledAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">취소일</span>
                    <span className="font-semibold text-gray-900">{formatDateTime(customRequest.canceledAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 보류 사유 */}
            {customRequest.status === 'HOLD' && customRequest.holdReason && (
              <div className="bg-orange-50 p-4 rounded-md border border-orange-200 mb-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">보류 사유</h3>
                <p className="text-orange-700">{customRequest.holdReason}</p>
              </div>
            )}

            {/* 강아지 정보 */}
            {dog && (
              <div className="bg-gray-50 p-4 rounded-md border border-blue-200 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">반려견 정보</h3>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 w-40 h-40 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {dog.renderedUrl ? (
                      <img src={dog.renderedUrl} alt="렌더링 이미지" className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-400">이미지 없음</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div><span className="font-medium text-gray-700">이름:</span> <span className="font-semibold text-gray-900">{dog.name}</span></div>
                    <div><span className="font-medium text-gray-700">성별:</span> <span className="text-gray-900">{dog.gender}</span></div>
                    <div><span className="font-medium text-gray-700">생년월일:</span> <span className="text-gray-900">{dog.birth || '-'}</span></div>
                    <div><span className="font-medium text-gray-700">성격:</span> <span className="text-gray-900">{dog.personalities?.join(', ') || '-'}</span></div>
                    <div><span className="font-medium text-gray-700">호칭:</span> <span className="text-gray-900">{dog.callNames?.join(', ') || '-'}</span></div>
                    <div><span className="font-medium text-gray-700">상태:</span> <span className="text-gray-900">{dog.status}</span></div>
                    <div><span className="font-medium text-gray-700">주인 닉네임:</span> <span className="text-gray-900">{dog.ownerNicknames?.join(', ') || '-'}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/custom-request')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                목록으로
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 