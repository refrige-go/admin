import styles from "@/assets/css/PageContainer.module.css";
import { Pagination }  from "@/components/features/Pagination";

/**
 * 페이지 컨테이너 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 페이지 타이틀
 * @param {React.ReactNode} props.children - 컨텐츠
 * @param {number} [props.currentPage]
 * @param {number} [props.totalPages]
 * @param {function} [props.onPageChange]
 * @returns {JSX.Element}
 */
export default function PageContainer({ title, children, currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageCard}>
        <h2 className={styles.pageTitle}>{title}</h2>
        <div className={styles.pageContent}>{children}</div>
        {typeof currentPage === "number" && typeof totalPages === "number" && onPageChange && (
          <div className={styles.pagePagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}