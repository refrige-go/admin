"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import StatusButton from "@/components/ui/StatusButton";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, ArrowLeft, Save, X } from "lucide-react";
import styles from "../../../assets/css/UserDetailPage.module.css";

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
  // 수정 모드 관련 state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        // 백엔드 API 직접 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // 404 에러일 때는 뒤로가기
            alert('해당 회원을 찾을 수 없습니다.');
            router.back();
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        console.log('회원 상세 데이터:', userData);
        setUser(userData);

        // editForm 초기화 (닉네임 제외, 권한만 변경 가능)
        setEditForm({
          role: userData.role || 'ROLE_USER'
        });

      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
        alert('회원 정보를 불러오지 못했습니다.');
        // 오류 발생 시 뒤로가기
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // 수정/삭제 관련 함수
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      nickname: user.nickname || '',
      role: user.role || 'ROLE_USER'
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('사용자 정보가 성공적으로 수정되었습니다.');
      setIsEditing(false);
      
      // 사용자 정보 다시 불러오기
      const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`);
      const updatedData = await updatedResponse.json();
      setUser(updatedData);
    } catch (error) {
      console.error('사용자 정보 수정 실패:', error);
      alert('사용자 정보 수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('사용자가 성공적으로 삭제되었습니다.');
        router.push('/users');
      } catch (error) {
        console.error('사용자 삭제 실패:', error);
        alert('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>회원 정보를 불러올 수 없습니다.</div>;

  return (
    <div className={styles.container}>
        {/* 회원 정보 */}
        <div className={styles.card}>
          {/* 헤더와 버튼들 추가 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={styles.title}>회원 정보</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              // 일반 모드
              <>
                {!user.deleted ? (
                  <>
                    <Button onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      수정
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">⚠️ 이 회원은 탈퇴한 회원입니다.</div>
                )}
              </>
            ) : (
              // 수정 모드
              <>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          </div>
        </div>

        {/* 회원 정보 표시 - 수정 가능한 필드들 */}
        <div className={styles.infoRow}>
          <span>닉네임</span>
          <span className="text-gray-600">{user.nickname}</span>
        </div>
        
        {/* 아이디는 항상 읽기 전용 */}
        <div className={styles.infoRow}>
          <span>아이디</span>
          <span className="text-gray-600">{user.username}</span>
        </div>
        
        {/* 권한만 수정 가능 */}
        <div className={styles.infoRow}>
          <span>권한</span>
          {isEditing ? (
            <select
              value={editForm.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ROLE_USER">회원</option>
              <option value="ROLE_ADMIN">관리자</option>
            </select>
          ) : (
            <span>
              <StatusButton label={roleLabel[user.role]} type="role" status={user.role} />
            </span>
          )}
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
