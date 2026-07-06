import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Columns3,
  GripVertical,
  FolderKanban,
  Undo2,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen hero-gradient-bg overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-accent-500/30">
            <Sparkles size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            TodoPro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn-ghost text-sm px-4 py-2"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate('/login?mode=register')}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Đăng ký miễn phí
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-slate-300 mb-8 animate-fade-in-up">
          <Zap size={14} className="text-amber-400" />
          <span>Công cụ quản lý công việc thông minh</span>
        </div>

        {/* Main Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', animationDelay: '0.1s' }}
        >
          <span className="text-white">Quản lý công việc</span>
          <br />
          <span className="text-gradient">đơn giản & hiệu quả</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Sắp xếp công việc theo bảng Kanban trực quan, kéo thả dễ dàng,
          hoàn tác tức thì. Tất cả trong một giao diện đẹp mắt và mượt mà.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={() => navigate('/login?mode=register')}
            className="btn-primary text-base px-8 py-3.5 rounded-2xl"
          >
            Bắt đầu ngay — Miễn phí
            <ArrowRight size={18} />
          </button>
          <a
            href="#features"
            className="btn-secondary text-base px-8 py-3.5 rounded-2xl"
          >
            Tìm hiểu thêm
            <ChevronRight size={18} />
          </a>
        </div>

        {/* Floating Preview Mockup */}
        <div
          className="mt-16 md:mt-20 relative animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
          <div className="glass rounded-2xl p-4 md:p-6 shadow-2xl shadow-accent-500/10">
            {/* Fake Kanban Preview */}
            <div className="flex gap-4 overflow-hidden">
              {/* TODO Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-sm font-semibold text-slate-300">Chuẩn bị làm</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full ml-auto">3</span>
                </div>
                <div className="space-y-2.5">
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none">
                    <p className="text-sm font-medium text-slate-200">Thiết kế giao diện dashboard</p>
                    <p className="text-xs text-slate-500 mt-1.5">Ưu tiên cao</p>
                  </div>
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none">
                    <p className="text-sm font-medium text-slate-200">Viết tài liệu API</p>
                    <p className="text-xs text-slate-500 mt-1.5">Ưu tiên trung bình</p>
                  </div>
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none">
                    <p className="text-sm font-medium text-slate-200">Chuẩn bị demo cho khách hàng</p>
                    <p className="text-xs text-slate-500 mt-1.5">Ưu tiên cao</p>
                  </div>
                </div>
              </div>
              {/* IN PROGRESS Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-sm font-semibold text-slate-300">Đang làm</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ml-auto">2</span>
                </div>
                <div className="space-y-2.5">
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none border-l-2 !border-l-blue-400">
                    <p className="text-sm font-medium text-slate-200">Phát triển tính năng đăng nhập</p>
                    <p className="text-xs text-slate-500 mt-1.5">Đang tiến hành</p>
                  </div>
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none border-l-2 !border-l-blue-400">
                    <p className="text-sm font-medium text-slate-200">Tối ưu hiệu suất trang chủ</p>
                    <p className="text-xs text-slate-500 mt-1.5">Đang tiến hành</p>
                  </div>
                </div>
              </div>
              {/* DONE Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-slate-300">Đã xong</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-auto">4</span>
                </div>
                <div className="space-y-2.5">
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none border-l-2 !border-l-emerald-400 opacity-80">
                    <p className="text-sm font-medium text-slate-300 line-through">Cài đặt cơ sở dữ liệu</p>
                    <p className="text-xs text-slate-500 mt-1.5">Hoàn thành</p>
                  </div>
                  <div className="glass-card p-3 !rounded-xl cursor-default hover:!transform-none border-l-2 !border-l-emerald-400 opacity-80">
                    <p className="text-sm font-medium text-slate-300 line-through">Thiết kế logo thương hiệu</p>
                    <p className="text-xs text-slate-500 mt-1.5">Hoàn thành</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Tính năng nổi bật
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Mọi thứ bạn cần để quản lý công việc hiệu quả, gọn gàng trong một nơi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {/* Feature 1 */}
          <div className="feature-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
              <Columns3 size={26} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Bảng Kanban</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Theo dõi tiến độ trực quan với 3 trạng thái rõ ràng: Chuẩn bị, Đang làm, Hoàn thành.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
              <GripVertical size={26} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Kéo & Thả</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Di chuyển công việc giữa các cột chỉ bằng thao tác kéo thả mượt mà, tức thì.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
              <FolderKanban size={26} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nhiều Workspace</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tạo nhiều không gian làm việc riêng biệt cho từng dự án hoặc lĩnh vực.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-500/5 flex items-center justify-center mx-auto mb-5 border border-accent-500/20">
              <Undo2 size={26} className="text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hoàn Tác Tức Thì</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Thao tác nhầm? Không sao, chỉ cần bấm hoàn tác để quay lại trạng thái trước.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-cyan-500/10 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <Shield size={20} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Miễn phí • Bảo mật • Dễ sử dụng</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Sẵn sàng tăng năng suất?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Tham gia ngay để trải nghiệm cách quản lý công việc hiện đại, trực quan và hoàn toàn miễn phí.
            </p>
            <button
              onClick={() => navigate('/login?mode=register')}
              className="btn-primary text-base px-10 py-4 rounded-2xl"
            >
              Tạo tài khoản miễn phí
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-slate-500 border-t border-slate-800/50">
        <p>© 2026 TodoPro — Xây dựng bởi ❤️ để giúp bạn làm việc hiệu quả hơn.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
