import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Copy, 
  ExternalLink, 
  Smartphone,
  CheckCircle2,
  Edit3,
  LogOut,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function ProfilePage({ onBack, onSubscribe, triggerToast }: { onBack: () => void, onSubscribe: () => void, triggerToast: (m: string) => void }) {
  const [username, setUsername] = useState('用户0501');
  const [isEditing, setIsEditing] = useState(false);

  const GuestAvatar = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 1024 1024" className={cn("w-full h-full", className)} xmlns="http://www.w3.org/2000/svg">
      <path d="M510.848 20.16a272 272 0 0 1 0 544l10.56-0.128a32.128 32.128 0 0 1-6.208 0.64 416 416 0 0 0-416 416 32 32 0 1 1-64 0 480.192 480.192 0 0 1 332.672-457.024A272 272 0 0 1 510.848 20.16zM928 864a32 32 0 1 1 0 64h-384a32 32 0 1 1 0-64h384z m0-160a32 32 0 1 1 0 64h-192a32 32 0 1 1 0-64h192zM510.848 84.16a208 208 0 1 0 0 416 208 208 0 0 0 0-416z" fill="currentColor"></path>
    </svg>
  );

  const profileData = [
    { label: '用户ID', value: 'guest_7f3d9a2c', action: '复制', onAction: () => triggerToast('ID已复制') },
    { label: '注册方式', value: '临时体验 (未绑定社交账号)', action: '绑定微信/QQ', onAction: () => triggerToast('请先完成身份验证') },
    { label: '剩余体验次数', value: '42 次 (总计 50 次/月)', action: '升级为正式用户', onAction: () => triggerToast('跳转支付中心...') },
    { label: '账户有效期', value: '2026-05-30 (30天体验期)', action: '延长有效期', onAction: () => triggerToast('跳转续费中心...') },
    { label: '关联平台', value: '未绑定任何平台', action: '去绑定 (抖音/小红书/B站)', onAction: () => triggerToast('跳转跳转授权页面...') },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 pt-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-8 group press"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-normal text-base tracking-tight">返回工作台</span>
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative group cursor-pointer" onClick={() => triggerToast('功能暂未开放')}>
          <div className="w-32 h-32 rounded-2xl bg-bg flex items-center justify-center text-accent border-4 border-card overflow-hidden">
             <GuestAvatar className="p-4" />
          </div>
          <div className="absolute inset-0 bg-text/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Edit3 className="text-bg" size={24} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="text-base font-semibold text-text border-b-2 border-primary bg-transparent text-center focus:outline-none"
              />
            ) : (
              <h1 className="text-5xl font-semibold text-text tracking-tight">{username}</h1>
            )}
            <button onClick={() => setIsEditing(!isEditing)} className="text-text-muted hover:text-primary press">
              <Edit3 size={18} />
            </button>
          </div>
          <span className="px-3 py-1 bg-bg text-text-muted rounded-full text-sm font-semibold uppercase tracking-widest">
            体验者
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="apple-card overflow-hidden mb-12">
        <div className="grid divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10">
          {profileData.map((item) => (
            <div key={item.label} className="grid grid-cols-1 md:grid-cols-3 p-6 items-center">
              <span className="text-base font-semibold text-text-muted uppercase tracking-widest">{item.label}</span>
              <span className="text-base font-normal text-text-secondary truncate md:col-span-1">{item.value}</span>
              <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                <button 
                  onClick={item.onAction}
                  className="text-sm font-semibold text-primary hover:underline uppercase tracking-tighter press"
                >
                  {item.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          disabled={username === '用户0501' && !isEditing}
          onClick={() => { triggerToast('修改已保存'); setIsEditing(false); }}
          className={cn(
            "flex-1 py-5 rounded-2xl font-semibold text-base uppercase tracking-widest transition-all press",
            username !== '用户0501'
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-bg text-text-muted cursor-not-allowed"
          )}
        >
          保存修改
        </button>
        <button 
          onClick={onSubscribe}
          className="flex-[1.5] py-5 bg-primary text-white rounded-2xl font-semibold text-sm uppercase tracking-widest hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 press"
        >
          订阅
        </button>
      </div>
    </div>
  );
}
