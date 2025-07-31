/* 사용자 관리 페이지 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui";
import { useRouter } from "next/navigation";
import StatusButton from "@/components/ui/StatusButton";
import styles from "@/assets/css/UserPage.module.css";
import UserFilters from "@/components/ui/UserFilters";
import PageContainer from "@/components/ui/PageContainer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders } from "@/lib/api";
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [joinDateSort, setJoinDateSort] = useState("latest");
  const [deleteDateSort, setDeleteDateSort] = useState("latest");

  const [searchField, setSearchField] = useState("username");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        //백엔드 API 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
          headers: getAuthHeaders(), // ← 인증 헤더 추가
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log('백엔드에서 받은 데이터:', users);
        setMemberData(users || []);
      } catch (err) {
        console.error("사용자 데이터 로드 실패:", err);
        setError("사용자 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = [...memberData];

    // 권한 필터링
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // 상태 필터링 (deleted 필드 기반)
    if (statusFilter !== "ALL") {
      if (statusFilter === "ACTIVE") {
        filtered = filtered.filter(user => !user.deleted);
      } else if (statusFilter === "WITHDRAWN") {
        filtered = filtered.filter(user => user.deleted);
      }
    }

    // 검색 필터링

    if (searchKeyword) {
      filtered = filtered.filter(user => {
        let searchValue = "";
        
        if (searchField === "username") {
          // 아이디 검색 - username 필드 사용
          searchValue = user.username?.toString().toLowerCase() || "";
        } else if (searchField === "nickname") {
          // 닉네임 검색 - nickname 필드 사용
          searchValue = user.nickname?.toString().toLowerCase() || "";
        }
        
        return searchValue.includes(searchKeyword.toLowerCase());
      });
    }

    // 정렬 로직 개선
    const sorted = [...filtered].sort((a, b) => {
      // 탈퇴 상태일 때는 삭제일을 우선 정렬
      if (statusFilter === "WITHDRAWN") {
        const aDeletedAt = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
        const bDeletedAt = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
        
        if (deleteDateSort === "latest") {
          return bDeletedAt - aDeletedAt;
        } else {
          return aDeletedAt - bDeletedAt;
        }
      }
      
      // 일반 상태일 때는 가입일 정렬
      const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      if (joinDateSort === "latest") {
        return bCreatedAt - aCreatedAt;
      } else {
        return aCreatedAt - bCreatedAt;
      }
    });

    return sorted;
  }, [memberData, roleFilter, statusFilter, joinDateSort, deleteDateSort, searchField, searchKeyword]);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowAction = (row) => {
    router.push(`/users/${row.id}`);
  };

  // 권한 표시 함수
  const getRoleLabel = (role) => {
    // 현재 로그인한 사용자만 로그 출력
    if (currentUser && role === currentUser.role) {
      console.log('🔐 현재 로그인 사용자 권한:', role);
    }
    
    if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
      return '관리자';
    } else if (role === 'ROLE_USER' || role === 'USER') {
      return '회원';
    }
    return '회원';
  };

  const columns = [
    { header: "번호", key: "id" },
    { header: "닉네임", key: "nickname" },
    { header: "아이디", key: "username" },
    {
      header: "권한",
      key: "role",
      render: (v) => <StatusButton label={getRoleLabel(v)} type="role" status={v} />,
    },
    {
      header: "상태",
      key: "deleted",
       render: (v) => <StatusButton label={v ? '탈퇴' : '정상'} type="userStatus" status={v ? 'WITHDRAWN' : 'ACTIVE'} />,
    },
    {
      header: "가입일",
      key: "createdAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
    {
      header: "삭제일",
      key: "deletedAt",
      render: (v) => v ? new Date(v).toISOString().slice(0, 10) : "-",
    },
  ];

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
            {isLoading ? (
              <PageContainer title="회원정보">
                <div className={styles.usersLoading}>
                  <div className={styles.usersSpinner}></div>
                  <span className={styles.usersLoadingText}>데이터를 불러오는 중...</span>
                </div>
              </PageContainer>
            ) : error ? (
              <PageContainer title="회원정보">
                <div className={styles.usersError}>
                  <div className={styles.usersErrorMessage}>{error}</div>
                  <button onClick={() => window.location.reload()} className={styles.usersRetryButton}>다시 시도</button>
                </div>
              </PageContainer>
            ) : (
              <PageContainer title="회원정보"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              >
                <UserFilters
                  searchField={searchField}
                  searchKeyword={searchKeyword}
                  onSearchFieldChange={setSearchField}
                  onSearchKeywordChange={setSearchKeyword}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  joinDateSort={joinDateSort}
                  onJoinDateSortChange={setJoinDateSort}
                  deleteDateSort={deleteDateSort}
                  onDeleteDateSortChange={setDeleteDateSort}
                />
                <DataTable columns={columns} data={paginatedData} onRowAction={handleRowAction} />
              </PageContainer>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute> 
  );
}
