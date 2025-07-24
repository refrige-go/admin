"use client";


import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui";
import StatusButton from "@/components/ui/StatusButton";
import { dogsAPI } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import { Pagination } from "@/components/features/Pagination";
import { useRouter } from "next/navigation";

const dogStatusLabel = {
  REGISTERED: "요청",
  APPROVED: "승인",
  SUSPENDED: "중지",
  REMOVED: "삭제"
};

const dogStatusOptions = [
  { value: "ALL", label: "상태(전체)" },
  { value: "REGISTERED", label: "요청" },
  { value: "APPROVED", label: "승인" },
  { value: "SUSPENDED", label: "중지" },
  { value: "REMOVED", label: "삭제" },
];

export default function DogsPage() {
  const router = useRouter();
  const [dogData, setDogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameSearch, setNameSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dogs = await dogsAPI.getDogs();
        setDogData(dogs || []);
      } catch (err) {
        setError("반려견 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDogs();
  }, []);

  const filteredData = useMemo(() => {
    return dogData.filter(item => {
      if (nameSearch && !(item.name || "").toLowerCase().includes(nameSearch.toLowerCase())) return false;
      if (ownerSearch && !(item.ownerNickname || "").toLowerCase().includes(ownerSearch.toLowerCase())) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      return true;
    });
  }, [dogData, nameSearch, ownerSearch, statusFilter]);

  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleRowAction = (row) => {
    router.push(`/dogs/${row.id}`);
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "이름", key: "name" },
    { header: "주인 닉네임", key: "ownerNickname" },
    {
      header: "상태",
      key: "status",
      render: (v) => (
        <StatusButton label={dogStatusLabel[v] || v} type="dogStatus" status={v} />
      ),
    },
    {
      header: "등록일",
      key: "createdAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "삭제일",
      key: "deletedAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
  ];

  if (isLoading) {
    return (
      <PageContainer title="반려견 정보">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
          <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderTop: '4px solid #2563eb', borderRadius: '50%', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
          <span style={{ marginTop: 8, color: '#4b5563' }}>데이터를 불러오는 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="반려견 정보">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
          <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer' }}>다시 시도</button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="반려견 정보"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="강아지 이름 검색"
          value={nameSearch}
          onChange={e => setNameSearch(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, color: '#979797' }}
        />
        <input
          type="text"
          placeholder="주인 닉네임 검색"
          value={ownerSearch}
          onChange={e => setOwnerSearch(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, color: '#979797' }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 120, color: '#979797' }}
        >
          {dogStatusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <DataTable columns={columns} data={paginatedData} onRowAction={handleRowAction} />
    </PageContainer>
  );
} 