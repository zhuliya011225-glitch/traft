import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Zap,
  ChevronDown,
  X,
  Target,
  Layout,
  Filter,
  Sparkles,
  Shield,
  Tag,
  Heart,
  Search,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PageId, TrendTopic, NavigationData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const CONTENT_CATEGORIES = [
  { id: 'study', name: '学习教育', items: ['高中学习技巧', '大学学习技巧', '数学', '英语', '理综', '文综', '高数', '写论文', '复习方法'] },
  { id: 'exam', name: '考试考研', items: ['考研', '政治', '英语', '数学', '专业课'] },
  { id: 'abroad', name: '留学', items: ['雅思', '托福', 'GRE', '申请文书', '签证'] },
  { id: 'interview', name: '面试', items: ['实习面试', '校招群面', '高管面试'] },
  { id: 'internship', name: '实习', items: ['简历', '实习心得', '转正'] },
  { id: 'skills', name: '工作技能', items: ['Excel', 'PPT', '编程', '数据分析', '产品经理'] },
  { id: 'ai', name: 'AI技能', items: ['ChatGPT', 'Midjourney', 'Sora', 'Cursor'] },
  { id: 'programming', name: '编程', items: ['Python', 'Java', '前端', '后端', '算法'] },
  { id: 'language', name: '语言学习', items: ['英语口语', '听力', '阅读', '日语', '法语'] },
  { id: 'cert', name: '职业资格考试', items: ['CPA', '法考', '建造师', '医师'] },
  { id: 'media', name: '自媒体运营', items: ['涨粉', '变现', '内容创作'] },
  { id: 'finance', name: '理财投资', items: ['基金', '股票', '房产', '加密货币'] },
  { id: 'fitness', name: '健身健康', items: ['减脂', '增肌', '瑜伽', '饮食'] },
  { id: 'psych', name: '心理情感', items: ['焦虑', '恋爱', '心理疗愈'] },
  { id: 'parent', name: '亲子教育', items: ['育儿', '早教', '学区房'] },
  { id: 'promote', name: '职场晋升', items: ['升职', '加薪', '向上管理'] },
  { id: 'sidebiz', name: '副业赚钱', items: ['副业项目', '电商', '接单'] },
  { id: 'design', name: '设计绘画', items: ['UI', '插画', 'PS', 'AI'] },
  { id: 'music', name: '音乐乐器', items: ['吉他', '钢琴', '声乐'] },
  { id: 'photo', name: '摄影剪辑', items: ['手机摄影', 'PR', '剪映'] },
  { id: 'ecommerce', name: '电商运营', items: ['淘宝', '拼多多', '亚马逊'] }
];

const PLATFORM_OPTIONS = ["抖音", "小红书", "视频号", "B站"];

// 模拟数据由增长分析引擎生成
const BLOCKED_TAGS = ['理财投资', '房产/加密货币'];
const HIGH_CONVERSION_TAGS = [
  { name: '考研', rate: 9.2 },
  { name: '效率工具', rate: 8.7 },
  { name: 'AI技能', rate: 9.5 },
  { name: '面试指导', rate: 8.4 },
  { name: '副业赚钱', rate: 8.9 },
];

// Extended topic with interaction rate
interface ExtendedTrendTopic extends TrendTopic {
  interactionRate: number;
}

const ALL_TOPICS: ExtendedTrendTopic[] = [
  { id: '1', title: '全网爆红的「效率魔法」：如何用Notion搭建第二大脑', heat: 94, score: 9.7, tags: ['效率工具', 'Notion'], interactionRate: 85 },
  { id: '2', title: '2024搞钱心理学：为什么越想赚钱越赚不到？', heat: 88, score: 9.2, tags: ['副业赚钱', '心理学'], interactionRate: 45 },
  { id: '3', title: '知乎高赞：普通人如何通过AI实现职业跃迁', heat: 91, score: 9.5, tags: ['AI技能', '职场'], interactionRate: 92 },
  { id: '4', title: '从0到1：商业模式拆解系列（最新版）', heat: 85, score: 8.9, tags: ['商业', '干货'], interactionRate: 38 },
  { id: '5', title: '考研最后60天冲刺计划：每天4小时高效复习法', heat: 96, score: 9.8, tags: ['考研', '复习方法'], interactionRate: 94 },
  { id: '6', title: '视频面试通关秘籍：大厂HR不会告诉你的5个细节', heat: 89, score: 9.3, tags: ['面试指导', '校招群面'], interactionRate: 87 },
  { id: '7', title: 'Cursor + Claude 3.5：10分钟生成一个Chrome插件', heat: 93, score: 9.6, tags: ['Cursor', 'AI技能'], interactionRate: 90 },
  { id: '8', title: '基金定投3年亏了20%？问题出在这3个认知盲区', heat: 82, score: 8.5, tags: ['理财投资', '基金股票'], interactionRate: 25 },
  { id: '9', title: '小红书涨粉公式：2024年 still 有效的5个套路', heat: 90, score: 9.4, tags: ['自媒体运营', '涨粉技巧'], interactionRate: 78 },
  { id: '10', title: 'Python自动化办公：每天节省2小时的10个脚本', heat: 87, score: 9.1, tags: ['Python', '效率工具'], interactionRate: 82 },
];

const AI_VIDEO_TOPICS: ExtendedTrendTopic[] = [
  { id: 'ai-1', title: '视频号新红利：AI数字人直播全流程拆解，单日播放突破10万+', heat: 98, score: 9.9, tags: ['AI数字人', '视频号'], interactionRate: 91 },
  { id: 'ai-2', title: 'ChatGPT+Sora：2024短视频创作进入"个人好莱坞"时代', heat: 96, score: 9.8, tags: ['Sora', '短视频'], interactionRate: 88 },
  { id: 'ai-3', title: '如何利用Cursor一键生成视频号爆款营销小游戏？', heat: 93, score: 9.6, tags: ['Cursor', '视频号'], interactionRate: 86 },
  { id: 'ai-4', title: '视频号算法逻辑更新：高价值AI科普内容成流量新增长点', heat: 91, score: 9.5, tags: ['算法', 'AI科普'], interactionRate: 83 },
];

export default function TrendAnalysis({ triggerToast, onNavigate, selectedPlatform, setSelectedPlatform }: { triggerToast: (m: string) => void, onNavigate: (p: PageId, data?: NavigationData) => void, selectedPlatform: string | null, setSelectedPlatform: (p: string | null) => void }) {
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CONTENT_CATEGORIES[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1.1 智能推荐排序
  const [smartSort, setSmartSort] = useState(true);
  // 1.2 话题黑名单过滤
  const [autoBlock, setAutoBlock] = useState(false);
  // 1.3 标签云筛选
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  const togglePersona = (p: string) => {
    setSelectedPersonas(prev =>
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const hasAISkill = selectedPersonas.some(p => p.includes('AI技能'));
  const isVideoChannel = selectedPlatform === '视频号';

  const [rawDisplayTrends, setRawDisplayTrends] = useState<ExtendedTrendTopic[]>(ALL_TOPICS);

  // 计算过滤+排序后的话题列表
  const displayTrends = useMemo(() => {
    let result = [...rawDisplayTrends];

    // 1.2 黑名单过滤
    if (autoBlock) {
      result = result.filter(topic =>
        !topic.tags.some(tag => BLOCKED_TAGS.includes(tag))
      );
    }

    // 1.3 标签云筛选
    if (activeTagFilter) {
      result = result.filter(topic => topic.tags.includes(activeTagFilter));
    }

    // 1.1 智能排序
    if (smartSort) {
      result.sort((a, b) => {
        const scoreA = a.interactionRate * 0.6 + a.heat * 0.4;
        const scoreB = b.interactionRate * 0.6 + b.heat * 0.4;
        return scoreB - scoreA;
      });
    } else {
      result.sort((a, b) => b.heat - a.heat);
    }

    return result;
  }, [rawDisplayTrends, smartSort, autoBlock, activeTagFilter]);

  // 计算被屏蔽的数量
  const blockedCount = useMemo(() => {
    if (!autoBlock) return 0;
    return rawDisplayTrends.filter(topic =>
      topic.tags.some(tag => BLOCKED_TAGS.includes(tag))
    ).length;
  }, [rawDisplayTrends, autoBlock]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerToast("正在基于画像刷新选题...");
    setTimeout(() => {
      if (hasAISkill && isVideoChannel) {
        setRawDisplayTrends(AI_VIDEO_TOPICS);
      } else {
        setRawDisplayTrends(ALL_TOPICS);
      }
      setIsRefreshing(false);
    }, 800);
  };

  const handleAdopt = (topic: TrendTopic) => {
    triggerToast(`已采用话题: ${topic.title}`);
    onNavigate('workshop', { type: 'topic', data: topic });
  };

  return (
    <div className="space-y-12 pb-12 h-full pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold text-text tracking-tight">热点选题</h1>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="flex flex-col gap-6 apple-card p-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Persona Cascading Select */}
          <div className="flex-[2.5] relative">
            <label className="block text-sm font-semibold text-text uppercase tracking-widest mb-3 flex items-center gap-2">
              <Target size={14} className="text-primary" />
              内容方向 (可多选)
            </label>
            <div className="relative">
              <div
                onClick={() => {
                  setShowPersonaDropdown(!showPersonaDropdown);
                  setShowPlatformDropdown(false);
                }}
                className={cn(
                  "flex flex-wrap gap-2 items-center min-h-[64px] px-5 py-3 bg-bg border border-border-custom/20 rounded-2xl cursor-pointer hover:border-border-custom/40 transition-all",
                  showPersonaDropdown && "border-primary ring-4 ring-primary/5 bg-card"
                )}
              >
                {selectedPersonas.length === 0 ? (
                  <span className="text-text-muted text-base font-normal">点击选择内容方向，寻找您的创作领域...</span>
                ) : (
                  selectedPersonas.map(p => (
                    <span
                      key={p}
                      className="bg-primary text-white text-sm font-medium uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      {p}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePersona(p);
                        }}
                        className="hover:scale-125 transition-transform press"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
                <div className="ml-auto">
                   <ChevronDown size={20} className={cn("text-text-muted transition-transform duration-300", showPersonaDropdown && "rotate-180")} />
                </div>
              </div>

              {/* Cascading Dropdown */}
              <AnimatePresence>
                {showPersonaDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowPersonaDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-40 overflow-hidden flex min-h-[380px]"
                    >
                      {/* Left Sidebar: Categories */}
                      <div className="w-[160px] bg-bg/80 border-r border-border-custom/15 py-6 overflow-y-auto max-h-[380px] custom-scrollbar">
                        {CONTENT_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onMouseEnter={() => setActiveCategory(cat.id)}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                              "w-full text-left px-6 py-4 text-base font-medium tracking-tight transition-all relative flex items-center justify-between group",
                              activeCategory === cat.id
                                ? "bg-card text-primary"
                                : "text-text-muted hover:text-text hover:bg-card/50"
                            )}
                          >
                            {cat.name}
                            {activeCategory === cat.id && (
                              <motion.div layoutId="activeCat" className="absolute right-0 w-1 h-6 bg-primary rounded-l-full" />
                            )}
                            <ChevronDown size={14} className={cn("-rotate-90 opacity-0 group-hover:opacity-40 transition-opacity", activeCategory === cat.id && "opacity-100")} />
                          </button>
                        ))}
                      </div>

                      {/* Right Panel: Options */}
                      <div className="flex-1 p-8 overflow-y-auto bg-card">
                        <div className="mb-6 pb-4 border-b border-border-custom/15">
                          <h4 className="text-sm font-semibold text-text uppercase tracking-[0.2em]">
                            {CONTENT_CATEGORIES.find(c => c.id === activeCategory)?.name} / 细分选项
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {CONTENT_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => togglePersona(item)}
                              className={cn(
                                "px-5 py-4 rounded-2xl text-base font-normal transition-all border text-left press",
                                selectedPersonas.includes(item)
                                  ? "bg-primary text-white border-primary"
                                  : "bg-bg text-text-secondary border-border-custom/15 hover:border-primary hover:bg-primary/5 hover:text-text"
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Platform Single Select */}
          <div className="flex-1 relative">
            <label className="block text-sm font-semibold text-text uppercase tracking-widest mb-3 flex items-center gap-2">
              <Layout size={14} className="text-primary" />
              发布平台
            </label>
            <div className="relative">
              <div
                onClick={() => {
                  setShowPlatformDropdown(true);
                  setShowPersonaDropdown(false);
                }}
                className={cn(
                  "flex items-center justify-between h-[64px] px-6 bg-bg border border-border-custom/20 rounded-2xl cursor-pointer hover:border-border-custom/40 transition-all",
                  showPlatformDropdown && "border-primary ring-4 ring-primary/5"
                )}
              >
                <span className={cn("text-base font-normal", !selectedPlatform ? "text-text-muted" : "text-text")}>
                  {selectedPlatform || "选择平台..."}
                </span>
                <ChevronDown size={20} className={cn("text-text-muted transition-transform", showPlatformDropdown && "rotate-180")} />
              </div>

              {/* Platform Dropdown */}
              <AnimatePresence>
                {showPlatformDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowPlatformDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-3 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-40 overflow-hidden p-3 space-y-1"
                    >
                      {PLATFORM_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedPlatform(opt);
                            setShowPlatformDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left px-6 py-4 rounded-xl text-base font-normal transition-all press",
                            selectedPlatform === opt
                              ? "bg-primary text-white"
                              : "hover:bg-bg text-text-secondary"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-end lg:pb-0">
            <button
              onClick={handleRefresh}
              className="w-full h-[64px] flex items-center justify-center gap-3 px-10 bg-primary text-white rounded-2xl text-base font-semibold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all press"
            >
              <Zap size={18} className={cn(isRefreshing && "animate-pulse", "group-hover:scale-110 transition-transform")} /> 查看热点
            </button>
          </div>
        </div>

        {/* Selected Summary / Quick Tags */}
        {(selectedPersonas.length > 0 || selectedPlatform) && (
          <div className="pt-6 border-t border-border-custom/15 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-text uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} />
                当前筛选:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPersonas.length > 0 && (
                  <span className="text-base font-normal text-text-secondary bg-bg px-4 py-1.5 rounded-lg border border-border-custom/20">
                    方向: {selectedPersonas.length}个
                  </span>
                )}
                {selectedPlatform && (
                  <span className="text-base font-normal text-text-secondary bg-bg px-4 py-1.5 rounded-lg border border-border-custom/20">
                    平台: {selectedPlatform}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topics Pool Section */}
      <div className="space-y-6">
        {/* Title + Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
          <h2 className="text-3xl font-semibold text-text tracking-tighter">每日爆款话题池</h2>

          {/* 1.1 & 1.2 控制开关 */}
          <div className="flex items-center gap-3">
            {/* 智能推荐模式 */}
            <button
              onClick={() => setSmartSort(!smartSort)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all border press",
                smartSort
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-card border-border-custom/20 text-text-muted hover:border-border-custom/30"
              )}
            >
              <Sparkles size={14} className={cn(smartSort && "animate-pulse")} />
              智能推荐模式
              <div className={cn(
                "w-7 h-4 rounded-full relative transition-colors",
                smartSort ? "bg-primary" : "bg-text-muted"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 bg-card rounded-full shadow-sm transition-all",
                  smartSort ? "left-3.5" : "left-0.5"
                )} />
              </div>
            </button>

            {/* 自动屏蔽低效话题 */}
            <button
              onClick={() => setAutoBlock(!autoBlock)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all border press",
                autoBlock
                  ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800/30"
                  : "bg-card border-border-custom/20 text-text-muted hover:border-border-custom/30"
              )}
            >
              <Shield size={14} />
              自动屏蔽低效话题
              <div className={cn(
                "w-7 h-4 rounded-full relative transition-colors",
                autoBlock ? "bg-red-400" : "bg-text-muted"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 bg-card rounded-full shadow-sm transition-all",
                  autoBlock ? "left-3.5" : "left-0.5"
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* 屏蔽提示 */}
        <AnimatePresence>
          {autoBlock && blockedCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-base font-normal text-red-500 dark:bg-red-900/20 dark:border-red-800/30">
                <Shield size={13} />
                已为你屏蔽 {blockedCount} 类低互动话题（{BLOCKED_TAGS.join('、')}）
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1.3 标签云 + 话题列表 双栏 */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* 话题列表 */}
          <div className="flex-1 apple-card relative z-10">
            <div className="divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayTrends.map(t => t.id).join(',')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="divide-y divide-[#18202B]/10 dark:divide-[#D3DFF2]/10"
                >
                  {displayTrends.length === 0 ? (
                    <div className="px-10 py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mb-5 text-text-muted">
                        <Search size={28} />
                      </div>
                      <h3 className="text-lg font-normal text-text mb-1">暂无符合条件的话题</h3>
                      <p className="text-base text-text-secondary max-w-sm">尝试关闭筛选条件或切换标签</p>
                    </div>
                  ) : (
                    displayTrends.map((topic, i) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-10 py-8 hover:bg-hover-accent transition-all group flex items-center justify-between gap-10"
                      >
                        <div className="flex items-center gap-8 flex-1 min-w-0">
                          <div className="h-12 w-12 shrink-0 bg-bg rounded-2xl flex items-center justify-center text-text group-hover:bg-primary group-hover:text-text transition-all font-medium text-lg border border-border-custom/20">
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {topic.tags.map(tag => (
                                <span key={tag} className={cn(
                                  "text-sm font-medium uppercase tracking-widest px-2 py-0.5 rounded-lg",
                                  HIGH_CONVERSION_TAGS.some(t => t.name === tag)
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-muted"
                                )}>{tag}</span>
                              ))}
                              {/* 1.1 智能推荐标签 */}
                              {smartSort && i < 3 && (
                                <span className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30">
                                  <Heart size={10} className="fill-amber-500" />
                                  你的粉丝更爱这类
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-text truncate group-hover:text-primary transition-colors tracking-tight">
                              {topic.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-16 shrink-0">
                          <div className="text-right">
                          <p className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">热度指数</p>
                          <p className="text-lg font-medium text-text">{topic.heat}%</p>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">匹配度</p>
                            <p className="text-lg font-medium text-primary">{topic.score}/10</p>
                          </div>
                      <button
                        onClick={() => handleAdopt(topic)}
                        className="h-12 px-8 bg-primary text-white text-base font-semibold uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all press"
                      >
                        采用
                      </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 1.3 话题效果标签云 — 右侧边栏 */}
          <div className="lg:w-[280px] shrink-0 space-y-4">
            <div className="apple-card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Tag size={15} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-text uppercase tracking-widest">你的高转化话题标签</h3>
              </div>

              <p className="text-base text-text-muted font-normal leading-relaxed">
                增长分析引擎根据历史数据计算，以下标签的点赞率表现最佳，点击可快速筛选相关话题。
              </p>

              <div className="flex flex-wrap gap-2">
                {HIGH_CONVERSION_TAGS.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setActiveTagFilter(prev => prev === tag.name ? null : tag.name)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-base font-normal transition-all border press",
                      activeTagFilter === tag.name
                        ? "bg-primary text-white border-primary"
                        : "bg-bg text-text-secondary border-border-custom/15 hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {tag.name}
                      <span className={cn(
                        "text-sm font-medium px-1.5 py-0.5 rounded-md",
                        activeTagFilter === tag.name ? "bg-white/40 text-text" : "bg-bg text-text-muted"
                      )}>
                        {tag.rate}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* 当前筛选提示 */}
              <AnimatePresence>
                {activeTagFilter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between pt-3 border-t border-border-custom/15">
                      <span className="text-base font-normal text-text-muted">
                        筛选: <span className="text-primary">{activeTagFilter}</span>
                      </span>
                      <button
                        onClick={() => setActiveTagFilter(null)}
                        className="text-sm font-medium text-text-muted hover:text-text uppercase tracking-widest transition-colors press"
                      >
                        清除筛选
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 排序说明卡片 */}
            <div className="apple-card bg-bg p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-text-muted" />
                <h4 className="text-sm font-semibold text-text-muted uppercase tracking-widest">排序逻辑</h4>
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "flex items-center gap-2 text-base font-normal transition-colors",
                  smartSort ? "text-primary" : "text-text-muted"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", smartSort ? "bg-primary" : "bg-text-muted")} />
                  智能模式: 历史互动率 × 0.6 + 模拟热度 × 0.4
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-base font-normal transition-colors",
                  !smartSort ? "text-primary" : "text-text-muted"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", !smartSort ? "bg-primary" : "bg-text-muted")} />
                  默认模式: 仅按模拟热度排序
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}
