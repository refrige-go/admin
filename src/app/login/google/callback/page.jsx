"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setError("로그인 중 오류가 발생했습니다.");
          setIsLoading(false);
          return;
        }

        if (!code) {
          setError("인증 코드를 받지 못했습니다.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'X-Client-Type': 'web'
          },
          body: JSON.stringify({
            code: code,
            redirectUri: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login/google/callback`
          }),
        });

        if (response.status === 200) {
          const tokenData = await response.json();
          localStorage.setItem('auth_token', tokenData.accessToken);

          const decoded = jwtDecode(tokenData.accessToken);
          const role = decoded.role;

          if (role === "ADMIN") {
            router.push('/users');
          } else if (role === "USER") {
            router.push('/inquiry');
          } else {
            router.push('/login');
          }

          await checkAuth();
        } else if (response.status === 202) {
          const userInfo = await response.json();
          localStorage.setItem('tempUserInfo', JSON.stringify(userInfo));
          router.push('/signup');
        } else {
          setError("로그인 처리 중 오류가 발생했습니다.");
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError("로그인 처리 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [router, checkAuth]);

  if (isLoading) {
    return <div>구글 로그인 처리 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return <div>로그인 처리 중...</div>;
}
