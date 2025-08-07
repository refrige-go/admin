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

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
      console.log("받은 카테고리 목록:", data);
      setCategories(data);
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  // 이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // URL 입력 필드 초기화
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    console.log('이미지 URL 변경:', value);
    setFormData(prev => ({ ...prev, imageUrl: value }));
    
    // URL 입력 시 파일 선택 초기화
    if (value) {
      setSelectedFile(null);
      setImagePreview('');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('식재료 추가 시작');

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
      let finalImageUrl = formData.imageUrl;
      
      // 파일이 선택된 경우 파일 업로드 처리
      if (selectedFile) {
        console.log('파일 업로드 시작:', selectedFile.name);
        
        // FormData 생성
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        // 파일 업로드 API 호출
        try {
          const token = localStorage.getItem('accessToken');
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/upload/image`, {
            method: 'POST',
            body: uploadFormData,
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('파일 업로드 응답:', uploadResponse);
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            finalImageUrl = uploadResult.imageUrl; // 업로드된 이미지 URL
            console.log('파일 업로드 성공:', finalImageUrl);
          } else {
            throw new Error('파일 업로드 실패');
          }
        } catch (uploadError) {
          console.error('파일 업로드 오류:', uploadError);
          alert('이미지 업로드에 실패했습니다. URL을 직접 입력하거나 다시 시도해주세요.');
          setLoading(false);
          return;
        }
      }

      // 최종 데이터 준비
      const submitData = {
        ...formData,
        imageUrl: finalImageUrl
      };

      console.log('전송할 데이터:', submitData);
      await ingredientsAPI.createIngredient(submitData);
      
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

  return (
    <div className="min-h-screen bg-[#e2e9ef] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#2d1b0a] mb-6">식재료 추가</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2d1b0a]">식재료명 *</label>
            <Input
              value={formData.name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2d1b0a]">카테고리 *</label>
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
            <div className="text-xs text-gray-500 mt-1">
              현재 선택: {formData.category || '없음'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2d1b0a]">기본 유통기한 (일) *</label>
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
            <label className="block text-sm font-medium mb-2 text-[#2d1b0a]">보관 방법</label>
            <Select
              value={formData.storageMethod}
              onChange={handleStorageMethodChange}
              options={storageMethodOptions}
            />
            <div className="text-xs text-gray-500 mt-1">
              현재 선택: {formData.storageMethod || '없음'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2d1b0a]">이미지</label>
            
            {/* 파일 업로드 섹션 */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">파일 업로드</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f9bf52] file:text-[#2d1b0a] hover:file:bg-[#e6a94a]"
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-green-600">✓ {selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      제거
                    </button>
                  </div>
                )}
              </div>

              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">미리보기</label>
                  <img 
                    src={imagePreview} 
                    alt="미리보기" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              {/* URL 입력 */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">이미지 URL 직접 입력</label>
                <Input
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://..."
                  disabled={!!selectedFile}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading} className="bg-[#f9bf52] text-[#2d1b0a] hover:bg-[#e6a94a] flex-1">
              {loading ? '추가 중...' : '추가'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#f9bf52] text-[#2d1b0a] hover:bg-[#f9bf52] flex-1">
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}