"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { customsAPI } from "@/lib/api";
import styles from "@/assets/css/UserDetailPage.module.css";
import StatusButton from "@/components/ui/StatusButton";
import { useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

// 날짜 포맷
function formatDate(dateStr, locale = 'ko') {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return locale === 'ko'
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : date.toISOString().slice(0, 10);
}

const genderLabel = { M: '남', F: '여' };
const customStatusLabel = {
  PENDING: "대기",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  HOLD: "보류",
  CANCELED: "취소",
};

export default function CustomDetailPage() {
  const { id } = useParams();
  const [custom, setCustom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCustom() {
      setLoading(true);
      try {
        const customData = await customsAPI.getCustom(id);
        setCustom(customData);
      } finally {
        setLoading(false);
      }
    }
    fetchCustom();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (!custom) return <div>커스텀 요청 정보를 불러올 수 없습니다.</div>;

  // 상태 변경 모달 내부 컴포넌트
  function CustomStatusModal({ currentStatus, dogImages, onClose }) {
    // 상태 목록에서 현재 상태 제외
    const statusList = Object.keys(customStatusLabel).filter(s => s !== currentStatus && s !== "PENDING");

    // 상태 변경 처리
    const handleStatusClick = async (status) => {
      if (!user?.id) {
        alert("로그인 정보가 없습니다.");
        return;
      }
      if (status === "COMPLETED") {
        setShowFileInput(true);
        setShowReasonInput(false);
      } else if (status === "HOLD") {
        setShowReasonInput(true);
        setShowFileInput(false);
      } else {
        setIsSubmitting(true);
        try {
          if (status === "IN_PROGRESS") {
            console.log("userid", user.id);
            console.log("id", id);
            await customsAPI.updateCustomStatusInProgress(id, { adminId: user.id });
          } else if (status === "CANCELED") {
            await customsAPI.updateCustomStatusCanceled(id, { adminId: user.id });
          }
          onClose();
          window.location.reload();
        } catch (e) {
          alert("상태 변경 실패: " + e.message);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const holdReasons = [
      { value: "NOT_DOG_IMAGE", label: "업로드 된 사진이 강아지 사진이 아님" },
      { value: "LOW_RESOLUTION", label: "사진 해상도가 너무 낮음" },
      { value: "POLICY_VIOLATION", label: "서비스 이용 정책에 위반되는 이미지" },
      { value: "INAPPROPRIATE_CONTENT", label: "부적절한 콘텐츠 포함(폭력적이거나 선정적, 혐오 표현 등)" },
      { value: "PROCESSING_ERROR", label: "업로드 과정에서 오류가 발생했거나, 이미지 파일이 손상되어 확인이 어려움" },
    ];

    const handleReasonSubmit = async () => {
      if (!reason) {
        alert("보류 사유를 선택해주세요.");
        return;
      }
      setIsSubmitting(true);
      try {
        await customsAPI.updateCustomStatusHold(id, { adminId: user.id, reason });
        setShowReasonInput(false);
        onClose();
        window.location.reload();
      } catch (e) {
        alert("상태 변경 실패: " + e.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    // 완료 파일 제출
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("adminId", user.id);
        formData.append("file", file);
        await customsAPI.updateCustomStatusCompleted(id, formData);
        setShowFileInput(false);
        onClose();
        window.location.reload();
      } catch (e) {
        alert("상태 변경 실패: " + e.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="modalOverlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
        <div className="modalContent" style={{ background:'#fff', borderRadius:10, padding:24, width:'90%', maxWidth:600, maxHeight:'85vh', overflowY:'auto', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:22, fontWeight:700, margin:0 }}>요청 상태를 변경하시겠습니까?</h3>
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ display:'flex', gap:12, marginBottom:24 }}>
            {Array.isArray(dogImages) && dogImages.length > 0 ? (
              dogImages.slice(0,4).map((url, idx) => (
                <img key={idx} src={url} alt={`dog-img-${idx+1}`} style={{ width:120, height:120, objectFit:'cover', borderRadius:8, border:'1px solid #eee' }} />
              ))
            ) : <div>-</div>}
          </div>
          <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom: (showFileInput || showReasonInput) ? 16 : 0 }}>
            {statusList.map(status => (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                disabled={isSubmitting}
                style={{
                  minWidth:80,
                  padding:'10px 24px',
                  borderRadius:8,
                  border:'none',
                  fontWeight:600,
                  fontSize:16,
                  cursor:'pointer',
                  background: status === 'IN_PROGRESS' ? '#6ee0f6'
                    : status === 'HOLD' ? '#b6f6c6'
                    : status === 'CANCELED' ? '#ffbdbd'
                    : status === 'COMPLETED' ? '#ffd966'
                    : '#eee',
                  color: status === 'CANCELED' ? '#fff' : '#222',
                  transition:'background 0.2s',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >{customStatusLabel[status]}</button>
            ))}
            <button onClick={onClose} style={{ minWidth:80, padding:'10px 24px', borderRadius:8, border:'none', fontWeight:600, fontSize:16, background:'#222', color:'#fff', cursor:'pointer' }}>뒤로</button>
          </div>
          {showReasonInput && (
            <div style={{ marginTop:16, textAlign:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:8, marginBottom:12 }}>
                {holdReasons.map(opt => (
                  <label key={opt.value} style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:'#333', cursor:'pointer' }}>
                    <input
                      type="radio"
                      name="holdReason"
                      value={opt.value}
                      checked={reason === opt.value}
                      onChange={() => setReason(opt.value)}
                      disabled={isSubmitting}
                      style={{ accentColor:'#b6f6c6' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <button onClick={handleReasonSubmit} disabled={isSubmitting} style={{ padding:'8px 18px', borderRadius:6, border:'none', background:'#b6f6c6', color:'#222', fontWeight:600, fontSize:15, cursor:'pointer' }}>보류</button>
            </div>
          )}
          {showFileInput && (
            <div style={{ marginTop:16, textAlign:'center' }}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={isSubmitting} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>커스텀 요청 정보</h2>
        <div className={styles.infoRow}><span>반려견ID</span><span>{custom.id}</span></div>
        <div className={styles.infoRow}><span>반려견 이름</span><span>{custom.dogName}</span></div>
        <div className={styles.infoRow}><span>반려견 생일</span><span>{formatDate(custom.dogBirth)}</span></div>
        <div className={styles.infoRow}><span>반려견 성별</span><span>{genderLabel[custom.dogGender]}</span></div>
        <div className={styles.infoRow}><span>반려견 성격</span><span>{custom.personalities?.join(', ')}</span></div>
        <div className={styles.infoRow}>
          <span>상태</span>
          <span>
            <span onClick={() => { setModalOpen(true); setShowFileInput(false); }} style={{ cursor:'pointer', display:'inline-block' }}>
              <StatusButton label={customStatusLabel[custom.status]} type="customStatus" status={custom.status} />
            </span>
          </span>
        </div>
        <div className={styles.infoRow}><span>담당자</span><span>{custom.adminNickname}</span></div>
        <div className={styles.infoRow}><span>요청일</span><span>{formatDate(custom.createdAt, 'en')}</span></div>
        <div className={styles.infoRow}><span>작업 시작일</span><span>{custom.startedAt ? formatDate(custom.startedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>보류일</span><span>{custom.holdCreatedAt ? formatDate(custom.holdCreatedAt, 'en') : '-'}</span></div>
        <div className={styles.infoRow}><span>보류 사유</span><span>{custom.holdReason}</span></div>
        <div className={styles.infoRow}><span>취소일</span><span>{custom.canceledAt ? formatDate(custom.canceledAt, 'en') : '-'}</span></div>
      </div>
      <div className={styles.card}>
        <div className={styles.imageSectionTitle}>렌더링 요청 이미지</div>
        <div className={styles.imageListRow}>
          {Array.isArray(custom.dogImages) && custom.dogImages.length > 0 ? (
            custom.dogImages.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <img
                  src={url}
                  alt={`dog-rendered-${idx + 1}`}
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
              </a>
            ))
          ) : (
            <div>-</div>
          )}
        </div>
      </div>
      {modalOpen && (
        <CustomStatusModal
          currentStatus={custom.status}
          dogImages={custom.dogImages}
          onClose={() => { setModalOpen(false); setShowFileInput(false); }}
        />
      )}
    </div>
  );
}
