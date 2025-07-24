"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { inquiryAPI } from "@/lib/api";
import styles from "./InquiryDetailPage.module.css";

function getCategoryLabel(category) {
  switch (category) {
    case "BUG": return "버그/오류";
    case "ACCOUNT": return "계정문의";
    case "FEEDBACK": return "피드백";
    case "ETC": return "기타";
    default: return category;
  }
}

function getStatusLabel(status) {
  if (status === "WAITING") return "답변대기";
  if (status === "ANSWERED") return "답변완료";
  return status;
}

function getStatusBadgeClass(status) {
  if (status === "WAITING") return `${styles.statusBadge} ${styles.statusWaiting}`;
  if (status === "ANSWERED") return `${styles.statusBadge} ${styles.statusAnswered}`;
  return styles.statusBadge;
}

export default function InquiryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await inquiryAPI.getInquiry(id);
        setInquiry(data);
      } catch (err) {
        setError("문의 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchInquiry();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const answer = await inquiryAPI.createAnswer(id, answerContent);
      setInquiry((prev) => ({ ...prev, answer, status: "ANSWERED" }));
      setAnswerContent("");
    } catch (err) {
      setSubmitError("답변 등록에 실패했습니다. (권한 또는 서버 오류)");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}><div className="py-16 text-center text-gray-500">불러오는 중...</div></div>;
  }
  if (error) {
    return <div className={styles.container}><div className="py-16 text-center text-red-500">{error}</div></div>;
  }
  if (!inquiry) {
    return <div className={styles.container}><div className="py-16 text-center text-gray-400">문의 정보를 찾을 수 없습니다.</div></div>;
  }

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <div style={{ marginBottom: 18 }}>
        <span className={styles.categoryBadge}>{getCategoryLabel(inquiry.category)}</span>
        <span className={getStatusBadgeClass(inquiry.status)}>{getStatusLabel(inquiry.status)}</span>
        <span className={styles.meta}>ID: {inquiry.inquiryId}</span>
      </div>
      <div className={styles.title}>{inquiry.title}</div>
      <div className={styles.meta}>
        작성자: {inquiry.authorNickname} | 등록일: {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "-"}
      </div>
      {inquiry.imageUrls && inquiry.imageUrls.length > 0 && (
        <div className={styles.imageGallery}>
          {inquiry.imageUrls.map((url, idx) => (
            <img key={idx} src={url} alt={`문의 이미지 ${idx + 1}`} />
          ))}
        </div>
      )}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: inquiry.content }} />

      {inquiry.answer ? (
        <div className={styles.answerBox}>
          <div className={styles.answerTitle}>관리자 답변</div>
          <div className={styles.answerMeta}>
            답변자: {inquiry.answer.authorNickname} | 등록일: {inquiry.answer.createdAt ? new Date(inquiry.answer.createdAt).toLocaleString() : "-"}
          </div>
          <div className={styles.answerContent}>{inquiry.answer.content}</div>
        </div>
      ) : (
        <form className={styles.answerForm} onSubmit={handleAnswerSubmit}>
          <label htmlFor="answer" style={{ fontWeight: 600, color: '#2563eb' }}>답변 작성</label>
          <textarea
            id="answer"
            value={answerContent}
            onChange={e => setAnswerContent(e.target.value)}
            placeholder="답변 내용을 입력하세요"
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting || !answerContent.trim()}>
            {isSubmitting ? "등록 중..." : "답변 등록"}
          </button>
          {submitError && <div style={{ color: 'red', marginTop: 8 }}>{submitError}</div>}
        </form>
      )}
      <button
        type="button"
        onClick={() => router.push("/inquiry")}
        style={{
          position: 'absolute',
          right: 32,
          bottom: 32,
          background: '#f3f4f6',
          color: '#2563eb',
          border: 'none',
          borderRadius: 6,
          padding: '10px 28px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        목록으로
      </button>
    </div>
  );
} 