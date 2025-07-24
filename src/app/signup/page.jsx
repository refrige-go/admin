"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tempUserInfo, setTempUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    nickname: "",
    gender: "M",
    birth: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = searchParams.get('email');
    const provider = searchParams.get('provider');
    const providerId = searchParams.get('providerId');

    if (!email || !provider || !providerId) {
      router.push('/login');
      return;
    }

    setTempUserInfo({
      email: decodeURIComponent(email),
      provider: decodeURIComponent(provider),
      providerId: decodeURIComponent(providerId)
    });
  }, [router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: tempUserInfo?.email,
          provider: tempUserInfo?.provider,
          providerId: tempUserInfo?.providerId,
          nickname: formData.nickname,
          gender: formData.gender,
          birth: formData.birth
        })
      });

      if (response.ok) {
        const tokenData = await response.json();
        localStorage.setItem('auth_token', tokenData.token.accessToken);
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!tempUserInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            추가 정보 입력
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {tempUserInfo.email}로 로그인하셨습니다.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nickname" className="sr-only">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="닉네임"
                value={formData.nickname}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="gender" className="sr-only">성별</label>
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
            </div>
            <div>
              <label htmlFor="birth" className="sr-only">생년월일</label>
              <input
                id="birth"
                name="birth"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.birth}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "처리 중..." : "회원가입 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
