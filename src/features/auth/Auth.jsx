import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LogIn,
  UserPlus,
  User,
  Lock,
  AtSign,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'register');
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Họ và tên không được để trống';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const success = await login(formData.username, formData.password);
        if (success) navigate('/dashboard');
      } else {
        const success = await register(formData.name, formData.username, formData.password);
        if (success) navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-cyan-500/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        {/* Logo */}
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-accent-500/30 group-hover:scale-105 transition-transform">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              TodoPro
            </span>
          </button>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md">
          <h2
            className="text-4xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Biến ý tưởng thành
            <br />
            <span className="text-gradient">hành động.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Quản lý công việc trực quan với bảng Kanban, kéo thả linh hoạt và khả năng hoàn tác tức thì.
            Mọi thứ bạn cần, ngay tầm tay.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-sm text-slate-500">Miễn phí</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-slate-500">Trạng thái Kanban</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">∞</p>
            <p className="text-sm text-slate-500">Workspace</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Back Button (mobile) */}
          <button
            onClick={() => navigate('/')}
            className="btn-ghost text-sm mb-8 -ml-2"
          >
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h1>
            <p className="text-slate-400">
              {isLogin
                ? 'Đăng nhập để tiếp tục quản lý công việc của bạn.'
                : 'Đăng ký miễn phí để bắt đầu sắp xếp công việc.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Register only) */}
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    className={`input-field ${errors.name ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-rose-400 text-xs mt-1.5">{errors.name}</p>}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Tên đăng nhập</label>
              <div className="relative">
                <AtSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  className={`input-field ${errors.username ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: null });
                  }}
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="text-rose-400 text-xs mt-1.5">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field !pr-12 ${errors.password ? '!border-rose-500/50 focus:!ring-rose-500/20' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Đăng nhập
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Đăng ký
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', username: '', password: '' });
                  setErrors({});
                }}
                className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
