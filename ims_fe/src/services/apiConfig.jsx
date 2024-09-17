import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Thêm interceptor để xử lý JWT
api.interceptors.request.use(
    (config) => {
      // Lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
      const token = localStorage.getItem('token');
      if (token) {
        // Thêm token vào header của request
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response (tùy chọn)
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Xử lý khi token hết hạn, ví dụ: đăng xuất người dùng
        localStorage.removeItem('token');
        // Chuyển hướng đến trang đăng nhập
        window.location = '/login';
      }
      return Promise.reject(error);
    }
);

export default api;