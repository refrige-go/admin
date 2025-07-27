"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { noticeAPI } from "@/lib/api";

const categoryOptions = [
  { value: "ANNOUNCEMENT", label: "공지" },
  { value: "MAINTENANCE", label: "점검" },
];

export default function NoticeEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await noticeAPI.getNotice(id);
        setNotice(data);
        setCategory(data.category);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError("공지 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchNotice();
  }, [id]);

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleDeleteImage = (imageId) => {
    setDeleteImageIds(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await noticeAPI.updateNotice({
        id,
        category,
        title,
        content,
        deleteImageIds,
        newImages
      });
      setSuccess(true);
      setTimeout(() => router.push(`/notice/${id}`), 1200);
    } catch (err) {
      setError("공지 수정에 실패했습니다. (권한 또는 서버 오류)");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10 mb-10"><div className="py-16 text-center text-gray-500">불러오는 중...</div></div>;
  }
  if (error) {
    return <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10 mb-10"><div className="py-16 text-center text-red-500">{error}</div></div>;
  }
  if (!notice) {
    return <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10 mb-10"><div className="py-16 text-center text-gray-400">공지 정보를 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-black">공지 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1 text-black">카테고리</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">카테고리 선택</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">제목</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">내용</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] text-black"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        {notice.images && notice.images.length > 0 && (
          <div>
            <label className="block font-semibold mb-1 text-black">기존 이미지</label>
            <div className="flex gap-2 flex-wrap">
              {notice.images.map((image) => {
                // 현재 이미지가 삭제 예정 목록에 있는지 확인합니다.
                const isMarkedForDeletion = deleteImageIds.includes(image.id);

                return (
                  <div
                    key={image.id}
                    className="relative w-24 h-24" // 크기 조절을 위해 w-20, h-20에서 변경
                    onClick={() => handleDeleteImage(image.id)} // 이미지 클릭으로도 토글 가능
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={image.url}
                      alt={`기존 이미지 ${image.id}`}
                      className={`w-full h-full object-cover rounded ${isMarkedForDeletion ? 'opacity-30' : ''}`} // 삭제 예정일 때 이미지 어둡게
                    />

                    {isMarkedForDeletion ? (
                      // 삭제 예정일 때 표시될 오버레이
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded">
                        <span className="text-white text-sm font-bold">삭제 예정</span>
                      </div>
                    ) : (
                      // 기본 상태일 때 표시될 삭제 버튼
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 z-10"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div>
          <label className="block font-semibold mb-1 text-black">새 이미지 첨부</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {newImages.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {newImages.map((file, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded text-black">{file.name}</span>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-[#47caeb] hover:bg-[#47caeb]/90 text-white font-semibold py-2 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "수정 중..." : "공지 수정"}
        </button>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        {success && <div className="text-green-600 text-center mt-2">공지 수정 완료! 상세페이지로 이동합니다.</div>}
      </form>
    </div>
  );
} 