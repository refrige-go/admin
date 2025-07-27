"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { noticeAPI } from "@/lib/api";
import styles from "./NoticeDetailPage.module.css";

export default function NoticeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await noticeAPI.getNotice(id);
        setNotice(data);
      } catch (err) {
        setError("공지 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말로 이 공지를 삭제하시겠습니까?")) {
      return;
    }
    setIsDeleting(true);
    try {
      await noticeAPI.deleteNotice(id);
      alert("공지가 삭제되었습니다.");
      router.push("/notice");
    } catch (err) {
      alert("공지 삭제에 실패했습니다. (권한 또는 서버 오류)");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}><div className="py-16 text-center text-gray-500">불러오는 중...</div></div>;
  }
  if (error) {
    return <div className={styles.container}><div className="py-16 text-center text-red-500">{error}</div></div>;
  }
  if (!notice) {
    return <div className={styles.container}><div className="py-16 text-center text-gray-400">공지 정보를 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <div style={{ marginBottom: 18 }}>
        <span className={styles.categoryBadge}>
          {notice.category === "ANNOUNCEMENT" ? "공지" : notice.category === "MAINTENANCE" ? "점검" : notice.category}
        </span>
        <span className={styles.meta}>ID: {notice.id}</span>
      </div>
      <div className={styles.title}>{notice.title}</div>
      <div className={styles.meta}>
        작성자: {notice.authorNickname} | 등록일: {notice.createdAt ? new Date(notice.createdAt).toLocaleString() : "-"} | 수정일: {notice.updatedAt ? new Date(notice.updatedAt).toLocaleString() : "-"}
      </div>
      {notice.images && notice.images.length > 0 && (
        <div className={styles.imageGallery}>
          {notice.images.map((image) => (
            <img key={image.id} src={image.url} alt={`공지 이미지 ${image.id}`} />
          ))}
        </div>
      )}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: notice.content }} />

      <div style={{
        position: 'absolute',
        right: 32,
        bottom: 32,
        display: 'flex',
        gap: 12,
        flexDirection: 'row'
      }}>
        <button
          type="button"
          onClick={() => router.push(`/notice/${id}/edit`)}
          style={{
            background: '#f3f4f6',
            color: '#2563eb',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            background: isDeleting ? '#f3f4f6' : '#ef4444',
            color: isDeleting ? '#9ca3af' : '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 14,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/notice")}
          style={{
            background: '#f3f4f6',
            color: '#2563eb',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          목록으로
        </button>
      </div>
    </div>
  );
} 