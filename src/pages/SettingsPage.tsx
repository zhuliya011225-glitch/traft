import React from 'react';
import { motion } from 'motion/react';
import { 
  Key, 
  Settings, 
  Bell, 
  Lock, 
  Globe, 
  Eye, 
  HelpCircle, 
  ShieldCheck,
  User,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage({ triggerToast }: { triggerToast: (m: string) => void }) {
  const sections = [
    {
      title: '接入设置',
      icon: Key,
      items: [
        { label: 'Gemini API Key', value: '已配置 (********)', status: 'ready' },
        { label: '小红书助手接入', value: '未绑定', status: 'pending' },
        { label: '抖音数据回传Token', value: '已过期', status: 'error' },
      ]
    },
    {
      title: '个性化偏好',
      icon: User,
      items: [
        { label: '内容创作风格', value: '干货深度', status: 'ready' },
        { label: '默认画像匹配', value: '高认知打工人', status: 'ready' },
        { label: 'AI 生成语言', value: '中文 (简体)', status: 'ready' },
      ]
    },
    {
      title: '账户与安全',
      icon: Lock,
      items: [
        { label: '隐私保护模式', value: '已开启', status: 'ready' },
        { label: '二步验证 (2FA)', value: '建议开启以增强安全性', status: 'pending' },
        { label: '账号关联状态', value: 'Google 已关联', status: 'ready' },
      ]
    },
    {
      title: '高级实验室',
      icon: Zap,
      items: [
        { label: 'Beta 渲染引擎', value: '采用全新的 GPU 加速预览', status: 'ready' },
        { label: '多模型协同共创', value: '开启后将调用多模型交叉验证结果', status: 'pending' },
      ]
    }
  ];

  const usageStats = [
    { label: 'API 调用额度', value: '84%', sub: '2,541 / 3,000 次' },
    { label: '云端存储空间', value: '12%', sub: '124MB / 1GB' },
    { label: '多平台发文数', value: '42', sub: '本月累计' },
  ];

  return (
    <div className="space-y-10 pb-12 h-full pt-4">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-semibold mb-3 tracking-tight flex items-center gap-4 text-text">
            <Settings className="text-primary" /> 配置中心
          </h1>
          <p className="text-text-muted font-normal">管理您的 AI 创作偏好、接入密钥与数据安全性</p>
        </div>
        <div className="flex gap-4">
          {usageStats.map(stat => (
            <div key={stat.label} className="p-4 apple-card min-w-[140px]">
              <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-base font-semibold text-text tracking-tight">{stat.value}</p>
              <p className="text-base font-normal text-text-muted mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid gap-12">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-semibold uppercase tracking-[0.25em] text-text-muted flex items-center gap-2 mb-6">
              <section.icon size={14} className="text-primary" />
              {section.title}
            </h2>
            
            <div className="grid gap-4">
              {section.items.map((item) => (
                <div 
                  key={item.label}
                  className="apple-card p-8 flex items-center justify-between group hover:border-primary/40 transition-all press"
                >
                  <div className="space-y-2">
                    <p className="text-base font-normal text-text-secondary tracking-tight">{item.label}</p>
                    <p className="text-base text-text-muted font-semibold mono uppercase tracking-widest">{item.value}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    {item.status === 'ready' && (
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                         <CheckCircle2 size={12} className="text-emerald-500" />
                         <span className="text-base font-semibold text-emerald-500 uppercase tracking-widest">Active</span>
                       </div>
                    )}
                    {item.status === 'error' && (
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100 animate-pulse dark:bg-red-900/20 dark:border-red-800/30">
                         <Zap size={12} className="text-red-500" />
                         <span className="text-base font-semibold text-red-500 uppercase tracking-widest">Error</span>
                       </div>
                    )}
                    {item.status === 'pending' && <HelpCircle size={18} className="text-text-muted" />}
                    <button 
                       onClick={() => triggerToast(`正在修改: ${item.label}`)}
                       className="px-6 py-3 bg-text hover:bg-text-secondary text-base font-semibold text-bg rounded-xl transition-all uppercase tracking-widest press"
                    >
                      修改
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="pt-12 border-t border-border-custom/20 space-y-6">
           <div className="apple-card p-8 flex items-center justify-between">
              <div className="flex gap-6 items-center">
                 <div className="w-14 h-14 rounded-2xl bg-bg border border-border-custom/20 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h3 className="font-normal text-text text-xl tracking-tight">数据合规性声明</h3>
                    <p className="text-base text-text-muted font-normal">所有生成内容均通过 AI 内容安全审查模块过滤</p>
                 </div>
              </div>
              <button className="text-sm font-semibold text-emerald-500 uppercase tracking-widest hover:underline px-6 press">详情</button>
           </div>
           
           <div className="flex justify-center gap-10 py-6">
              {['帮助中心', '服务协议', '隐私政策', '关于系统 v1.0.4'].map(link => (
                <button key={link} className="text-sm text-text-muted hover:text-text-secondary transition-colors uppercase tracking-[0.2em] font-semibold press">
                  {link}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
