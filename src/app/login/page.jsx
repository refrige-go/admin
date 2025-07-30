"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import styles from "@/assets/css/LoginPage.module.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called!');
    setLoading(true); 
    setError(""); 

    try {
      // 1. 로그인 요청
      const res = await axios.post(
        `${baseUrl}/login`,
        { username: formData.username, password: formData.password },
        { withCredentials: true }
      );

      console.log('로그인 응답 상태:', res.status);
      console.log('로그인 응답 데이터:', res.data);

      // 2. authorization 헤더에서 Bearer 떼고 순수 토큰만 추출!
      const rawAuthorization = res.headers['authorization'];
      const accessToken = rawAuthorization?.replace('Bearer ', '');
      
      if (accessToken) {
        console.log('로그인 성공');
        // 사용자 데이터 생성
        const userData = {
          username: formData.username,
          nickname: formData.username,
          role: "ROLE_ADMIN"
        };
        
        // AuthContext의 login 함수 사용
        login(accessToken, userData);
        
        console.log('🚀 대시보드로 이동');
        
        // 올바른 페이지로 이동
        router.push('/');
      } else {
        console.error('토큰이 없습니다.');
        setError('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      
      //  오류 상태에 따른 메시지 설정
      if (error.response?.status === 403) {
        setError('관리자 권한이 필요합니다. 일반 사용자는 접근할 수 없습니다.');
      } else if (error.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>관리자 로그인</h1>
        <p className={styles.subtitle}>관리자 권한이 있는 계정만 로그인할 수 있습니다.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className={styles.input}
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}