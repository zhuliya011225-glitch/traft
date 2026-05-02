import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Clock,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Project, PageId, NavigationData } from '../types';

import SplitText from '../components/SplitText';
import { BouncingBalls } from '../components/BouncingBalls';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '上午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export default function Dashboard({ onNavigate, triggerToast }: { onNavigate: (p: PageId, data?: NavigationData) => void, triggerToast: (m: string) => void }) {
  const recentProjects: Project[] = [
    {
      id: '1',
      title: '小红书爆款封面方案：',
      subtitle: 'Cursor+Claude3.5做App',
      content: '这里是项目的具体草稿内容，包含标题建议和分段正文...',
      updatedAt: '2小时前',
      platform: '小红书',
      status: 'draft',
      type: '干货型',
      expectedPublish: '周四 20:00'
    },
    {
      id: '2',
      title: 'Midjourney国潮风关键词：',
      subtitle: '从0到1商业模式拆解',
      content: '分析国潮风的设计要素，并给出具体的MD提示词组...',
      updatedAt: '昨天',
      platform: '小红书',
      status: 'published',
      stats: { views: '8,234', saves: '456', leads: '23' }
    },
    {
      id: '3',
      title: '抖音脚本：',
      subtitle: '5个ChatGPT提示词提效200%',
      content: '开场白：你还在为写脚本头疼吗？这里有5个开挂般的提示词...',
      updatedAt: '3天前',
      platform: '抖音',
      status: 'published',
      stats: { playback: '45,678', likes: '1,234' },
      type: '28%'
    },
    {
      id: '4',
      title: '副业笔记：',
      subtitle: 'AI工具集锦（ChatGPT/Midjourney/Cursor）',
      content: '详细列出2024年最值得关注的10款AI副业利器...',
      updatedAt: '4天前',
      platform: '小红书',
      status: 'draft',
      type: '清单型',
      expectedPublish: '周二 20:00'
    },
  ];

  return (
    <div className="relative pb-6 pt-2">
      <div className="relative z-10 space-y-6">
      {/* Header */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="shrink-0">
            <SplitText
              text={`${getGreeting()}, 用户0501`}
              className="text-4xl font-semibold mb-2 tracking-tight text-text font-legacy"
              tag="h1"
              textAlign="left"
              delay={50}
            />
            <SplitText
              text="Traft 准备好了，今天想写点什么？"
              className="text-2xl text-text-secondary font-medium font-legacy"
              tag="p"
              textAlign="left"
              delay={30}
              duration={1}
            />
          </div>

          {/* AI PROMPT */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 max-w-xl bg-primary/10 border border-primary/30 rounded-[16px] flex flex-col md:flex-row items-center gap-4" style={{ width: 255, height: 136, columnGap: 16, paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 20 }}
          >
            <div className="shrink-0 bg-primary/30 text-accent" style={{ borderRadius: 12, width: 42, height: 42, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, color: '#5E7BA8' }}>
              <BrainCircuit size={22} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg text-text font-medium mb-0.5 flex items-center justify-center md:justify-start gap-2">
                AI 提效建议
                <span className="text-lg bg-primary text-white px-2 py-0.5 rounded-full font-medium">Pro Tip</span>
              </p>
              <p className="text-lg text-text-secondary leading-relaxed font-normal">
                建议在 <span className="text-text font-normal">19:30 - 20:15</span> 时间段发布，可提升 <span className="font-normal" style={{ width: 30, height: 19, fontSize: 14, lineHeight: '23px', color: '#34C759' }}>15%</span> 初始曝光。
              </p>
            </div>
            <button className="shrink-0 px-4 py-2 bg-card text-text text-lg font-normal rounded-xl transition-all border border-border-custom/20 hover:border-primary/40 press">
              设定提醒
            </button>
          </motion.div>
        </div>

        {/* Action Choice Pair */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card p-6 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-text" />
                <span className="text-base font-normal text-text-secondary uppercase tracking-wider">目前进度</span>
              </div>
              <h3 className="text-xl font-medium text-text tracking-tight transition-colors group-hover:text-accent">从断点处继续...</h3>
              <p className="text-lg text-text-secondary font-normal">今日已生成脚本 <span className="text-text font-normal">2</span> 条，灵感画轴还未完结。</p>

              <div className="relative w-full h-2 bg-bg rounded-full overflow-hidden border border-border-custom/20 p-px">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  className="h-full bg-primary rounded-full relative"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                  />
                </motion.div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('workshop')}
              className="mt-6 px-8 py-3.5 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all press"
            >
              立即创作
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="apple-card p-6 flex flex-col justify-between group border-border-custom/20 hover:border-primary/30"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-text-secondary" />
                <span className="text-base font-normal text-text-secondary uppercase tracking-wider">发现灵感</span>
              </div>
              <h3 className="text-xl font-medium text-text tracking-tight transition-colors group-hover:text-accent">还没想好写什么？</h3>
              <p className="text-lg text-text-secondary font-normal">去看看全网热点选题，为您的账号寻找下一个爆点引火线。</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-border-custom/40" />
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('trend')}
              className="mt-6 px-8 py-3.5 bg-card text-text text-lg font-normal rounded-xl border border-border-custom/30 hover:border-primary/40 transition-all press"
            >
              去热点选题
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Grid - Trends & Stats */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left column - Trends */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-medium text-text tracking-tight flex items-center gap-2">
              <TrendingUp size={22} className="text-accent" />
              快速展示
            </h2>
          </div>

          <div className="apple-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-bg/50 text-text-secondary border-b border-border-custom/15">
              <div className="col-span-6 font-medium text-sm uppercase tracking-[0.15em]">选题标题</div>
              <div className="col-span-2 font-medium text-sm uppercase tracking-[0.15em] text-center">热度</div>
              <div className="col-span-2 font-medium text-sm uppercase tracking-[0.15em] text-center">匹配度</div>
              <div className="col-span-2 font-medium text-sm uppercase tracking-[0.15em] text-right">操作</div>
            </div>

            <div className="divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10">
              {[
                {
                  id: 1,
                  tags: ['#AI技能', '#效率'],
                  title: 'ChatGPT这5个提示词，让我工作效率翻倍',
                  heat: '356万',
                  relevance: '9.8',
                  new: false,
                },
                {
                  id: 2,
                  tags: ['#设计', '#进阶'],
                  title: 'Midjourney V6这个参数，出图质量直接封神',
                  heat: '198万',
                  relevance: '9.5',
                  new: false,
                },
                {
                  id: 3,
                  tags: ['#无代码', '#App'],
                  title: 'Cursor+Claude3.5，不会代码也能做App',
                  heat: '87万',
                  relevance: '9.3',
                  new: true,
                }
              ].map((trend) => (
                <div key={trend.id} className="p-5 hover:bg-bg/40 transition-colors group">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="space-y-0.5">
                        <h3 className="text-lg font-medium text-text group-hover:text-accent transition-colors">
                          {trend.title}
                          {trend.new && <span className="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded-full font-medium">New</span>}
                        </h3>
                        <div className="flex items-center gap-2 text-base font-normal text-text-secondary uppercase tracking-wider">
                          {trend.tags.map((tag, i) => (
                            <span key={i}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-lg font-normal text-text">
                      {trend.heat}
                    </div>

                    <div className="col-span-2 text-center text-lg font-normal text-accent">
                      {trend.relevance}
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => onNavigate('workshop', {
                          type: 'topic',
                          data: {
                            id: trend.id.toString(),
                            title: trend.title,
                            heat: parseInt(trend.heat),
                            score: parseFloat(trend.relevance),
                            tags: trend.tags
                          }
                        })}
                        className="px-3 py-1.5 bg-primary text-white text-base font-semibold rounded-lg hover:bg-primary/90 transition-all press"
                      >
                        采用
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="apple-card p-5 h-full">
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-[0.15em] mb-6">数据概览</h2>
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="var(--bg)" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="var(--primary)" strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="263.8"
                    strokeDashoffset="66"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-medium text-text tracking-tighter">75%</span>
                  <span className="text-sm text-text-secondary uppercase tracking-wider font-normal mt-0.5">综合完播</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-bg rounded-xl border border-border-custom/15 flex items-center justify-between">
                <span className="text-base font-normal text-text-secondary uppercase">本周曝光</span>
                <span className="text-base font-normal text-text">+12,480</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-custom/15">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-normal text-text-secondary uppercase mb-0.5">获赞累计</p>
                    <p className="text-base font-normal text-text">512 <span className="text-success text-sm font-mono ml-1">↑67%</span></p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-text-secondary uppercase mb-0.5">粉丝净增</p>
                    <p className="text-base font-normal text-text">+348 <span className="text-success text-sm font-mono ml-1">+21</span></p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-normal text-text-secondary uppercase mb-0.5">收藏总量</p>
                    <p className="text-base font-normal text-text">189 <span className="text-success text-sm font-mono ml-1">↑45%</span></p>
                  </div>
                  <div>
                    <p className="text-sm font-normal text-text-secondary uppercase mb-0.5">商单转化</p>
                    <p className="text-base font-normal text-text">+12 <span className="text-success text-sm font-mono ml-1">↑8个</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="col-span-12 space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-medium text-text tracking-tight flex items-center gap-2">
              <Clock size={22} className="text-accent" />
              最近创作
            </h2>
          </div>

          <div className="apple-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-bg/50 text-text-secondary border-b border-border-custom/15">
              <div className="col-span-6 font-medium text-sm uppercase tracking-[0.15em]">项目标题与描述</div>
              <div className="col-span-2 font-medium text-sm uppercase tracking-[0.15em] text-center">状态</div>
              <div className="col-span-2 font-medium text-sm uppercase tracking-[0.15em] text-center">发布渠道</div>
              <div className="col-span-1 font-medium text-sm uppercase tracking-[0.15em] text-center">时间</div>
              <div className="col-span-1 font-medium text-sm uppercase tracking-[0.15em] text-right">操作</div>
            </div>

            <div className="divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10">
              {recentProjects.map((proj) => (
                <div key={proj.id} className="p-5 hover:bg-bg/40 transition-colors group">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="space-y-0.5">
                        <h3 className="text-lg font-medium text-text group-hover:text-accent transition-colors">
                          {proj.title}
                          <span className="text-text-secondary font-medium ml-2 text-lg">{proj.subtitle}</span>
                        </h3>
                        <div className="flex items-center gap-4 text-base font-normal text-text-secondary uppercase tracking-wider">
                          {proj.type}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className={cn(
                        "px-2.5 py-1 rounded-lg text-base font-normal uppercase tracking-wider flex items-center gap-1.5",
                        proj.status === 'published' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", proj.status === 'published' ? "bg-success" : "bg-warning")} />
                        {proj.status === 'published' ? '已发布' : '草稿'}
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-base font-normal text-text-secondary uppercase tracking-wider">
                      {proj.platform}
                    </div>

                    <div className="col-span-1 text-center text-base font-normal text-text-secondary uppercase tracking-wider">
                      {proj.updatedAt}
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => onNavigate('workshop', { type: 'project', data: proj })}
                        className="px-3 py-1.5 bg-primary text-white text-base font-semibold rounded-lg hover:bg-primary/90 transition-all press"
                      >
                        修改
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
