import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://todobackend-vim4.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Tiếng Việt Error Mapping
const ErrorMessages = {
    'SYS-2000': 'Thao tác thành công',
    'AUTH-4010': 'Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
    'AUTH-4011': 'Sai tên đăng nhập hoặc mật khẩu.',
    'AUTH-4041': 'Không tìm thấy thông tin tài khoản.',
    'AUTH-4090': 'Tên đăng nhập đã tồn tại.',
    'SPACE-4040': 'Không tìm thấy không gian làm việc.',
    'SPACE-4030': 'Bạn không có quyền truy cập không gian làm việc này.',
    'TASK-4040': 'Không tìm thấy công việc yêu cầu.',
    'TASK-4001': 'Công việc không thuộc không gian làm việc này.',
    'SYS-4000': 'Dữ liệu không hợp lệ.',
    'SYS-5000': 'Đã xảy ra lỗi hệ thống bất ngờ.'
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        const { success, data, message, code } = response.data;
        if (success) {
            return data;
        } else {
            const errorMsg = ErrorMessages[code] || message || 'Đã xảy ra lỗi không xác định.';
            toast.error(errorMsg);
            return Promise.reject(new Error(errorMsg));
        }
    },
    (error) => {
        if (error.response && error.response.data) {
            const { code, message } = error.response.data;
            const errorMsg = ErrorMessages[code] || message || 'Đã xảy ra lỗi máy chủ.';
            toast.error(errorMsg);

            if (code === 'AUTH-4010' || error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error.response.data);
        }
        toast.error('Không thể kết nối đến máy chủ.');
        return Promise.reject(error);
    }
);

export default api;
