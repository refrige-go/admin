"use client";

import { useState, useEffect } from "react";
import { DataTable, FilterPanel } from "@/components/ui";
import { inquiryAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

const categoryOptions = [
  { value: "", label: "전체" },
  { value: "BUG", label: "버그/오류" },
  { value: "ACCOUNT", label: "계정문의" },
  { value: "FEEDBACK", label: "피드백" },
  { value: "ETC", label: "기타" },
];

const statusOptions = [
  { value: "", label: "전체" },
  { value: "WAITING", label: "답변대기" },
  { value: "ANSWERED", label: "답변완료" },
];

const sortOrderOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

const filterConfig = [
  {
    type: "select",
    key: "category",
    placeholder: "카테고리",
    options: categoryOptions,
  },
  { type: "search", key: "author", placeholder: "작성자" },
  {
    type: "select",
    key: "status",
    placeholder: "처리상태",
    options: statusOptions,
  },
  {
    type: "select",
    key: "sortOrder",
    placeholder: "최신순",
    options: sortOrderOptions,
  },
  { type: "empty" },
];

function getStatusBadgeClass(status) {
  if (status === "WAITING") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200";
  if (status === "ANSWERED") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200";
}

function getStatusLabel(status) {
  if (status === "WAITING") return "답변대기";
  if (status === "ANSWERED") return "답변완료";
  return status;
}

function getCategoryLabel(category) {
  switch (category) {
    case "BUG": return "버그/오류";
    case "ACCOUNT": return "계정문의";
    case "FEEDBACK": return "피드백";
    case "ETC": return "기타";
    default: return category;
  }
}

export default function InquiryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ category: "", author: "", status: "", sortOrder: "latest" });
  const [inquiryList, setInquiryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await inquiryAPI.getInquiries();
        setInquiryList(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("문의 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  // 필터링
  let filteredData = inquiryList.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.author && !(item.authorNickname || "").toLowerCase().includes(filters.author.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    return true;
  });

  // 정렬
  filteredData = filteredData.sort((a, b) => {
    if (filters.sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    { header: "ID", key: "id" },
    { header: "카테고리", key: "category", render: (v) => getCategoryLabel(v) },
    { header: "제목", key: "title" },
    { header: "작성자", key: "authorNickname" },
    {
      header: "처리상태",
      key: "status",
      render: (v) => <span className={getStatusBadgeClass(v)}>{getStatusLabel(v)}</span>,
    },
    {
      header: "등록일",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toISOString().slice(0, 10) : "-"),
    },
  ];

  const handleRowAction = (row) => {
    router.push(`/inquiry/${row.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-[#e2e9ef]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#000000] mb-6">문의사항</h2>
                <FilterPanel filters={filterConfig} values={filters} onChange={handleFilterChange} />
                <DataTable
                  columns={columns}
                  data={pagedData}
                  onRowAction={handleRowAction}
                  loading={isLoading}
                  error={error}
                />
                <div className="flex justify-center mt-6">
                  <button
                    className="p-2 text-[#979797] hover:text-[#404040] transition-colors disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    이전
                  </button>
                  <span className="mx-4 text-[#404040] text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="p-2 text-[#979797] hover:text-[#404040] transition-colors disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 