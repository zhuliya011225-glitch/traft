import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, ArrowRight, Sparkles, BrainCircuit, Zap, TrendingUp, Check, X, ChevronDown } from 'lucide-react';
import { User } from '../types';
import { cn } from '../lib/utils';
import ShinyText from '../components/ShinyText';

const WeChatIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M1024 619.52c0-143.36-138.24-256-307.2-256s-307.2 112.64-307.2 256 138.24 256 307.2 256c30.72 0 61.44-5.12 92.16-10.24l97.28 51.2-25.6-76.8c87.04-51.2 143.36-128 143.36-220.16z m-414.72-40.96c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z m209.92 0c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2 51.2 20.48 51.2 51.2c0 25.6-25.6 51.2-51.2 51.2z" fill="#4CBF00"></path>
    <path d="M358.4 609.28c0-158.72 153.6-286.72 348.16-286.72h15.36c-40.96-133.12-179.2-235.52-353.28-235.52-204.8 0-368.64 138.24-368.64 307.2 0 107.52 66.56 204.8 168.96 256l-30.72 92.16L256 686.08c35.84 10.24 71.68 15.36 112.64 15.36h10.24c-15.36-30.72-20.48-61.44-20.48-92.16z m138.24-414.72c35.84 0 66.56 30.72 66.56 66.56s-30.72 66.56-66.56 66.56C460.8 322.56 430.08 291.84 430.08 256S460.8 194.56 496.64 194.56zM245.76 322.56c-35.84 0-61.44-30.72-61.44-66.56s30.72-66.56 66.56-66.56 61.44 30.72 61.44 66.56-30.72 66.56-66.56 66.56z" fill="#4CBF00"></path>
  </svg>
);

const QQIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="#1296DB"></path>
  </svg>
);

import { BouncingBalls } from '../components/BouncingBalls';
import PricingOverlay from '../components/PricingOverlay';

export default function LandingPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const agents = [
    { 
      name: '热点选题', 
      function: '实时捕捉全网爆火热点，深度预测流量趋势，匹配高转化创作方向。', 
      models: ['GPT-4o', 'Claude 3.5 Sonnet']
    },
    { 
      name: '内容创作', 
      function: '从灵感到成稿，一站式生成爆款视频脚本、文章大纲与个性化内容润色。', 
      models: ['Gemini 1.5 Pro', 'Llama 3 (70B)']
    },
    { 
      name: '发布优化', 
      function: '基于社交推荐算法，提供黄金发布窗口建议、标题 A/B 测试与标签优化。', 
      models: ['DeepSeek-V2', 'Mistral Large']
    },
    { 
      name: '增长分析', 
      function: '深度拆解内容盈亏表现，分析粉丝画像与互动语义，驱动长效增长决策。', 
      models: ['Gemini 1.5 Flash', 'GPT-4o-mini']
    },
  ];

  return (
    <div className="relative min-h-screen bg-bg flex flex-col font-sans selection:bg-primary/20 overflow-hidden">
      {/* Navigation Header */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-6">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-3xl font-black text-text tracking-tighter">Traft</h1>
        </div>

        {/* 功能导航 */}
        <div className="hidden md:flex items-center bg-card/40 backdrop-blur-md border border-border-custom/20 px-6 py-2 rounded-full space-x-8">
          {agents.map((agent) => (
            <div key={agent.name} className="group relative">
              <button className="flex items-center gap-2 text-sm font-black text-text-muted hover:text-text transition-all uppercase tracking-[0.15em] hover:scale-110 press">
                {agent.name}
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-card border border-border-custom/20 rounded-2xl p-10 shadow-2xl relative overflow-hidden group/popover">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  <p className="text-sm font-black text-primary uppercase tracking-widest mb-4 group-hover/popover:text-base transition-all duration-300">核心功能</p>
                  <p className="text-base text-text-secondary mb-8 font-medium leading-relaxed group-hover/popover:text-lg transition-all duration-300">{agent.function}</p>
                  <div className="pt-6 border-t border-border-custom/15">
                    <p className="text-sm font-black text-text-muted uppercase tracking-widest mb-4 group-hover/popover:text-base transition-all duration-300">支持模型矩阵</p>
                    <div className="flex flex-wrap gap-2">
                       {agent.models.map(m => (
                         <span key={m} className="px-5 py-2.5 bg-bg text-text rounded-xl text-sm font-bold border border-border-custom/15 transition-all hover:scale-110 hover:bg-card hover:border-primary">{m}</span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="w-[1px] h-4 bg-border-custom/20" />
          <button 
            onClick={() => setShowPricing(true)}
            className="text-sm font-black text-primary hover:text-accent transition-colors uppercase tracking-[0.15em] flex items-center gap-2 press"
          >
            <Sparkles size={14} />
            订阅
          </button>
        </div>

        {/* Login Button */}
        <button 
          onClick={() => setShowLogin(true)}
          className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all press shadow-lg"
        >
          立即登录
        </button>
      </nav>

      {/* Main Hero Section - Centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="mb-10 w-full">
            <h2 className="text-5xl md:text-7xl font-extralight text-text tracking-tight leading-[1.05] font-legacy">
              用 AI 轻松创作<br/>
              更容易涨粉的内容。
            </h2>
          </div>

          <div className="space-y-2 mb-14 w-full text-center">
            <p className="text-xl md:text-2xl text-text-secondary font-medium tracking-tight font-legacy">
              将笔记、录音或文档转化为完整脚本
            </p>
            <p className="text-xl md:text-2xl text-text-secondary font-medium tracking-tight font-legacy">
              让表达更具吸引力，无需任何创作经验。
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(211, 223, 242, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLogin({ id: 'guest', name: '访客创作者', role: 'creator' })}
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-primary text-white rounded-2xl overflow-hidden transition-all shadow-xl min-w-[220px] press"
          >
            <span className="relative z-10 uppercase tracking-widest text-lg md:text-xl font-bold px-4">
              创建选题
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </motion.div>
      </main>

      {/* Subscription Overlay */}
      <PricingOverlay isOpen={showPricing} onClose={() => setShowPricing(false)} />

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-md bg-card border border-border-custom/20 rounded-2xl p-12 shadow-2xl"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-text mb-2 tracking-tighter">登录 Traft</h2>
                <p className="text-text-muted font-medium">开启你的爆款创作之旅</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => onLogin({ id: '1', name: 'WeChat User', role: 'creator' })}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-bg hover:bg-hover-accent border border-border-custom/15 rounded-2xl text-text font-black text-sm uppercase tracking-widest transition-all press"
                >
                  <WeChatIcon /> 微信登录
                </button>
                <button
                  onClick={() => onLogin({ id: '2', name: 'QQ User', role: 'creator' })}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-bg hover:bg-hover-accent border border-border-custom/15 rounded-2xl text-text font-black text-sm uppercase tracking-widest transition-all press"
                >
                   <QQIcon /> QQ 登录
                </button>

                <div className="relative py-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-custom/15"></div></div>
                  <div className="relative flex justify-center text-sm uppercase"><span className="bg-card px-6 text-text-muted font-black tracking-[0.3em]">OR</span></div>
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="邮箱或手机号" 
                    className="w-full px-6 py-4 bg-bg border border-transparent rounded-2xl text-text focus:outline-none focus:bg-card focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-text-muted font-medium"
                  />
                  <input 
                    type="password" 
                    placeholder="密码" 
                    className="w-full px-6 py-4 bg-bg border border-transparent rounded-2xl text-text focus:outline-none focus:bg-card focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-text-muted font-medium"
                  />
                  <button 
                    onClick={() => onLogin({ id: '3', name: 'Admin', role: 'admin', email: 'user@traft.ai' })}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-primary/90 active:scale-95 transition-all mt-4 press"
                  >
                    即刻登录
                  </button>
                </div>
              </div>

              <p className="mt-10 text-center text-sm text-text-muted uppercase tracking-widest font-black leading-loose">
                登录即代表您同意我们的<br/>
                <span className="text-text underline cursor-pointer">服务协议</span> 与 <span className="text-text underline cursor-pointer">隐私条款</span>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
