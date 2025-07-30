// src/contexts/AuthContext.jsx
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

  const checkAuthStatus = async () => {

    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    console.log("사용자 데이터:", userData);

    if (token && userData) {
      try {
        // 토큰 유효성 검증
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("✅ 인증 성공 - 토큰 유효:", parsedUser);
        } else {
          // 토큰이 만료된 경우
          console.log("❌ 토큰 만료 - 상태:", response.status);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("인증 확인 실패:", error);
         // 네트워크 오류 시에도 토큰이 있으면 로그인 상태 유지
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log("⚠️ 네트워크 오류로 토큰 유효성 검증 실패, 로컬 상태 유지:", parsedUser);
      }
    }else{
      setUser(null);
      setIsAuthenticated(false);
      console.log("❌ 토큰 또는 사용자 데이터 없음");
    }
    setLoading(false);
  };

  const login = (token, userData) => {

    console.log("🔐 AuthContext - login 실행");
    console.log("토큰:", token);
    console.log("사용자 데이터:", userData)

    // 즉시 상태 업뎃
    setUser(userData);
    setIsAuthenticated(true);

    // localStorage 저장
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ 로그인 완료 - isAuthenticated:", true, "user:", userData);
  };

  const logout = () => {
    console.log("🚪 AuthContext - logout 실행");    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

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