/**
 * Design Reference: Apple Design Resources
 * https://developer.apple.com/design/
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Settings,
  LogOut,
  Shield,
  UserCheck,
  Moon,
  Sun,
} from 'lucide-react';
import { PageId, User, NavigationData } from './types';
import { cn } from './lib/utils';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TrendAnalysis from './pages/TrendAnalysis';
import ScriptWorkshop from './pages/ScriptWorkshop';
import DistributionOpt from './pages/DistributionOpt';
import GrowthAnalysis from './pages/GrowthAnalysis';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SecurityPage from './pages/SecurityPage';
import PricingOverlay from './components/PricingOverlay';

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('traft-theme');
    if (stored) return stored === 'dark';
    return false; // default to light mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('traft-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('traft-theme')) setIsDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { isDark, toggle: () => setIsDark(v => !v) };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showToast, setShowToast] = useState<{message: string, visible: boolean}>({message: '', visible: false});
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { isDark, toggle } = useTheme();

  const handleLogin = (userInfo: User) => {
    const identifiedUser = { ...userInfo, name: '用户0501' };
    setUser(identifiedUser);
    setIsAuthenticated(true);
    triggerToast("欢迎回来 " + identifiedUser.name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const navigateTo = (page: PageId, data?: NavigationData) => {
    setNavigationData(data || null);
    setCurrentPage(page);
  };

  const triggerToast = (message: string) => {
    setShowToast({ message, visible: true });
    setTimeout(() => setShowToast({ message: '', visible: false }), 3000);
  };

  const renderPage = (page: PageId, toast: (m: string) => void) => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={navigateTo} triggerToast={toast} />;
      case 'trend': return <TrendAnalysis triggerToast={toast} onNavigate={navigateTo} selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />;
      case 'workshop': return <ScriptWorkshop triggerToast={toast} initialData={navigationData} onClearInitialData={() => setNavigationData(null)} onNavigate={navigateTo} selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />;
      case 'distribution': return <DistributionOpt triggerToast={toast} selectedPlatform={selectedPlatform} />;
      case 'growth': return <GrowthAnalysis triggerToast={toast} />;
      case 'settings': return <SettingsPage triggerToast={toast} />;
      case 'profile': return <ProfilePage onBack={() => navigateTo('dashboard')} onSubscribe={() => setShowPricing(true)} triggerToast={toast} />;
      case 'security': return <SecurityPage onBack={() => navigateTo('dashboard')} triggerToast={toast} />;
      default: return <Dashboard onNavigate={navigateTo} triggerToast={toast} />;
    }
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden relative">
      {/* Sidebar — Liquid Glass */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onReturnToLanding={() => setIsAuthenticated(false)}
        user={user}
        triggerToast={triggerToast}
        isDark={isDark}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar with theme toggle */}
        <header className="h-14 flex items-center justify-end px-6 shrink-0">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl glass text-text-secondary hover:bg-hover-accent transition-all press"
            aria-label="切换深色模式"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={16} />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-6 scroll-smooth custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[1280px] mx-auto h-full"
            >
              {renderPage(currentPage, triggerToast)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast — Liquid Glass */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center glass text-text pl-3 pr-5 py-3 rounded-2xl shadow-2xl z-50"
          >
            <div className="w-1 h-6 bg-primary rounded-full mr-3" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 500 }}
              className="mr-2.5 flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full"
            >
              <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
              </svg>
            </motion.div>
            <span className="text-sm font-semibold">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PricingOverlay isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}

const GuestAvatar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1024 1024" className={cn("w-full h-full", className)} xmlns="http://www.w3.org/2000/svg">
    <path d="M510.848 20.16a272 272 0 0 1 0 544l10.56-0.128a32.128 32.128 0 0 1-6.208 0.64 416 416 0 0 0-416 416 32 32 0 1 1-64 0 480.192 480.192 0 0 1 332.672-457.024A272 272 0 0 1 510.848 20.16zM928 864a32 32 0 1 1 0 64h-384a32 32 0 1 1 0-64h384z m0-160a32 32 0 1 1 0 64h-192a32 32 0 1 1 0-64h192zM510.848 84.16a208 208 0 1 0 0 416 208 208 0 0 0 0-416z" fill="currentColor"></path>
  </svg>
);

function Sidebar({ currentPage, onNavigate, onReturnToLanding, user, triggerToast, isDark }: { currentPage: PageId, onNavigate: (page: PageId) => void, onReturnToLanding: () => void, user: User | null, triggerToast: (m: string) => void, isDark: boolean }) {
  const [showUserPopover, setShowUserPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowUserPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: '工作台' },
    { id: 'trend', label: '热点选题' },
    { id: 'workshop', label: '内容创作' },
    { id: 'distribution', label: '发布优化' },
    { id: 'growth', label: '增长分析' },
  ];

  return (
    <aside className="w-52 border-r border-border-custom/20 glass flex flex-col shrink-0">
      <div
        className="px-5 h-14 flex items-center border-b border-border-custom/20 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onReturnToLanding}
      >
        <span className="text-xl font-semibold tracking-tight text-text">Traft</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as PageId)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all press",
              currentPage === item.id
                ? "bg-primary text-white shadow-md"
                : "text-text-secondary hover:bg-hover-accent hover:text-text"
            )}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border-custom/20 space-y-3">
        <div className="px-1 space-y-1">
          <button
            onClick={() => onNavigate('settings')}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group text-sm font-medium",
              currentPage === 'settings' ? "bg-hover-accent text-text" : "text-text-secondary hover:bg-hover-accent hover:text-text"
            )}
          >
            <div className="flex items-center gap-3">
              <Settings size={16} />
              <span>偏好设置</span>
            </div>
          </button>

          <div className="relative" ref={popoverRef}>
            <button
               onClick={() => setShowUserPopover(!showUserPopover)}
               className={cn(
                 "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border text-left",
                 showUserPopover ? "border-primary bg-primary/10" : "bg-transparent border-border-custom/20 hover:border-border-custom/40"
               )}
            >
              <div className="h-9 w-9 rounded-lg bg-bg flex items-center justify-center text-accent shadow-sm shrink-0 border border-border-custom/20">
                 <GuestAvatar className="p-1.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text truncate">{user?.name || '用户0501'}</p>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-success" />
                  <p className="text-xs font-medium text-text-muted">Pro Creator</p>
                </div>
              </div>
              <LogOut size={12} className="text-text-muted" />
            </button>

            <AnimatePresence>
              {showUserPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 mb-3 w-56 glass border border-border-custom/30 rounded-2xl shadow-2xl overflow-hidden p-3 z-50 text-text"
                >
                  <div className="space-y-1">
                    <div className="px-3 py-2.5 mb-1 bg-bg/50 flex items-center gap-3 rounded-xl border border-border-custom/20">
                      <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-accent shadow-sm border border-border-custom/20">
                        <GuestAvatar className="p-1.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text tracking-tight">{user?.name || '用户0501'}</p>
                        <p className="text-xs font-medium text-success mt-0.5">活跃指数: 98%</p>
                      </div>
                    </div>

                    <MenuAction
                      icon={Shield}
                      label="安全中心"
                      onClick={() => {
                        setShowUserPopover(false);
                        onNavigate('security');
                      }}
                      description="保护您的账户与隐私数据"
                    />
                    <MenuAction
                      icon={UserCheck}
                      label="个人资料"
                      onClick={() => {
                        setShowUserPopover(false);
                        onNavigate('profile');
                      }}
                      description="更新个人简介与作品集"
                    />

                    <div className="h-px bg-border-custom/20 my-1 mx-2" />

                    <MenuAction
                      icon={LogOut}
                      label={user ? "退出系统" : "返回首页"}
                      onClick={() => onReturnToLanding()}
                      className="text-error hover:bg-error/10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass p-3 rounded-xl text-xs text-text-muted border border-border-custom/20">
          <p className="font-medium text-text-secondary">灵感成稿，增长有道</p>
          <p className="mt-1 opacity-60 mono tracking-tighter font-semibold">From Spark to Chart.</p>
        </div>
      </div>
    </aside>
  );
}

function MenuAction({ icon: Icon, label, onClick, className, description }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-2 rounded-xl text-sm transition-all group press",
        className ? className : "text-text-secondary hover:bg-hover-accent hover:text-text"
      )}
    >
      <div className="mt-0.5">
        <Icon size={15} />
      </div>
      <div className="text-left">
        <p className="font-medium leading-none">{label}</p>
        {description && <p className="text-xs font-medium text-text-muted mt-1">{description}</p>}
      </div>
    </button>
  );
}
