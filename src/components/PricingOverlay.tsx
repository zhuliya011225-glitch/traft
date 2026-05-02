import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface PricingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingOverlay({ isOpen, onClose }: PricingOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-xl overflow-y-auto">
           <button onClick={onClose} className="absolute top-10 right-10 text-text-muted hover:text-text transition-colors z-[210] press">
              <X size={32} />
           </button>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 py-20"
           >
              {/* Basic */}
              <PricingCard 
                title="Basic"
                price="免费"
                subtitle="入门体验，个人学习"
                features={[
                  '50 次/月 AI 调用额度',
                  '1 个并发任务',
                  '基础热点 (3个/天)',
                  '基础脚本生成',
                  '单平台优化',
                  '仅支持图文内容',
                  '7天历史数据存储',
                  '纯文本导出'
                ]}
              />
              {/* Plus */}
              <PricingCard 
                title="Plus"
                price="14"
                oldPrice="29"
                discount="20% OFF"
                subtitle="常规创作者，副业变现"
                featured
                features={[
                  '500 次/月 AI 调用额度',
                  '3 个并发任务',
                  '无限热点 + 爆款拆解',
                  '多轮迭代 + 风格模板库',
                  '多平台一键适配',
                  '基础数据分析',
                  '图文 + 短视频脚本',
                  '90天历史数据存储',
                  'Markdown + PDF + Word 导出'
                ]}
              />
              {/* Pro */}
              <PricingCard 
                title="Pro"
                price="69"
                oldPrice="89"
                discount="30% OFF"
                subtitle="专业人士和工作室"
                features={[
                  '2,000 次/月 AI 调用额度',
                  '10 个并发任务',
                  '无限 + 竞品监控 + 行业报告',
                  '自定义风格训练 + 批量生成',
                  'A/B测试 + 自动发布',
                  '深度洞察 + 策略自动执行',
                  '图文 + 短视频 + 直播脚本',
                  '无限历史数据存储',
                  '全格式 + API 接入'
                ]}
              />
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PricingCard({ title, price, subtitle, features, featured, oldPrice, discount }: any) {
  return (
    <div className={cn(
      "relative p-10 rounded-2xl transition-all flex flex-col apple-card",
      featured 
        ? "border-2 border-[#18202B]/20 scale-105 z-10" 
        : "border border-border-custom/20"
    )}>
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#18202B] text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} fill="currentColor" /> 最受欢迎
        </div>
      )}
      
      <div className="mb-10">
        <h3 className="text-2xl font-black text-text mb-2 flex items-center gap-3">
          {title}
          {discount && <span className="bg-[#18202B] text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest">{discount}</span>}
        </h3>
        <p className="text-text-muted text-xs font-medium">{subtitle}</p>
      </div>

      <div className="mb-10 flex items-baseline gap-2">
        {price === "免费" ? (
          <span className="text-5xl font-black text-text tracking-tighter">免费</span>
        ) : (
          <>
            <span className="text-5xl font-black text-text mono tracking-tighter">${price}</span>
            {oldPrice && <span className="text-text-muted line-through text-lg mono">${oldPrice}</span>}
          </>
        )}
      </div>

      <button className={cn(
        "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mb-10 press",
        featured ? "bg-[#18202B] text-white hover:bg-[#2A3440]" : "bg-[#D3DFF2] text-[#18202B] hover:bg-[#C8D6ED]"
      )}>
        立即开始
      </button>

      <div className="space-y-4 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-start gap-3">
            <Check size={16} className="text-[#18202B] mt-0.5 shrink-0" />
            <span className="text-xs text-text-secondary font-medium leading-relaxed">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
