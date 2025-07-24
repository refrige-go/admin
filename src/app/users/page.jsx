"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui";
import { useRouter } from "next/navigation";
import { applyFilters } from "@/hooks/applyFilters";
import StatusButton from "@/components/ui/StatusButton";
import styles from "@/assets/css/UserPage.module.css";
import { usersAPI } from "@/lib/api";
import UserFilters from "@/components/ui/UserFilters";
import { Pagination } from "@/components/features/Pagination";
import PageContainer from "@/components/ui/PageContainer";

export default function UsersPage() {
  const router = useRouter();

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [joinDateSort, setJoinDateSort] = useState("latest");
  const [deleteDateSort, setDeleteDateSort] = useState("latest");

  const [searchField, setSearchField] = useState("email");
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
        const users = await usersAPI.getUsers();
        console.log(users);
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
    const filterState = {
      role: roleFilter === "ALL" ? "" : roleFilter,
      status: statusFilter === "ALL" ? "" : statusFilter,
      gender: genderFilter === "ALL" ? "" : genderFilter,
    };

    let filtered = applyFilters(memberData, filterState);

    if (searchKeyword) {
      filtered = filtered.filter(item => {
        const value = item[searchField]?.toLowerCase() || "";
        return value.includes(searchKeyword.toLowerCase());
      });
    }

    const sorted = [...filtered].sort((a, b) => {
    const joinCompare = joinDateSort === "latest"
      ? (b.createdAt || "").localeCompare(a.createdAt || "")
      : (a.createdAt || "").localeCompare(b.createdAt || "");

    const deleteCompare = deleteDateSort === "latest"
      ? (b.deletedAt || "").localeCompare(a.deletedAt || "")
      : (a.deletedAt || "").localeCompare(b.deletedAt || "");

    return joinCompare || deleteCompare;
  });

  return sorted;
  }, [memberData, roleFilter, statusFilter, genderFilter, joinDateSort, deleteDateSort, searchField, searchKeyword]);
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowAction = (row) => {
    router.push(`/users/${row.id}`);
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "닉네임", key: "nickname" },
    { header: "이메일", key: "email" },
    {
      header: "권한",
      key: "role",
      render: (v) => <StatusButton label={v === 'ADMIN' ? '관리자' : '회원'} type="role" status={v} />,
    },
    {
      header: "상태",
      key: "status",
      render: (v) => <StatusButton label={v === 'ACTIVE' ? '정상' : v === 'SUSPENDED' ? '차단' : '탈퇴'} type="userStatus" status={v} />,
    },
    {
      header: "성별",
      key: "gender",
      render: (v) => v === "F" ? "여" : "남",
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

  if (isLoading) {
    return (
      <PageContainer title="회원정보">
        <div className={styles.usersLoading}>
          <div className={styles.usersSpinner}></div>
          <span className={styles.usersLoadingText}>데이터를 불러오는 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="회원정보">
        <div className={styles.usersError}>
          <div className={styles.usersErrorMessage}>{error}</div>
          <button onClick={() => window.location.reload()} className={styles.usersRetryButton}>다시 시도</button>
        </div>
      </PageContainer>
    );
  }

  return (
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
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        joinDateSort={joinDateSort}
        onJoinDateSortChange={setJoinDateSort}
        deleteDateSort={deleteDateSort}
        onDeleteDateSortChange={setDeleteDateSort}
      />
      <DataTable columns={columns} data={paginatedData} onRowAction={handleRowAction} />
    </PageContainer>
  );
}
