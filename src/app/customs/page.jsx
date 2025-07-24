"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui";
import StatusButton from "@/components/ui/StatusButton";
import { customsAPI } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import { Pagination } from "@/components/features/Pagination";
import { useRouter } from "next/navigation";

const customStatusLabel = {
  PENDING: "대기",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  HOLD: "보류",
  CANCELED: "취소",
};

const customStatusOptions = [
  { value: "ALL", label: "전체" },
  { value: "PENDING", label: "대기" },
  { value: "IN_PROGRESS", label: "진행중" },
  { value: "COMPLETED", label: "완료" },
  { value: "HOLD", label: "보류" },
  { value: "CANCELED", label: "취소" },
];

export default function CustomsPage() {
  const router = useRouter();
  const [customPage, setCustomPage] = useState(null); // Page 객체 전체 저장
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [adminSearch, setAdminSearch] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCustoms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 백엔드 API가 page=0부터 시작하므로 -1
        const data = await customsAPI.getCustoms({ page: currentPage - 1, size: itemsPerPage });
        setCustomPage(data);
      } catch (err) {
        setError("커스텀 요청 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustoms();
  }, [currentPage]);

  const tableData = (customPage?.content || []).filter(item => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (adminSearch && !(item.adminNickname || "").toLowerCase().includes(adminSearch.toLowerCase())) return false;
    return true;
  });
  const totalPages = customPage?.totalPages || 1;

  const handleRowAction = (row) => {
    router.push(`/customs/${row.id}`);
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "반려견 이름", key: "dogName" },
    { header: "주인 닉네임", key: "ownerNickname" },
    { header: "담당자", key: "adminNickname" },
    {
      header: "상태",
      key: "status",
      render: (v) => (
        <StatusButton label={customStatusLabel[v] || v} type="customStatus" status={v} />
      ),
    },
    {
      header: "요청일",
      key: "createdAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "작업시작일",
      key: "startedAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "보류일",
      key: "holdCreatedAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "완료일",
      key: "completedAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "취소일",
      key: "canceledAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
  ];

  if (isLoading) {
    return (
      <PageContainer title="커스텀 요청 정보">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
          <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderTop: '4px solid #2563eb', borderRadius: '50%', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
          <span style={{ marginTop: 8, color: '#4b5563' }}>데이터를 불러오는 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="커스텀 요청 정보">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
          <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer' }}>다시 시도</button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="커스텀 요청 정보"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
    <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, color: '#979797' }}
      >
        {customStatusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="담당자 검색"
        value={adminSearch}
        onChange={e => setAdminSearch(e.target.value)}
        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, color: '#979797' }}
      />
    </div>
    <DataTable columns={columns} data={tableData} onRowAction={handleRowAction} />
    </PageContainer>
  );
} 