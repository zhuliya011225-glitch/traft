import React, { useState, useMemo } from 'react';
import {
  Plus,
  History,
  BrainCircuit,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Zap,
  ChevronRight,
  Filter,
  Download,
  AlertCircle,
  X,
  Users,
  MousePointer2,
  Share2,
  Smartphone,
  Instagram,
  Video,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const PLATFORMS = [
  { id: '抖音', icon: Smartphone, color: 'text-text', bg: 'bg-bg', accent: '#93A4C1' },
  { id: '小红书', icon: Instagram, color: 'text-red-500', bg: 'bg-red-50', accent: '#ef4444' },
  { id: '视频号', icon: Video, color: 'text-orange-500', bg: 'bg-orange-50', accent: '#f97316' },
  { id: 'B站', icon: Share2, color: 'text-pink-400', bg: 'bg-pink-50', accent: '#ec4899' },
];

interface GrowthData {
  id: string;
  date: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  conversion: number;
}

interface PlatformData {
  stats: { label: string; value: string; trend: string; icon: any; up: boolean }[];
  history: GrowthData[];
  trend: { name: string; views: number; followers: number }[];
  radar: { subject: string; A: number; B: number; fullMark: number }[];
  insights: { title: string; content: string; highlight?: string; highlight2?: string };
  strategies: { tag: string; tagColor: string; content: string }[];
}

const PLATFORM_DATA: Record<string, PlatformData> = {
  '抖音': {
    stats: [
      { label: '累计播放', value: '452.8万', trend: '+18.2%', icon: Eye, up: true },
      { label: '活跃粉丝', value: '12.4万', trend: '+8.7%', icon: Users, up: true },
      { label: '平均互动', value: '9.2%', trend: '-1.3%', icon: MousePointer2, up: false },
      { label: '总点赞', value: '38.6万', trend: '+15.4%', icon: Heart, up: true },
    ],
    history: [
      { id: 'd1', date: '2024-04-28', title: 'AI工具提效200%的秘密', views: 128000, likes: 8200, comments: 1450, shares: 3200, conversion: 9.8 },
      { id: 'd2', date: '2024-04-25', title: '副业实操指南(上)', views: 256000, likes: 18200, comments: 3200, shares: 8900, conversion: 12.1 },
      { id: 'd3', date: '2024-04-20', title: 'Cursor一键做App教程', views: 89000, likes: 6200, comments: 890, shares: 2100, conversion: 11.4 },
      { id: 'd4', date: '2024-04-15', title: '高效工作流全公开', views: 156000, likes: 9800, comments: 1200, shares: 3400, conversion: 9.6 },
      { id: 'd5', date: '2024-04-10', title: '新手如何开始做视频', views: 98000, likes: 5600, comments: 780, shares: 1500, conversion: 8.0 },
    ],
    trend: [
      { name: '4.10', views: 98000, followers: 1240 },
      { name: '4.15', views: 156000, followers: 1890 },
      { name: '4.20', views: 89000, followers: 2340 },
      { name: '4.25', views: 256000, followers: 4200 },
      { name: '4.28', views: 128000, followers: 3800 },
      { name: '5.01', views: 189000, followers: 5100 },
      { name: '5.04', views: 210000, followers: 6200 },
    ],
    radar: [
      { subject: '完播率', A: 135, B: 110, fullMark: 150 },
      { subject: '点赞率', A: 128, B: 100, fullMark: 150 },
      { subject: '评论率', A: 95, B: 85, fullMark: 150 },
      { subject: '分享率', A: 140, B: 95, fullMark: 150 },
      { subject: '转化率', A: 110, B: 90, fullMark: 150 },
      { subject: '停留时长', A: 120, B: 105, fullMark: 150 },
    ],
    insights: {
      title: '核心洞察',
      content: '您的抖音内容在"知识分享"类目下完播率高于行业均值',
      highlight: '35%',
    },
    strategies: [
      { tag: '选题建议', tagColor: 'text-primary', content: '增加"实操步骤"类内容比例，抖音算法对教程类视频有额外流量加权。' },
      { tag: '发布节奏', tagColor: 'text-text-secondary', content: '尝试周二/周四 21:00 发文，错开周末大流量竞争。' },
    ],
  },
  '小红书': {
    stats: [
      { label: '累计曝光', value: '89.2万', trend: '+24.5%', icon: Eye, up: true },
      { label: '活跃粉丝', value: '3.8万', trend: '+12.1%', icon: Users, up: true },
      { label: '收藏率', value: '14.6%', trend: '+3.2%', icon: MousePointer2, up: true },
      { label: '总收藏', value: '12.3万', trend: '+28.7%', icon: Heart, up: true },
    ],
    history: [
      { id: 'x1', date: '2024-04-28', title: 'Notion第二大脑搭建指南', views: 45000, likes: 5600, comments: 340, shares: 890, conversion: 14.9 },
      { id: 'x2', date: '2024-04-25', title: '5个ChatGPT提示词提效', views: 62000, likes: 8200, comments: 520, shares: 1200, conversion: 15.9 },
      { id: 'x3', date: '2024-04-20', title: '小红书爆款封面公式', views: 38000, likes: 4200, comments: 280, shares: 560, conversion: 13.1 },
      { id: 'x4', date: '2024-04-15', title: 'Cursor+Claude做App', views: 28000, likes: 3100, comments: 190, shares: 420, conversion: 13.2 },
      { id: 'x5', date: '2024-04-10', title: 'Midjourney国潮风关键词', views: 22000, likes: 2400, comments: 150, shares: 340, conversion: 13.3 },
    ],
    trend: [
      { name: '4.10', views: 22000, followers: 890 },
      { name: '4.15', views: 28000, followers: 1120 },
      { name: '4.20', views: 38000, followers: 1560 },
      { name: '4.25', views: 62000, followers: 2340 },
      { name: '4.28', views: 45000, followers: 1980 },
      { name: '5.01', views: 58000, followers: 2890 },
      { name: '5.04', views: 72000, followers: 3560 },
    ],
    radar: [
      { subject: '完播率', A: 110, B: 115, fullMark: 150 },
      { subject: '点赞率', A: 140, B: 110, fullMark: 150 },
      { subject: '评论率', A: 85, B: 90, fullMark: 150 },
      { subject: '分享率', A: 95, B: 100, fullMark: 150 },
      { subject: '转化率', A: 120, B: 95, fullMark: 150 },
      { subject: '停留时长', A: 105, B: 100, fullMark: 150 },
    ],
    insights: {
      title: '核心洞察',
      content: '您的小红书内容收藏率显著高于同领域博主，说明干货密度受到认可，建议继续保持',
      highlight: '清单体',
      highlight2: '结构',
    },
    strategies: [
      { tag: '选题建议', tagColor: 'text-primary', content: '封面增加 Before/After 对比图，点击率可提升约 20%。' },
      { tag: '发布节奏', tagColor: 'text-text-secondary', content: '晚间 19:30–20:30 为小红书用户活跃高峰，优先安排重要内容。' },
    ],
  },
  '视频号': {
    stats: [
      { label: '累计播放', value: '128.5万', trend: '+45.2%', icon: Eye, up: true },
      { label: '活跃粉丝', value: '8.6万', trend: '+22.3%', icon: Users, up: true },
      { label: '转发率', value: '18.3%', trend: '+6.7%', icon: MousePointer2, up: true },
      { label: '总转发', value: '23.5万', trend: '+52.1%', icon: Share2, up: true },
    ],
    history: [
      { id: 'v1', date: '2024-04-28', title: 'AI数字人直播全流程拆解', views: 180000, likes: 6200, comments: 890, shares: 12000, conversion: 10.6 },
      { id: 'v2', date: '2024-04-25', title: 'ChatGPT+Sora创作新时代', views: 320000, likes: 11200, comments: 1560, shares: 28000, conversion: 13.9 },
      { id: 'v3', date: '2024-04-20', title: '视频号算法逻辑更新', views: 95000, likes: 3400, comments: 520, shares: 8900, conversion: 13.5 },
      { id: 'v4', date: '2024-04-15', title: 'Cursor生成爆款小游戏', views: 78000, likes: 2800, comments: 420, shares: 6200, conversion: 12.3 },
      { id: 'v5', date: '2024-04-10', title: '2024短视频创作方法论', views: 56000, likes: 1900, comments: 310, shares: 4500, conversion: 11.8 },
    ],
    trend: [
      { name: '4.10', views: 56000, followers: 2100 },
      { name: '4.15', views: 78000, followers: 2890 },
      { name: '4.20', views: 95000, followers: 3560 },
      { name: '4.25', views: 320000, followers: 6200 },
      { name: '4.28', views: 180000, followers: 5100 },
      { name: '5.01', views: 210000, followers: 6800 },
      { name: '5.04', views: 245000, followers: 8200 },
    ],
    radar: [
      { subject: '完播率', A: 125, B: 100, fullMark: 150 },
      { subject: '点赞率', A: 90, B: 85, fullMark: 150 },
      { subject: '评论率', A: 75, B: 80, fullMark: 150 },
      { subject: '分享率', A: 150, B: 90, fullMark: 150 },
      { subject: '转化率', A: 115, B: 95, fullMark: 150 },
      { subject: '停留时长', A: 130, B: 105, fullMark: 150 },
    ],
    insights: {
      title: '核心洞察',
      content: '视频号内容的转发裂变能力极强，分享率超出行业均值',
      highlight: '62%',
    },
    strategies: [
      { tag: '选题建议', tagColor: 'text-primary', content: '多发布"认知差"和"信息差"类内容，非常契合视频号用户偏好。' },
      { tag: '发布节奏', tagColor: 'text-text-secondary', content: '晚间 20:00–21:30 为中老年用户活跃高峰，长视频完播率更优。' },
    ],
  },
  'B站': {
    stats: [
      { label: '累计播放', value: '67.3万', trend: '+8.4%', icon: Eye, up: true },
      { label: '活跃粉丝', value: '2.1万', trend: '+5.6%', icon: Users, up: true },
      { label: '弹幕密度', value: '3.2条/分', trend: '+12.8%', icon: MessageCircle, up: true },
      { label: '总投币', value: '1.8万', trend: '+18.9%', icon: Heart, up: true },
    ],
    history: [
      { id: 'b1', date: '2024-04-28', title: '我用AI做了100个视频后的经验', views: 45000, likes: 4200, comments: 620, shares: 890, conversion: 12.7 },
      { id: 'b2', date: '2024-04-25', title: '从0粉到10万的底层方法论', views: 78000, likes: 7200, comments: 1200, shares: 1500, conversion: 12.7 },
      { id: 'b3', date: '2024-04-20', title: '这套内容框架让我每条都上热门', views: 32000, likes: 2800, comments: 420, shares: 560, conversion: 11.8 },
      { id: 'b4', date: '2024-04-15', title: '知识区UP主的完整成长路径', views: 28000, likes: 2400, comments: 380, shares: 420, conversion: 11.4 },
      { id: 'b5', date: '2024-04-10', title: '2024最值得关注的AI副业工具', views: 22000, likes: 1900, comments: 290, shares: 340, conversion: 11.5 },
    ],
    trend: [
      { name: '4.10', views: 22000, followers: 890 },
      { name: '4.15', views: 28000, followers: 1120 },
      { name: '4.20', views: 32000, followers: 1450 },
      { name: '4.25', views: 78000, followers: 2340 },
      { name: '4.28', views: 45000, followers: 1890 },
      { name: '5.01', views: 56000, followers: 2100 },
      { name: '5.04', views: 62000, followers: 2450 },
    ],
    radar: [
      { subject: '完播率', A: 105, B: 110, fullMark: 150 },
      { subject: '点赞率', A: 115, B: 100, fullMark: 150 },
      { subject: '评论率', A: 130, B: 95, fullMark: 150 },
      { subject: '分享率', A: 100, B: 90, fullMark: 150 },
      { subject: '转化率', A: 95, B: 85, fullMark: 150 },
      { subject: '停留时长', A: 140, B: 110, fullMark: 150 },
    ],
    insights: {
      title: '核心洞察',
      content: 'B站内容的弹幕互动率和长视频完播率表现突出，社区粘性显著优于其他平台',
      highlight: '25%',
    },
    strategies: [
      { tag: '选题建议', tagColor: 'text-primary', content: '增加系列化内容，利用B站用户的追更习惯提升复访率。' },
      { tag: '发布节奏', tagColor: 'text-text-secondary', content: '周五 18:00 前后发布长视频，学生党和上班族同时在线。' },
    ],
  },
};

export default function GrowthAnalysis({ triggerToast }: { triggerToast: (m: string) => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState('抖音');
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', views: '', likes: '', comments: '', shares: '' });

  const current = PLATFORM_DATA[selectedPlatform];
  const platformMeta = PLATFORMS.find(p => p.id === selectedPlatform)!;
  const PlatformIcon = platformMeta.icon;

  const accentColor = platformMeta.accent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.views) return;

    const viewsNum = Number(formData.views);
    const interaction = (Number(formData.likes) || 0) + (Number(formData.comments) || 0) + (Number(formData.shares) || 0);

    const newData: GrowthData = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: formData.title,
      views: viewsNum,
      likes: Number(formData.likes) || 0,
      comments: Number(formData.comments) || 0,
      shares: Number(formData.shares) || 0,
      conversion: Number(((interaction / viewsNum) * 100).toFixed(1))
    };

    // Note: in real app this would update the platform-specific data
    triggerToast(`${selectedPlatform} 数据录入成功！`);
    setFormData({ title: '', views: '', likes: '', comments: '', shares: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 pb-12 pt-4 min-h-screen">

      {/* Header + Platform Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-semibold text-text tracking-tight">增长分析</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 平台选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowPlatformMenu(!showPlatformMenu)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl border text-base font-normal transition-all press",
                platformMeta.bg, platformMeta.color, "border-border-custom/20 hover:shadow-md"
              )}
            >
              <PlatformIcon size={16} />
              <span>{selectedPlatform}</span>
              <ChevronDown size={14} className={cn("transition-transform", showPlatformMenu && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showPlatformMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPlatformMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="absolute top-full mt-2 right-0 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-50 min-w-[180px] overflow-hidden"
                  >
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedPlatform(p.id); setShowPlatformMenu(false); }}
                        className={cn(
                          "w-full text-left px-5 py-4 hover:bg-hover-accent transition-all flex items-center gap-3 text-base font-normal border-b last:border-b-0 border-border-custom/15 press",
                          selectedPlatform === p.id ? p.color : "text-text-secondary"
                        )}
                      >
                        <p.icon size={16} />
                        {p.id}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-8 py-3 bg-primary text-white rounded-2xl text-base font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all press flex items-center gap-3"
            >
              <Plus size={16} />
              录入新数据
            </button>
          )}
        </div>
      </div>

      {/* QUICK STATS — 平台累计数据 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {current.stats.map((stat, i) => (
          <motion.div
            key={stat.label + selectedPlatform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="apple-card p-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl text-bg bg-text">
                <stat.icon size={18} />
              </div>
              <span className={cn(
                "text-base font-semibold flex items-center gap-1 group-hover:scale-110 transition-transform",
                stat.up ? "text-emerald-500" : "text-red-400"
              )}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.trend}
              </span>
            </div>
            <p className="text-base font-semibold text-text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-base font-semibold text-text tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Charts & History */}
        <div className="lg:col-span-2 space-y-8">

          {/* Growth Trend Chart */}
          <motion.div
            key={"chart-" + selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-bg rounded-xl text-text"><BarChart3 size={18} /></div>
                <h3 className="text-xl font-semibold text-text tracking-tight">趋势洞察</h3>
                <span className="text-base font-semibold text-text-secondary uppercase tracking-widest">{selectedPlatform}</span>
              </div>
              <select className="bg-bg border-none rounded-xl px-4 py-2 text-base font-semibold uppercase tracking-widest text-text-secondary focus:ring-0">
                <option>最近 30 天</option>
                <option>最近 7 天</option>
              </select>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={current.trend}>
                  <defs>
                    <linearGradient id={`colorViews-${selectedPlatform}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900', backgroundColor: 'var(--card)', color: 'var(--text)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={accentColor}
                    fillOpacity={1}
                    fill={`url(#colorViews-${selectedPlatform})`}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Historical Data Table */}
          <motion.div
            key={"table-" + selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card flex flex-col overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-border-custom/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-bg rounded-xl text-text"><History size={18} /></div>
                <h3 className="text-xl font-semibold text-text tracking-tight">历史表现数据</h3>
                <span className="text-base font-semibold text-text-secondary uppercase tracking-widest">{selectedPlatform}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 hover:bg-hover-accent rounded-xl text-text-secondary transition-all group overflow-hidden relative press">
                  <Filter size={16} className="relative z-10" />
                </button>
                <button className="p-2.5 hover:bg-hover-accent rounded-xl text-text-muted transition-all group overflow-hidden relative press">
                  <Download size={16} className="relative z-10" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-bg/50">
                    <th className="px-8 py-4 text-sm font-semibold text-text-secondary uppercase tracking-widest">日期</th>
                    <th className="px-4 py-4 text-sm font-semibold text-text-secondary uppercase tracking-widest">作品标题</th>
                    <th className="px-4 py-4 text-sm font-semibold text-text-secondary uppercase tracking-widest">播放量</th>
                    <th className="px-4 py-4 text-sm font-semibold text-text-secondary uppercase tracking-widest">互动详情</th>
                    <th className="px-4 py-4 text-sm font-semibold text-text-secondary uppercase tracking-widest">爆发指数</th>
                    <th className="px-8 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10">
                  {current.history.map((row) => (
                    <motion.tr
                      layout
                      key={row.id}
                      className="group hover:bg-hover-accent transition-colors cursor-pointer"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-text-secondary" />
                          <span className="text-base font-normal text-text-secondary">{row.date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-base font-normal text-text group-hover:text-primary transition-colors">{row.title}</span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Eye size={12} className="text-text-secondary" />
                          <span className="text-base font-semibold text-text">{(row.views / 1000).toFixed(1)}k</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-base font-normal text-text-secondary">
                            <Heart size={12} className="text-red-500" /> {row.likes}
                          </div>
                          <div className="flex items-center gap-1 text-base font-normal text-text-secondary">
                            <MessageCircle size={12} className="text-blue-500" /> {row.comments}
                          </div>
                          <div className="flex items-center gap-1 text-base font-normal text-text-secondary">
                            <Share2 size={12} className="text-emerald-500" /> {row.shares}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <Zap size={12} className={cn("transition-colors", row.conversion > 12 ? "text-emerald-500" : "text-amber-500")} />
                          <span className={cn("text-base font-semibold", row.conversion > 12 ? "text-emerald-600" : "text-amber-600")}>{row.conversion}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <ChevronRight size={16} className="ml-auto text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: AI Analysis & Strategy */}
        <div className="space-y-8">

          {/* Data Entry Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="apple-card border border-border-custom/20 p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-text tracking-tight">录入 {selectedPlatform} 新数据</h3>
                    <button onClick={() => setIsAdding(false)} className="p-1.5 bg-bg/10 rounded-full text-text-muted hover:text-text transition-colors press">
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-text-muted uppercase tracking-widest">作品标题</label>
                      <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-bg/20 border-none rounded-xl px-4 py-3 text-base text-bg font-normal focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted"
                        placeholder="输入标题..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-muted uppercase tracking-widest">播放量</label>
                        <input
                          type="number"
                          value={formData.views}
                          onChange={e => setFormData({ ...formData, views: e.target.value })}
                          className="w-full bg-bg/20 border-none rounded-xl px-4 py-3 text-base text-bg font-normal focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-muted uppercase tracking-widest">点赞数</label>
                        <input
                          type="number"
                          value={formData.likes}
                          onChange={e => setFormData({ ...formData, likes: e.target.value })}
                          className="w-full bg-bg/20 border-none rounded-xl px-4 py-3 text-base text-bg font-normal focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary uppercase tracking-widest">评论数</label>
                        <input
                          type="number"
                          value={formData.comments}
                          onChange={e => setFormData({ ...formData, comments: e.target.value })}
                          className="w-full bg-bg/20 border-none rounded-xl px-4 py-3 text-base text-bg font-normal focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-muted uppercase tracking-widest">转发数</label>
                        <input
                          type="number"
                          value={formData.shares}
                          onChange={e => setFormData({ ...formData, shares: e.target.value })}
                          className="w-full bg-bg/20 border-none rounded-xl px-4 py-3 text-base text-bg font-normal focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-muted"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all press">
                      确认保存
                    </button>
                  </form>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Radar */}
          <motion.div
            key={"radar-" + selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-bg rounded-2xl text-primary"><Zap size={20} /></div>
              <h3 className="text-xl font-semibold text-text tracking-tight">内容质量雷达</h3>
            </div>

            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={current.radar}>
                  <PolarGrid stroke="var(--border)" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-secondary)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="当前表现"
                    dataKey="A"
                    stroke={accentColor}
                    fill={accentColor}
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="行业平均"
                    dataKey="B"
                    stroke="var(--border)"
                    fill="var(--border)"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="text-base font-semibold text-text-muted uppercase">当前表现</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-border-custom/40" />
                <span className="text-base font-semibold text-text-muted uppercase">行业平均</span>
              </div>
            </div>
          </motion.div>

          {/* AI Analysis Report */}
          <motion.div
            key={"insight-" + selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card p-8 space-y-6 relative overflow-hidden group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary"><BrainCircuit size={20} /></div>
              <h3 className="text-xl font-semibold text-text tracking-tight">AI 智能诊断报告</h3>
            </div>

            <div className="space-y-5">
              <div className="p-5 bg-bg rounded-2xl border border-border-custom/15 space-y-3">
                <p className="text-base font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={12} className="text-amber-500" /> {current.insights.title}
                </p>
                <p className="text-lg font-normal text-text-secondary leading-relaxed">
                  {current.insights.content}
                  {current.insights.highlight && (
                    <span className="text-emerald-500"> {current.insights.highlight}</span>
                  )}
                  {current.insights.highlight2 && (
                    <span className="text-emerald-500">{current.insights.highlight2}</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-bg border border-border-custom/15 rounded-2xl">
                  <p className="text-base font-semibold text-text-muted uppercase mb-1">本周涨粉</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold">
                    <ArrowUpRight size={14} /> {selectedPlatform === '抖音' ? '2.4k' : selectedPlatform === '小红书' ? '1.8k' : selectedPlatform === '视频号' ? '3.1k' : '0.9k'}
                  </div>
                </div>
                <div className="p-4 bg-bg border border-border-custom/15 rounded-2xl">
                  <p className="text-base font-semibold text-text-muted uppercase mb-1">互动趋势</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold">
                    <ArrowUpRight size={14} /> +{selectedPlatform === '抖音' ? '6.2%' : selectedPlatform === '小红书' ? '11.4%' : selectedPlatform === '视频号' ? '18.7%' : '7.3%'}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl transition-all group-hover:scale-150" />
          </motion.div>

          {/* Strategy Adjustment Panel */}
          <motion.div
            key={"strategy-" + selectedPlatform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="apple-card border border-border-custom/20 p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-2xl text-primary"><Target size={20} /></div>
              <h3 className="text-xl font-semibold text-text tracking-tight">下阶段策略建议</h3>
            </div>

            <div className="space-y-4">
              {current.strategies.map((s, i) => (
                <div key={i} className="group p-5 bg-bg rounded-2xl border border-border-custom/15 hover:border-primary/30 transition-all cursor-pointer press">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-semibold uppercase tracking-widest", s.tagColor)}>{s.tag}</span>
                    {i === 0 && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-base font-normal text-text-secondary">{s.content}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-bg border border-border-custom/20 rounded-2xl text-sm font-semibold text-text uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all press">
              导出 {selectedPlatform} 报告 PDF
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
