import { useState, useEffect } from 'react';

/**
 * 데이터 페칭을 위한 커스텀 훅
 * @param {Function} fetchFunction - 데이터를 가져오는 함수
 * @param {Array} dependencies - 의존성 배열
 * @returns {Object} { data, loading, error, refetch }
 */
export function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('데이터 페칭 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
} 