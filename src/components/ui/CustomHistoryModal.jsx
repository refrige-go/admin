import styles from '@/assets/css/CustomHistoryModal.module.css'
import StatusButton from '@/components/ui/StatusButton'
import { Search } from "lucide-react"

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const statusLabel = {
  HOLD: '보류',
  PENDING: '대기',
  COMPLETED: '완료',
  CANCELED: '취소',
  IN_PROGRESS: '진행중',
}

export default function CustomHistoryModal({ history, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>반려견 커스텀 요청 목록</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>담당자</th>
                <th>상태</th>
                <th>요청일</th>
                <th>시작일</th>
                <th>보류일</th>
                <th>취소일</th>
                <th>완료일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.adminNickname ?? '-'}</td>
                  <td>
                    <StatusButton
                      label={statusLabel[item.status] || item.customStatus}
                      type="customStatus"
                      status={item.status}
                    />
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{formatDate(item.startedAt)}</td>
                  <td>{item.hold ? formatDate(item.hold.createdAt) : '-'}</td>
                  <td>{formatDate(item.canceledAt)}</td>
                  <td>{formatDate(item.completedAt)}</td>
                  <td>
                    <button
                      onClick={() => console.log('상세보기:', item.id)}
                      className={styles.detailButton}
                      title="자세히"
                    >
                      <Search className="w-4 h-4 text-[#404040]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
