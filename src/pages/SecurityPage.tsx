import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Shield, 
  Lock, 
  Smartphone, 
  Layers, 
  Database,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Trash2,
  Download,
  Key,
  Eye,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type SecurityTab = 'security' | 'privacy' | 'devices' | 'apps' | 'data';

export default function SecurityPage({ onBack, triggerToast }: { onBack: () => void, triggerToast: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<SecurityTab>('security');

  const menuItems = [
    { id: 'security', label: '账户安全', icon: Shield },
    { id: 'privacy', label: '隐私数据', icon: Lock },
    { id: 'devices', label: '登录设备', icon: Monitor },
    { id: 'apps', label: '授权应用', icon: Layers },
    { id: 'data', label: '数据导出与删除', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 h-full flex flex-col pt-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-8 group shrink-0 press"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-normal text-base tracking-tight">返回工作台</span>
      </button>

      <div className="flex-1 flex gap-12 min-h-0">
        {/* Sidebar Navigation */}
        <aside className="w-64 space-y-2 shrink-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SecurityTab)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-normal text-base transition-all press",
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "text-text-muted hover:bg-hover-accent hover:text-text-secondary"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent(activeTab, triggerToast)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function renderContent(tab: SecurityTab, triggerToast: (m: string) => void) {
  switch (tab) {
    case 'security': return <SecuritySection triggerToast={triggerToast} />;
    case 'privacy': return <PrivacySection triggerToast={triggerToast} />;
    case 'devices': return <DevicesSection triggerToast={triggerToast} />;
    case 'apps': return <AppsSection />;
    case 'data': return <DataSection triggerToast={triggerToast} />;
  }
}

function SecuritySection({ triggerToast }: { triggerToast: (m: string) => void }) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">账户安全概览</h2>
        <div className="apple-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-1">当前安全等级</p>
              <h3 className="text-xl font-semibold text-amber-500">中</h3>
            </div>
            <div className="h-2 w-48 bg-bg rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-amber-500 rounded-full" />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl border border-border-custom/20">
               <AlertCircle className="text-amber-500" size={20} />
               <p className="text-base font-normal text-text-secondary">未绑定手机号，账户可能存在风险</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl border border-border-custom/20">
               <AlertCircle className="text-amber-500" size={20} />
               <p className="text-base font-normal text-text-secondary">未开启二次验证 (MFA)</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border-custom/15">
             <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-3">最近登录活动</p>
             <p className="text-base font-normal text-text-secondary">2025-11-28 09:34 <span className="mx-2 text-text-muted">|</span> IP: 123.123.123.123 <span className="mx-2 text-text-muted">|</span> Chrome on Windows</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">修改密码</h2>
        <div className="apple-card p-8 space-y-6">
           <p className="text-base font-normal text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30">
              提示：临时体验账号暂不支持修改密码，请绑定手机或邮箱后再试。
           </p>
           <div className="grid gap-6 opacity-40 pointer-events-none">
             <div className="space-y-2">
               <p className="text-base font-semibold text-text-muted uppercase tracking-widest">原密码</p>
               <input disabled type="password" placeholder="••••••••" className="w-full p-4 bg-bg rounded-2xl border border-border-custom/20" />
             </div>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <p className="text-base font-semibold text-text-muted uppercase tracking-widest">新密码</p>
                 <input disabled type="password" placeholder="请输入新密码" className="w-full p-4 bg-bg rounded-2xl border border-border-custom/20" />
               </div>
               <div className="space-y-2">
                 <p className="text-base font-semibold text-text-muted uppercase tracking-widest">确认新密码</p>
                 <input disabled type="password" placeholder="请再次确认新密码" className="w-full p-4 bg-bg rounded-2xl border border-border-custom/20" />
               </div>
             </div>
             <button disabled className="w-full py-4 bg-text-muted text-bg rounded-2xl font-semibold text-sm uppercase tracking-widest cursor-not-allowed">修改密码</button>
           </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">多因素认证 (MFA)</h2>
        <div className="apple-card p-8 flex items-center justify-between">
           <div>
              <h3 className="font-normal text-text">二次验证开关</h3>
              <p className="text-base text-text-muted mt-1">开启后，登录需通过手机或验证器进行二次身份校验</p>
           </div>
           <button 
             onClick={() => triggerToast('请先绑定手机号以开启MFA')}
             className="w-12 h-6 bg-bg rounded-full relative transition-colors border border-border-custom/20 press"
           >
             <div className="absolute top-1 left-1 w-4 h-4 bg-card rounded-full transition-transform" />
           </button>
        </div>
      </section>

      <section>
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-text">敏感操作记录</h2>
            <button className="text-sm font-semibold text-primary hover:underline uppercase tracking-widest press">查看全部记录</button>
         </div>
         <div className="apple-card bg-bg p-8 text-center">
            <p className="text-base font-normal text-text-muted tracking-tight">最近 7 天无重要/异常敏感操作记录</p>
         </div>
      </section>
    </div>
  );
}

function PrivacySection({ triggerToast }: { triggerToast: (m: string) => void }) {
  const [improveModel, setImproveModel] = useState(true);
  const [shareStats, setShareStats] = useState(false);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">数据处理说明</h2>
        <div className="grid gap-6">
          <div className="apple-card p-8 flex gap-6 items-start">
            <div className="p-3 bg-bg rounded-2xl text-primary"><Database size={24} /></div>
            <div>
              <h3 className="font-semibold text-text mb-2">Traft 存储原则</h3>
              <p className="text-lg text-text-secondary leading-relaxed font-normal">我们仅存储您生成的脚本内容与效果分析数据。任何原始素材或上传文件将在处理完成后立即从服务器中清除。</p>
            </div>
          </div>
          <div className="apple-card p-8 flex gap-6 items-start">
            <div className="p-3 bg-bg rounded-2xl text-emerald-500"><Key size={24} /></div>
            <div>
              <h3 className="font-semibold text-text mb-2">数据匿名化</h3>
              <p className="text-lg text-text-secondary leading-relaxed font-normal">所有的流量分析报告均会在脱敏后进行聚合，不包含任何指向个人身份的信息（PII）。</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">隐私偏好设置</h2>
        <div className="apple-card divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10 overflow-hidden">
           <div className="p-8 flex items-center justify-between hover:bg-hover-accent transition-colors cursor-pointer press" onClick={() => setImproveModel(!improveModel)}>
              <div className="max-w-md">
                <h3 className="font-normal text-text mb-1">允许使用我的数据改进模型</h3>
                <p className="text-base text-text-muted">我们将使用您的匿名创作数据来训练更懂中国创作者的 AI 后台</p>
              </div>
              <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", improveModel ? "bg-primary border-primary text-text" : "border-border-custom/30")}>
                {improveModel && <CheckCircle2 size={16} />}
              </div>
           </div>
           <div className="p-8 flex items-center justify-between hover:bg-hover-accent transition-colors cursor-pointer press" onClick={() => setShareStats(!shareStats)}>
              <div className="max-w-md">
                <h3 className="font-normal text-text mb-1">允许向合作方分享脱敏统计信息</h3>
                <p className="text-base text-text-muted">分享行业趋势分析图表，不包含您的具体作品或账号信息</p>
              </div>
              <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all", shareStats ? "bg-primary border-primary text-text" : "border-border-custom/30")}>
                {shareStats && <CheckCircle2 size={16} />}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function DevicesSection({ triggerToast }: { triggerToast: (m: string) => void }) {
  const devices = [
    { name: 'Chrome on Windows', location: '北京, 中国', time: '当前设备', current: true },
    { name: 'Safari on iPhone 15 Pro', location: '上海, 中国', time: '2025-11-27 18:22', current: false },
    { name: 'Firefox on Mac OS', location: '广州, 中国', time: '2025-11-20 10:15', current: false },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-text">当前已登录设备</h2>
        <button 
          onClick={() => triggerToast('已下线其他 2 个设备')}
          className="text-base font-semibold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest press dark:hover:bg-red-900/20"
        >
          下线其他设备
        </button>
      </div>
      <div className="grid gap-4">
        {devices.map((device, i) => (
          <div key={i} className="apple-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center text-text-muted">
                  <Monitor size={24} />
               </div>
               <div>
                  <h3 className="font-normal text-text flex items-center gap-2">
                    {device.name}
                    {device.current && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-semibold rounded-lg uppercase tracking-tighter dark:bg-emerald-900/20">当前</span>}
                  </h3>
                  <p className="text-base text-text-muted mt-1">{device.location} • {device.time}</p>
               </div>
            </div>
            {!device.current && (
              <button 
                onClick={() => triggerToast(`设备 ${device.name} 已强制登出`)}
                className="p-3 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all press dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function AppsSection() {
  return (
    <section>
      <h2 className="text-3xl font-semibold text-text mb-8">三方应用授权</h2>
      <div className="apple-card flex flex-col items-center justify-center text-center py-16 px-6">
         <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mb-5 text-text-muted">
            <Share2 size={28} />
         </div>
         <h3 className="text-xl font-normal text-text mb-1">暂无已授权的三方应用</h3>
         <p className="text-lg text-text-secondary max-w-sm leading-relaxed">
           未来您可以将您的抖音、小红书账号授权给 Traft，实现 AI 辅助直接一键发布与多平台分发。
         </p>
      </div>
    </section>
  );
}

function DataSection({ triggerToast }: { triggerToast: (m: string) => void }) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-semibold text-text mb-6">数据管理</h2>
        <div className="grid md:grid-cols-2 gap-6">
           <div className="apple-card p-8 flex flex-col justify-between h-[240px]">
              <div>
                <h3 className="font-semibold text-text mb-3">导出所有数据</h3>
                <p className="text-lg text-text-muted leading-relaxed">包括您的脚本记录、分析偏好、历史流量报告等。支持 JSON 与 CSV 格式。</p>
              </div>
              <button 
                onClick={() => triggerToast('数据正在打包中，完成后将通过系统通知提醒您')}
                className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-base uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all press"
              >
                <Download size={18} /> 开始导出
              </button>
           </div>
           
           <div className="apple-card p-8 flex flex-col justify-between h-[240px]">
              <div>
                <h3 className="font-semibold text-red-500 mb-3">全量注销并删除账户</h3>
                <p className="text-lg text-text-muted leading-relaxed">此操作不可逆。删除后您的所有云端脚本、分析模型画像将永久消失。</p>
              </div>
              <button 
                onClick={() => {
                  const confirm = window.confirm('确认要永久删除账户吗？此操作无法恢复。');
                  if (confirm) triggerToast('账户删除请求已提交');
                }}
                className="w-full py-4 border-2 border-red-100 text-red-500 rounded-2xl font-semibold text-base uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all press dark:border-red-800/30 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} /> 申请销户
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
