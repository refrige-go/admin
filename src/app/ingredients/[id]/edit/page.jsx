"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ingredientsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function EditIngredientPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    defaultExpiryDays: 7,
    storageMethod: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // 보관방법 옵션 정의
  const storageMethodOptions = [
    { value: '', label: '보관방법을 선택하세요' },
    { value: '냉장', label: '냉장' },
    { value: '냉동', label: '냉동' },
    { value: '실온', label: '실온' }
  ];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError(null);
      const [ingredientData, categoriesData] = await Promise.all([
        ingredientsAPI.getIngredient(id),
        ingredientsAPI.getCategories()
      ]);
      
      setFormData({
        name: ingredientData.name || '',
        category: ingredientData.category || '',
        defaultExpiryDays: ingredientData.defaultExpiryDays || 7,
        storageMethod: ingredientData.storageMethod || '',
        imageUrl: ingredientData.imageUrl || ''
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setError('데이터 로드에 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.name || formData.name.trim() === '') {
      alert('식재료명을 입력해주세요.');
      return;
    }
    
    if (!formData.category || formData.category === '') {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.defaultExpiryDays || formData.defaultExpiryDays <= 0) {
      alert('기본 유통기한을 입력해주세요.');
      return;
    }

  setLoading(true);

  try {
    await ingredientsAPI.updateIngredient(id, formData);
    
    alert('식재료가 성공적으로 수정되었습니다.');
    
    // 기본 목록 페이지로 이동
    router.push('/ingredients');
    
  } catch (error) {
    console.error('식재료 수정 실패:', error);
    alert('식재료 수정에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};

  const handleNameChange = (e) => {
    const value = e.target.value;
    console.log('식재료명 변경:', value);
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    console.log('카테고리 변경:', value);
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleExpiryDaysChange = (e) => {
    const value = e.target.value;
    console.log('유통기한 변경:', value);
    setFormData(prev => ({ ...prev, defaultExpiryDays: value }));
  };

  const handleStorageMethodChange = (e) => {
    const value = e.target.value;
    console.log('보관방법 변경:', value);
    setFormData(prev => ({ ...prev, storageMethod: value }));
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    console.log('이미지 URL 변경:', value);
    setFormData(prev => ({ ...prev, imageUrl: value }));
  };

  if (initialLoading) return <div className="p-6">로딩 중...</div>;
  
  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button onClick={loadData} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">식재료 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">식재료명 *</label>
          <Input
            value={formData.name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">카테고리 *</label>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            options={[
              { value: '', label: '카테고리를 선택하세요' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
            required
          />
          {/* 현재 선택된 값 표시 (디버깅용) */}
          <div className="text-xs text-gray-500 mt-1">
            현재 선택: {formData.category || '없음'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">기본 유통기한 (일) *</label>
          <Input
            type="number"
            value={formData.defaultExpiryDays}
            onChange={handleExpiryDaysChange}
            min="1"
            placeholder="유통기한을 입력하세요 (예: 7)"
            required
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">보관 방법</label>
          <Select
            value={formData.storageMethod}
            onChange={handleStorageMethodChange}
            options={storageMethodOptions}
          />
          {/* 현재 선택된 값 표시 (디버깅용) */}
          <div className="text-xs text-gray-500 mt-1">
            현재 선택: {formData.storageMethod || '없음'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">이미지 URL</label>
          <Input
            value={formData.imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? '수정 중...' : '수정'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}