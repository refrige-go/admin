"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ingredientsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function AddIngredientPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    defaultExpiryDays: 7,
    storageMethod: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 보관방법 옵션 정의
  const storageMethodOptions = [
    { value: '', label: '보관방법을 선택하세요' },
    { value: '냉장', label: '냉장' },
    { value: '냉동', label: '냉동' },
    { value: '실온', label: '실온' },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await ingredientsAPI.getCategories();
      console.log("=== 카테고리 로드 완료 ===");
      console.log("받은 카테고리 목록:", data); //디버깅용
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
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
    console.log('전송할 데이터:', formData);
    await ingredientsAPI.createIngredient(formData);
    
    // 성공 메시지 표시
    alert('식재료가 성공적으로 추가되었습니다.');
    
    // 기본 목록 페이지로 이동
    router.push('/ingredients');
    
  } catch (error) {
    console.error('식재료 추가 실패:', error);
    alert('식재료 추가에 실패했습니다.');
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
    const value = parseInt(e.target.value) || 0;
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">식재료 추가</h1>

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
              ...categories.map(cat => {
                return { value: cat, label: cat };  
              })
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
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" //숫자 스피너 제거
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
            {loading ? '추가 중...' : '추가'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}