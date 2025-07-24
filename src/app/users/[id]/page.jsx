"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usersAPI } from "@/lib/api";
import styles from "../../../assets/css/UserDetailPage.module.css";
import StatusButton from "@/components/ui/StatusButton";
import { useRouter } from "next/navigation";
import CustomHistoryModal from "@/components/ui/CustomHistoryModal";

// 날짜 포맷
function formatDate(dateStr, locale = 'ko') {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return locale === 'ko'
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : date.toISOString().slice(0, 10);
}

// 권한 라벨
const roleLabel = { USER: '회원', ADMIN: '관리자' };

// 사용자 상태 라벨 (userStatus)
const userStatusLabel = { ACTIVE: '정상', SUSPENDED: '차단', WITHDRAWN: '탈퇴' };

// 반려견 상태 라벨 (dogStatus)
const dogStatusLabel = { REGISTERED: '요청', APPROVED: '승인', SUSPENDED: '중지', REMOVED: '삭제' };

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
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [customHistory, setCustomHistory] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleDogDetail = async () => {
    try {
      const dogData = await usersAPI.getUsersDog(dog.id);
      console.log('반려견 데이터 : ', dogData);
      router.push(`/dogs/${dog.id}`);
    } catch (error) {
      console.error('반려견 정보 조회 실패:', error);
      alert('반려견 상세 정보를 불러오지 못했습니다.');
    }
  };

  const handleDogCustom = async () => {
    try {
      const customHistoryData = await usersAPI.getCustomhistorylist(dog.id);
      setCustomHistory(customHistoryData);
      setShowCustomModal(true);  // 팝업 열기
    } catch (error) {
      console.error('커스텀 히스토리 조회 실패:', error);
      alert('커스텀 히스토리 정보를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    async function fetchUserAndDog() {
      setLoading(true);
      try {
        const data = await usersAPI.getUser(id);
        setUser(data.user);
        setDog(data.dog);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndDog();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>회원 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>

      {showCustomModal && (
        <CustomHistoryModal
          history={customHistory}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      {/* 회원 정보 */}
      <div className={styles.card}>
        <h2 className={styles.title}>회원 정보</h2>
        <div className={styles.infoRow}><span>닉네임</span><span>{user.nickname}</span></div>

        <div className={styles.infoRow}>
          <span>이메일</span>
          <span>
            {user.provider && (
              <span className={`${providerIconClass[user.provider]}`}></span>
            )}
            {user.email}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span>권한</span>
          <span>
            <StatusButton label={roleLabel[user.role]} type="role" status={user.role} />
          </span>
        </div>

        <div className={styles.infoRow}>
          <span>상태</span>
          <span>
            <StatusButton label={userStatusLabel[user.status]} type="userStatus" status={user.status} />
          </span>
        </div>

        <div className={styles.infoRow}><span>성별</span><span>{genderLabel[user.gender]}</span></div>
        <div className={styles.infoRow}><span>생년월일</span><span>{formatDate(user.birth)}</span></div>
        <div className={styles.infoRow}><span>가입일</span><span>{formatDate(user.createdAt, 'en')}</span></div>
        <div className={styles.infoRow}><span>수정일</span><span>{user.updatedAt ? formatDate(user.updatedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>삭제일</span><span>{user.deletedAt ? formatDate(user.deletedAt, 'en') : '-'}</span></div>
      </div>

      {/* 반려견 정보 */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>회원의 반려견</h2>
          <div className={styles.actions}>
            <button onClick={handleDogDetail}>상세조회</button>
            <button onClick={handleDogCustom}>커스텀 요청 목록</button>
          </div>
        </div>

        {dog ? (
          <>
            <div className={styles.infoRow}><span>반려견 이름</span><span>{dog.name}</span></div>
            <div className={styles.infoRow}><span>반려견 생년월일</span><span>{formatDate(dog.birth)}</span></div>
            <div className={styles.infoRow}><span>반려견 성별</span><span>{genderLabel[dog.gender]}</span></div>
            <div className={styles.infoRow}><span>반려견 성격</span><span>{dog.personalities?.join(', ')}</span></div>

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
          </>
        ) : (
          <div className="text-gray-400">등록된 반려견 정보가 없습니다.</div>
        )}
      </div>
    </div>
    
  );
}
