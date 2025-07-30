"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ingredientsAPI } from '@/lib/api';
import { Button, DataTable, FilterPanel } from '@/components/ui';       
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import ProtectedRoute from "@/components/ProtectedRoute";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  // 검색 전 페이지 번호를 저장
  const previousPageRef = useRef(1);
  const hasSearchedRef = useRef(false);

  // 데이터 로드
  useEffect(() => {
    loadIngredients();
    loadCategories();
  }, []);

  // 검색어가 변경될 때 처리
  useEffect(() => {
    if (searchTerm) {
      // 검색어가 있을 때
      if (!hasSearchedRef.current) {
        // 처음 검색하는 경우, 현재 페이지를 저장
        previousPageRef.current = currentPage;
        hasSearchedRef.current = true;
      }
      setCurrentPage(1); // 검색 결과는 1페이지부터
    } else {
      // 검색어가 없을 때 (검색어를 지웠을 때)
      if (hasSearchedRef.current) {
        // 이전에 검색했었다면 원래 페이지로 복원
        setCurrentPage(previousPageRef.current);
        hasSearchedRef.current = false;
      }
    }
  }, [searchTerm]);

  // 카테고리 필터 변경 시 1페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsAPI.getIngredients();
      setIngredients(data);
    } catch (error) {
      console.error('식재료 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await ingredientsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  // 삭제 처리
  const handleDelete = async (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await ingredientsAPI.deleteIngredient(id);
        loadIngredients(); // 목록 새로고침
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return ingredients.filter(ingredient => {
      const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || ingredient.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [ingredients, searchTerm, categoryFilter]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 테이블 컬럼 정의
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: '식재료명', sortable: true },
    { key: 'category', label: '카테고리', sortable: true },
    { key: 'defaultExpiryDays', label: '기본 유통기한', sortable: true },
    { key: 'storageMethod', label: '보관 방법', sortable: true },
    { key: 'actions', label: '작업', sortable: false }
  ];

  const renderRow = (ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category,
    defaultExpiryDays: `${ingredient.defaultExpiryDays}일`,
    storageMethod: ingredient.storageMethod || '-',
    actions: (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          router.push(`/ingredients/${ingredient.id}/edit`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleDelete(ingredient.id)}
      >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  });

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="p-6">로딩 중...</div>
      ) : (
        <PageContainer 
          title="식재료 관리"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">식재료 관리</h1>
            <Button onClick={() => {
              router.push('/ingredients/add');
            }}>
              <Plus className="w-4 h-4 mr-2" />
              식재료 추가
            </Button>
          </div>

          <FilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="식재료명 검색..."
            filters={[
              {
                label: '카테고리',
                value: categoryFilter,
                onChange: setCategoryFilter,
                options: [
                  { value: 'ALL', label: '전체' },
                  ...categories.map(cat => ({ value: cat, label: cat }))
                ]
              }
            ]}
          />

          <DataTable
            data={paginatedData}
            columns={columns}
            renderRow={renderRow}
            searchTerm={searchTerm}
          />
        </PageContainer>
      )}
    </ProtectedRoute> 
  );
}