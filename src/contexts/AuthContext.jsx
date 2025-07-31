"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      checkAuthStatus();
      initializedRef.current = true;
    }
  }, []);

  // 토큰 정리 함수
  const cleanToken = (token) => {
    if (!token) return '';
    return token.trim()
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') 
      .replace(/\s+/g, ''); 
  };

  // 초기 인증 상태 확인 (페이지 로드 시 한 번만)
  useEffect(() => {
    if (!initializedRef.current) {
      console.log("AuthContext 초기화 시작");
      checkAuthStatus();
      initializedRef.current = true;
    }
  }, []);  

  const checkAuthStatus = async () => {
    console.log("인증 상태 확인 시작");

    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    console.log("localStorage에서 토큰 존재:", !!token);
    console.log("localStorage에서 사용자 데이터 존재:", !!userData);
    
    if (token && userData) {
        try {
        const cleanTokenValue = cleanToken(token);
        if (cleanTokenValue.length > 10) {
            // 토큰 유효성 검증 (백엔드 호출)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/validate`, {
            headers: {
                'Authorization': `Bearer ${cleanTokenValue}`
            }
            });
            
            if (response.ok) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
            } else {
            // 토큰이 만료되었거나 유효하지 않음
            console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/login';
            }
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        }
        } catch (error) {
        console.error('토큰 검증 실패:', error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
        }
    } else {
        setUser(null);
        setIsAuthenticated(false);
    }
    setLoading(false);
    };

    const login = (token, userData) => {
    console.log("🔐 AuthContext - login 실행");
    console.log("받은 토큰 길이:", token?.length);
    console.log("받은 사용자 데이터:", userData);

    // 토큰 정리
    const cleanTokenValue = cleanToken(token);
    console.log("정리된 토큰 길이:", cleanTokenValue.length);

    // 즉시 상태 업데이트
    setUser(userData);
    setIsAuthenticated(true);

    // localStorage 저장
    localStorage.setItem("accessToken", cleanTokenValue);
    localStorage.setItem("user", JSON.stringify(userData));

    // 저장 확인
    console.log("저장된 토큰 존재:", !!localStorage.getItem("accessToken"));
    console.log("저장된 사용자 존재:", !!localStorage.getItem("user"));

    console.log("✅ 로그인 완료 - isAuthenticated:", true, "user:", userData);
  };

  const logout = () => {
    console.log("🚪 AuthContext - logout 실행");    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 디버깅용 상태 로그
  useEffect(() => {
    console.log("🔄 AuthContext 상태 변경:", {
      isAuthenticated,
      user: user?.username,
      loading
    });
  }, [isAuthenticated, user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}