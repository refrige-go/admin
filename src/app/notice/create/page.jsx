"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { noticeAPI } from "@/lib/api";

const categoryOptions = [
  { value: "ANNOUNCEMENT", label: "공지" },
  { value: "MAINTENANCE", label: "점검" },
];

export default function NoticeCreatePage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await noticeAPI.createNotice({ category, title, content, images });
      setSuccess(true);
      setTimeout(() => router.push("/notice"), 1200);
    } catch (err) {
      setError("공지 등록에 실패했습니다. (권한 또는 서버 오류)");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-black">공지 등록</h2>
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
        <div>
          <label className="block font-semibold mb-1 text-black">이미지 첨부 (여러 개 가능)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((file, idx) => (
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
          {isSubmitting ? "등록 중..." : "공지 등록"}
        </button>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        {success && <div className="text-green-600 text-center mt-2">공지 등록 완료! 목록으로 이동합니다.</div>}
      </form>
    </div>
  );
} 