"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log("��️ ProtectedRoute 인증 체크:", {
        loading,
        isAuthenticated,
        user: user?.username,
        requireAdmin
      });

      if (!loading) {
        if (!isAuthenticated) {
          console.log("🚫 인증되지 않은 사용자 - 로그인 페이지로 리다이렉트");
          router.push("/login");
        } else if (requireAdmin && user?.role !== "ROLE_ADMIN") {
          console.log("🚫 관리자 권한 없음 - 권한 없음 페이지로 리다이렉트");
          router.push("/unauthorized");
        } else {
          console.log("✅ 인증 성공 - 페이지 렌더링");
        }
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, loading, router, requireAdmin, user?.role]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로그인이 필요합니다...</div>
      </div>
    );
  }

  if (requireAdmin && user?.role !== "ROLE_ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">관리자 권한이 필요합니다...</div>
      </div>
    );
  }  

  return children;
}