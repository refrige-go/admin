"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Google Cloud Console 설정과 일치하는 리디렉션 URI 사용
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const redirectUri = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login/google/callback`;
    const scope = "openid email profile";
    const responseType = "code";
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    // 디버깅용 로그
    console.log("Google OAuth URL:", oauthUrl);
    console.log("Client ID:", clientId);
    console.log("Backend URL:", backendUrl);
    console.log("Redirect URI:", redirectUri);
    
    window.location.href = oauthUrl;
  }, []);

  return <div>구글 로그인 중...</div>;
} 