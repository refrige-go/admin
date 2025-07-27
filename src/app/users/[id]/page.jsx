"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usersAPI } from "@/lib/api";
import styles from "../../../assets/css/UserDetailPage.module.css";
import StatusButton from "@/components/ui/StatusButton";
import { useRouter } from "next/navigation";

// 날짜 포맷
function formatDate(dateStr, locale = 'ko') {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return locale === 'ko'
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : date.toISOString().slice(0, 10);
}

// 권한 라벨
const roleLabel = { ROLE_USER: '회원', ROLE_ADMIN: '관리자' };

// 사용자 상태 라벨 (userStatus)
const userStatusLabel = { ACTIVE: '정상', WITHDRAWN: '탈퇴' };

// 성별 라벨
const genderLabel = { M: '남', F: '여' };

// provider별 아이콘 클래스
const providerIconClass = {
  google: styles.googleIcon,
  naver: styles.naverIcon
};

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        // 백엔드 API 직접 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log('회원 상세 데이터:', userData);
        setUser(userData);

      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
        alert('회원 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>회원 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>

      {/* 회원 정보 */}
      <div className={styles.card}>
        <h2 className={styles.title}>회원 정보</h2>
        <div className={styles.infoRow}><span>닉네임</span><span>{user.nickname}</span></div>
        <div className={styles.infoRow}><span>아이디</span><span>{user.username}</span></div>
        <div className={styles.infoRow}>
          <span>권한</span>
          <span>
            <StatusButton label={roleLabel[user.role]} type="role" status={user.role} />
          </span>
        </div>
        <div className={styles.infoRow}>
          <span>상태</span>
          <span>
            <StatusButton label={userStatusLabel[user.deleted ? 'WITHDRAWN' : 'ACTIVE']} type="userStatus" status={user.deleted ? 'WITHDRAWN' : 'ACTIVE'} />
          </span>
        </div>
        <div className={styles.infoRow}><span>가입일</span><span>{formatDate(user.createdAt, 'en')}</span></div>
        <div className={styles.infoRow}><span>수정일</span><span>{user.updatedAt ? formatDate(user.updatedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>삭제일</span><span>{user.deletedAt ? formatDate(user.deletedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>프로필 이미지</span><span>{user.profileImageUrl || '-'}</span></div>
      </div>
    </div>
  );
}
