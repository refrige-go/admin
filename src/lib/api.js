import { API_BASE_URL, STATUS_CODES } from './constants';

/**
 * API 요청을 위한 기본 설정
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// 토큰 재발급 함수
const refreshToken = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reissue`, {
      method: "POST",
      credentials: "include",
    });
    
    if (response.ok) {
      const authHeader = response.headers.get("Authorization");
      const newAccessToken = authHeader.replace("Bearer ", "");
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    window.location.href = "/login";
  }
};

/**
 * API 요청을 처리하는 기본 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} API 응답
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: defaultHeaders,
    ...options,
  };

  // FormData인 경우 Content-Type을 자동으로 설정하도록 헤더 제거
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  // 인증 토큰이 있다면 헤더에 추가
  const token = localStorage.getItem('accessToken');
  console.log('인증 토큰 확인:', token);
  console.log('현재 요청 URL:', url);
  console.log('요청 헤더:', config.headers);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('인증 토큰이 없습니다. 백엔드에서 인증을 요구할 수 있습니다.');
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // 토큰 만료 처리
      if (response.status === 401) {
        try {
          const errorData = await response.json();
          if (errorData.code === 'TOKEN_EXPIRED') {
            console.log('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
        } catch (e) {
          // JSON 파싱 실패 시에도 로그인 페이지로 이동
          console.log('인증 오류. 로그인 페이지로 이동합니다.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답이 JSON이 아닐 수 있으므로 확인
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET 요청
 * @param {string} endpoint - API 엔드포인트
 * @returns {Promise} API 응답
 */
export function apiGet(endpoint) {
  return apiRequest(endpoint, {
    method: 'GET',
  });
}

/**
 * POST 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 전송할 데이터
 * @returns {Promise} API 응답
 */
export function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 전송할 데이터
 * @returns {Promise} API 응답
 */
export function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 * @param {string} endpoint - API 엔드포인트
 * @returns {Promise} API 응답
 */
export function apiDelete(endpoint) {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
}

// 특정 API 엔드포인트들
export const authAPI = {
  login: (credentials) => apiPost('/auth/login', credentials),
  logout: () => apiPost('/auth/logout'),
  register: (userData) => apiPost('/auth/register', userData),
  getProfile: () => apiGet('/user/me'),
};

// 인증 헤더 가져오기 함수
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');

  console.log('=== getAuthHeaders 호출 ===');
  console.log('저장된 토큰:', token);
  
  let cleanToken = token;
  if (token && token.startsWith('Bearer ')) {
    cleanToken = token.substring(7);
    console.log('Bearer 제거 후:', cleanToken);
  }
  
  // 제어 문자 제거
  cleanToken = cleanToken ? 
    cleanToken.trim()
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/\s+/g, '')
    : '';
  
  console.log('최종 정리된 토큰:', cleanToken);
  
  return {
    'Content-Type': 'application/json',
    'Authorization': cleanToken ? `Bearer ${cleanToken}` : '',
  };
};

export const dashboardAPI = {
  getStats: () => apiGet('/dashboard/stats'),
  getRecentActivity: () => apiGet('/dashboard/activity'),
};

export const usersAPI = {
  getUsers: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
          headers: getAuthHeaders(),
        });
        return retryResponse.json();
      }
      throw new Error("사용자 데이터를 불러오는데 실패했습니다.");
    }
    return response.json();
  },
  
  getUser: async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
          headers: getAuthHeaders(),
        });
        return retryResponse.json();
      }
      throw new Error("사용자 정보를 불러오는데 실패했습니다.");
    }
    return response.json();
  },
  
  updateUser: async (id, userData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        });
        return retryResponse.json();
      }
      throw new Error("사용자 정보 수정에 실패했습니다.");
    }
    return response.json();
  },
  
  deleteUser: async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        await refreshToken();
        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        return retryResponse.json();
      }
      throw new Error("사용자 삭제에 실패했습니다.");
    }
    return response.json();
  },
};

export const noticeAPI = {
  getNotices: ({ status = "PUBLISHED" } = {}) => apiGet(`/api/notice?status=${status}`),
  getNotice: (id) => apiGet(`/api/notice/${id}`),
  createNotice: async ({ category, title, content, images }) => {
    const formData = new FormData();
    const requestDto = JSON.stringify({ category, title, content });
    formData.append('requestDto', new Blob([requestDto], { type: 'application/json' }));
    if (images && images.length > 0) {
      images.forEach((file) => formData.append('images', file));
    }
    return apiRequest('/api/notice/create', {
      method: 'POST',
      body: formData,
    });
  },
  updateNotice: async ({ id, category, title, content, deleteImageIds, newImages }) => {
    const formData = new FormData();
    const requestDto = JSON.stringify({ category, title, content, deleteImageIds });
    formData.append('requestDto', new Blob([requestDto], { type: 'application/json' }));
    if (newImages && newImages.length > 0) {
      newImages.forEach((file) => formData.append('newImages', file));
    }
    return apiRequest(`/api/notice/${id}/post`, {
      method: 'PATCH',
      body: formData,
    });
  },
  deleteNotice: (id) => apiRequest(`/api/notice/${id}/status`, { method: 'PATCH' }),
};

export const inquiryAPI = {
  getInquiries: () => apiGet('/api/inquiry'),
  getInquiry: (id) => apiGet(`/api/inquiry/${id}`),
  createAnswer: (inquiryId, answerContent) => apiPost(`/api/inquiry/${inquiryId}/answer`, { comment: answerContent }),
};

//식재료 관리 API
export const ingredientsAPI = {
  // 전체 식재료 조회 (기존 API 활용)
  getIngredients: (category = null) => {
    const url = category 
      ? `/api/ingredients?category=${category}` 
      : `/api/ingredients`;
    return apiGet(url);
  },

  // 특정 식재료 조회
  getIngredient: (id) => {
    return apiGet(`/api/ingredients/${id}`);  
  },

  // 식재료 등록
  createIngredient: (data) => {
    return apiPost(`/api/ingredients`, data);  
  },

  // 식재료 수정
  updateIngredient: (id, data) => {
    return apiPut(`/api/ingredients/${id}`, data);  
  },

  // 식재료 삭제
  deleteIngredient: (id) => {
    return apiDelete(`/api/ingredients/${id}`); 
  },

  // 카테고리 목록 조회
  getCategories: () => {
    return apiGet(`/api/ingredients/categories`);  
  }
};