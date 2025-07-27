"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NaverLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Naver OAuth 설정과 일치하는 리디렉션 URI 사용
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const redirectUri = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login/naver/callback`;
    const state = Math.random().toString(36).substring(2, 15); // CSRF 방지용
    const responseType = "code";
    const oauthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    
    // 디버깅용 로그
    console.log("Naver OAuth URL:", oauthUrl);
    console.log("Client ID:", clientId);
    console.log("Backend URL:", backendUrl);
    console.log("Redirect URI:", redirectUri);
    
    window.location.href = oauthUrl;
  }, []);

  return <div>네이버 로그인 중...</div>;
} 