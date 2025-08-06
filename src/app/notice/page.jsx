"use client";

import { useState, useEffect } from "react";
import { DataTable, FilterPanel } from "@/components/ui";
import { noticeAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

const noticeCategoryOptions = [
  { value: "", label: "전체" },
  { value: "ANNOUNCEMENT", label: "공지" },
  { value: "MAINTENANCE", label: "점검" },
];

const sortOrderOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

const filterConfig = [
  {
    type: "select",
    key: "category",
    placeholder: "전체",
    options: noticeCategoryOptions,
  },
  { type: "search", key: "title", placeholder: "게시물 제목" },
  {
    type: "select",
    key: "sortOrder",
    placeholder: "최신순",
    options: sortOrderOptions,
  },
  { type: "empty" },
  { type: "empty" },
];

export default function NoticePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ category: "", title: "", sortOrder: "latest" });
  const [noticeList, setNoticeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await noticeAPI.getNotices();
        setNoticeList(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("공지사항 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // 필터링 (프론트에서)
  let filteredData = noticeList.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.title && !(item.title || "").toLowerCase().includes(filters.title.toLowerCase())) return false;
    return true;
  });

  // 정렬 (최신순/오래된순)
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
    { header: "카테고리", key: "category", render: (v) => v === "ANNOUNCEMENT" ? "공지" : v === "MAINTENANCE" ? "점검" : "-" },
    { header: "제목", key: "title" },
    { header: "작성자", key: "adminNickname" },
    {
      header: "등록일",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toISOString().slice(0, 10) : "-"),
    },
  ];

  const handleRowAction = (row) => {
    router.push(`/notice/${row.id}`);
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#000000]">공지사항</h2>
                  <button
                    onClick={() => router.push("/notice/create")}
                    className="bg-[#f9bf52] hover:bg-[#e6a94a] text-[#2d1b0a] rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                  >
                    등록
                  </button>
                </div>
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