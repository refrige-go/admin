"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { dogsAPI } from "@/lib/api";
import styles from "@/assets/css/UserDetailPage.module.css";
import StatusButton from "@/components/ui/StatusButton";

// 날짜 포맷
function formatDate(dateStr, locale = 'ko') {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return locale === 'ko'
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : date.toISOString().slice(0, 10);
}

// 성별 라벨
const genderLabel = { M: '남', F: '여' };
// 반려견 상태 라벨
const dogStatusLabel = { REGISTERED: '요청', APPROVED: '승인', SUSPENDED: '중지', REMOVED: '삭제' };

export default function DogDetailPage() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDog() {
      setLoading(true);
      try {
        // dogsAPI가 없다면 usersAPI.getUsersDog로 대체
        const dogData = await dogsAPI.getDog(id);
        setDog(dogData);
      } finally {
        setLoading(false);
      }
    }
    fetchDog();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!dog) return <div>반려견 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>반려견 정보</h2>
        <div className={styles.infoRow}><span>이름</span><span>{dog.name}</span></div>
        <div className={styles.infoRow}><span>생년월일</span><span>{formatDate(dog.birth)}</span></div>
        <div className={styles.infoRow}><span>성별</span><span>{genderLabel[dog.gender]}</span></div>
        <div className={styles.infoRow}><span>성격</span><span>{dog.personalities?.join(', ')}</span></div>
        <div className={styles.infoRow}>
          <span>상태</span>
          <span>
            <StatusButton label={dogStatusLabel[dog.status]} type="dogStatus" status={dog.status} />
          </span>
        </div>
        <div className={styles.infoRow}><span>렌더링 모델</span>
          <span>
            {dog.renderedUrl ? (
              <a href={dog.renderedUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {dog.renderedUrl}
              </a>
            ) : '-'}
          </span>
        </div>
        <div className={styles.infoRow}><span>등록일</span><span>{formatDate(dog.createdAt, 'en')}</span></div>
        <div className={styles.infoRow}><span>수정일</span><span>{dog.updatedAt ? formatDate(dog.updatedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>삭제일</span><span>{dog.deletedAt ? formatDate(dog.deletedAt, 'en') : '-'}</span></div>
      </div>
    </div>
  );
}
