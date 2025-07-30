'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/Card'
import ProtectedRoute from "@/components/ProtectedRoute";

/**
 * 통계/분석 대시보드 컴포넌트
 * @returns {JSX.Element} Analytics Dashboard 컴포넌트
 */
function Dashboard() {
  // 통계 데이터 상태
  const [statsData, setStatsData] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    newUsersThisMonth: 45,
    totalIngredients: 320,
    monthlyGrowth: 12.5,
    popularCategories: ['채소', '육류', '해산물', '과일', '유제품'],
    userGrowthData: [120, 150, 180, 200, 250, 300],
    ingredientUsageData: [45, 52, 38, 67, 89, 76]
  })

  // 월별 데이터
  const monthlyData = [
    { month: '1월', users: 120, ingredients: 45 },
    { month: '2월', users: 150, ingredients: 52 },
    { month: '3월', users: 180, ingredients: 38 },
    { month: '4월', users: 200, ingredients: 67 },
    { month: '5월', users: 250, ingredients: 89 },
    { month: '6월', users: 300, ingredients: 76 }
  ]

  return (
    <ProtectedRoute> 
      <div className="min-h-screen bg-[#e2e9ef] p-6">
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[#000000] mb-6">
              통계/분석 대시보드
            </h2>

            {/* 주요 통계 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">총 회원수</h3>
                  <p className="text-2xl font-bold text-blue-800">{statsData.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">전월 대비 +{statsData.monthlyGrowth}%</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-green-600 mb-2">활성 회원</h3>
                  <p className="text-2xl font-bold text-green-800">{statsData.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">활성률 {(statsData.activeUsers/statsData.totalUsers*100).toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-orange-600 mb-2">이번 달 신규</h3>
                  <p className="text-2xl font-bold text-orange-800">{statsData.newUsersThisMonth}</p>
                  <p className="text-xs text-orange-600 mt-1">신규 가입자</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-purple-600 mb-2">총 식재료</h3>
                  <p className="text-2xl font-bold text-purple-800">{statsData.totalIngredients}</p>
                  <p className="text-xs text-purple-600 mt-1">등록된 식재료</p>
                </CardContent>
              </Card>
            </div>

            {/* 차트 영역 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 회원 성장 차트 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">회원 성장 추이</h3>
                  <div className="h-64 bg-gray-50 rounded flex items-end justify-between p-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 rounded-t w-8 mb-2"
                          style={{ height: `${(data.users / 300) * 200}px` }}
                        ></div>
                        <span className="text-xs text-gray-600">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 인기 카테고리 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">인기 식재료 카테고리</h3>
                  <div className="space-y-3">
                    {statsData.popularCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${80 - (index * 10)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{80 - (index * 10)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 추가 통계 정보 */}
            <div className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">월별 상세 통계</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">월</th>
                          <th className="text-left py-2">신규 회원</th>
                          <th className="text-left py-2">식재료 사용량</th>
                          <th className="text-left py-2">성장률</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((data, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{data.month}</td>
                            <td className="py-2">{data.users}</td>
                            <td className="py-2">{data.ingredients}</td>
                            <td className="py-2">
                              <span className="text-green-600">
                                +{index > 0 ? ((data.users - monthlyData[index-1].users) / monthlyData[index-1].users * 100).toFixed(1) : 0}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard;