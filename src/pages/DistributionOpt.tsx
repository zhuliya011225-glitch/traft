import React, { useState, useEffect } from 'react';
import {
  Share2,
  RotateCcw,
  Clock,
  Tag,
  Instagram,
  Smartphone,
  Video,
  Type,
  Layout,
  Image as ImageIcon,
  Sparkles,
  Zap,
  FileText,
  Copy,
  History,
  X,
  ChevronRight,
  Cpu,
  ChevronDown,
  Globe,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PLATFORM_META: Record<string, { icon: any; color: string; bg: string }> = {
  '小红书': { icon: Instagram, color: 'text-red-500', bg: 'bg-red-50' },
  '抖音': { icon: Smartphone, color: 'text-text', bg: 'bg-bg' },
  '视频号': { icon: Video, color: 'text-orange-500', bg: 'bg-orange-50' },
  'B站': { icon: Share2, color: 'text-pink-400', bg: 'bg-pink-50' },
};

const RECENT_SCRIPTS = [
  { id: '1', title: '2024副业实操分享', content: '内容大纲：关于普通人如何利用业余时间进行技能变现的3个真实案例...' },
  { id: '2', title: 'AI工具提效全流程', content: '脚本重点：聚焦Notion与ChatGPT的深度联动，展示从灵感到成文的闭环...' },
  { id: '3', title: '职业倦怠缓解指南', content: '情绪引导：针对30岁职场人的焦虑，提供科学的心态调节与行动建议...' }
];

const AVAILABLE_MODELS = [
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', desc: '全能型，适合复杂创作' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: '快速响应，适合快速迭代' },
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', desc: '深度理解，适合精细调整' },
];

// 3.1 个人化发布时间基准线
const PERSONAL_BEST_TIME: Record<string, { day: string; time: string; sampleSize: number; metric: string }> = {
  '小红书': { day: '周二', time: '21:00', sampleSize: 5, metric: '平均收藏量最高' },
  '抖音': { day: '周五', time: '19:30', sampleSize: 5, metric: '平均播放量最高' },
  '视频号': { day: '周三', time: '20:00', sampleSize: 5, metric: '平均点赞量最高' },
  'B站': { day: '周六', time: '18:00', sampleSize: 5, metric: '平均完播率最高' },
};

// 3.2 标题风格锁定数据
const TITLE_STYLES = [
  { id: 'auto', label: '自动优选', desc: '系统推荐' },
  { id: 'shock', label: '震惊型', ctr: '12.5%', delta: '+5%', deltaColor: 'text-emerald-500' },
  { id: 'dry', label: '干货型', ctr: '18.2%', delta: '+23%', deltaColor: 'text-emerald-500' },
  { id: 'question', label: '提问型', ctr: '15.8%', delta: '+14%', deltaColor: 'text-emerald-500' },
];

const TITLES_BY_STYLE: Record<string, Record<string, string[]>> = {
  '小红书': {
    'shock': ['惊呆了！普通人一个月实现职业跃迁的秘密', '别再盲目报班了，这套方法绝了！', '3个细节，让你的主页瞬间高级到离谱'],
    'dry': ['普通人如何用一个月实现职业跃迁？', '别再盲目报班了，这套自学流利口语的方法绝了！', '3个细节，让你的Notion主页瞬间变高级'],
    'question': ['普通人真的能在一个月内实现职业跃迁吗？', '为什么你报了很多班却依然没进步？', '你的Notion主页为什么总是看起来很乱？'],
  },
  '抖音': {
    'shock': ['这个AI工具，让我的工作效率翻了10倍！', '2024搞钱新赛道：很多人还不知道...', '建议收藏！5个相见恨晚的黑科技网站'],
    'dry': ['实测3款AI工具，效率提升效果对比', '2024副业收入结构完整拆解（附数据）', '5个被低估的生产力工具，第3个太好用了'],
    'question': ['AI工具真的能让效率翻10倍吗？', '为什么你看了很多搞钱视频却没行动？', '你知道那几个真正好用的黑科技网站吗？'],
  },
  '视频号': {
    'shock': ['视频号新红利：AI数字人直播单日播放破10万+', 'ChatGPT+Sora：短视频创作进入"个人好莱坞"时代', '揭秘：Cursor一键生成爆款营销小游戏全流程'],
    'dry': ['视频号AI数字人直播全流程拆解（2024版）', 'ChatGPT与Sora在短视频创作中的实战应用', 'Cursor生成视频号小游戏：从0到1操作指南'],
    'question': ['视频号现在做AI数字人直播还来得及吗？', 'Sora真的能让普通人拍出好莱坞级视频吗？', 'Cursor生成的小游戏真的能上热门吗？'],
  },
  'B站': {
    'shock': ['我用AI做了100个视频后，总结出的5条血泪经验', '从0粉到10万：一个知识区UP主的底层方法论', '这套内容框架，让我每条视频都上热门'],
    'dry': ['AI批量做视频：100条实战后的5条经验总结', '知识区UP主从0到10万的完整成长路径', '可复制的内容框架：热门视频结构拆解'],
    'question': ['AI做视频真的能坚持下去吗？', '知识区UP主最大的成长瓶颈是什么？', '为什么你的视频总是差一口气上热门？'],
  },
};

// 3.3 热门标签池
const HOT_TAGS_POOL: Record<string, string[]> = {
  '小红书': ['#新中式', '#氛围感', '#OOTD', '#沉浸式', '#合集', '#教程', '#测评'],
  '抖音': ['#神操作', '#万万没想到', '#教程', '#挑战', '#反转', '#共鸣'],
  '视频号': ['#认知', '#商业思维', '#干货', '#人性', '#成长', '#正能量'],
  'B站': ['#硬核', '#科普', '#解说', '#测评', '#考古', '#鬼畜'],
};

const LOW_EFFICIENCY_TAGS = ['#日常', '#随手拍', '#生活', '#记录', '#碎片'];

interface SuggestionData {
  titles: string[];
  copy: string;
  tags: string[];
  covers: { type: string; desc: string; color: string; textColor?: string }[];
  time: string;
  confidence: number;
  reasons: string[];
}

const MOCK_SUGGESTIONS: Record<string, SuggestionData> = {
  '小红书': {
    titles: [
      '普通人如何用一个月实现职业跃迁？',
      '别再盲目报班了，这套自学流利口语的方法绝了！',
      '3个细节，让你的Notion主页瞬间变高级'
    ],
    copy: '姐妹们，今天分享一个超实用的方法！之前我也是完全不知道怎么开始，直到发现了这个思路... 建议收藏反复观看！',
    tags: ['#职场成长', '#学习心得', '#效率提升', '#Notion', '#自律', '#干货', '#笔记', '#职业规划'],
    covers: [
      { type: '对比图', desc: 'Before & After 效果明亮对比', color: 'bg-red-50' },
      { type: '清单流', desc: '纯色背景 + 大字体标题', color: 'bg-orange-50' }
    ],
    time: '19:30 - 20:15',
    confidence: 94,
    reasons: ['核心用户晚间活跃高峰', '生活方式类内容权重增加', '周末前用户学习意愿强']
  },
  '抖音': {
    titles: [
      '这个AI工具，让我的工作效率翻了10倍！',
      '2024搞钱新赛道：很多人还不知道...',
      '建议收藏！5个相见恨晚的黑科技网站'
    ],
    copy: '兄弟们，这个工具真的绝了！用了之后每天多睡两小时，效率直接起飞。赶紧点赞收藏，怕你刷着刷着找不到了！',
    tags: ['#AI干货', '#工具推荐', '#效率神器', '#黑科技', '#实用技巧', '#程序员', '#生产力'],
    covers: [
      { type: '快闪封面', desc: '高饱和度背景 + 夸张人像', color: 'bg-text', textColor: 'text-bg' },
      { type: '知识地图', desc: '分支结构图，吸引长停留', color: 'bg-blue-50' }
    ],
    time: '12:00 - 13:00',
    confidence: 88,
    reasons: ['午休碎片化流量峰值', '同赛道博主通常在下午发文', '饭前用户刷视频意愿高']
  },
  '视频号': {
    titles: [
      '视频号新红利：AI数字人直播全流程拆解',
      'ChatGPT+Sora：2024短视频创作进入"个人好莱坞"时代',
      '视频号算法逻辑更新：高价值AI科普内容成流量新增长点'
    ],
    copy: '今天这条视频，给你完整拆解视频号的最新玩法。不废话，直接上干货。看完记得转发给你做视频的朋友！',
    tags: ['#视频号', '#AI数字人', '#短视频', '#算法', '#流量密码', '#自媒体'],
    covers: [
      { type: '真人出镜', desc: '口播 + 字幕强调重点', color: 'bg-green-50' },
      { type: '数据可视化', desc: '图表 + 趋势箭头', color: 'bg-blue-50' }
    ],
    time: '20:00 - 21:30',
    confidence: 91,
    reasons: ['晚间家庭场景流量集中', '中老年用户活跃高峰', '长视频完播率更优']
  },
  'B站': {
    titles: [
      '我用AI做了100个视频后，总结出的5条血泪经验',
      '从0粉到10万：一个知识区UP主的底层方法论',
      '这套内容框架，让我每条视频都上热门'
    ],
    copy: '大家好，我是XX。做UP主三年了，今天想和大家聊聊我踩过的坑和总结的方法论。如果你觉得有帮助，记得一键三连！',
    tags: ['#知识区', '#UP主', '#内容创作', '#方法论', '#成长记录', '#B站'],
    covers: [
      { type: '信息图', desc: '分镜 + 关键数据高亮', color: 'bg-pink-50' },
      { type: '氛围感', desc: '暗色背景 + 霓虹灯效果', color: 'bg-purple-50' }
    ],
    time: '18:00 - 19:30',
    confidence: 89,
    reasons: ['放学后/下班后用户集中上线', '长视频消费意愿最强时段', '弹幕互动活跃度峰值']
  },
};

export default function DistributionOpt({ triggerToast, selectedPlatform }: { triggerToast: (m: string) => void, selectedPlatform: string | null }) {
  const [scriptContent, setScriptContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 模型选择
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // 3.1 个人化发布时间
  const [adoptedPersonalTime, setAdoptedPersonalTime] = useState(false);

  // 3.2 标题风格锁定
  const [lockedStyle, setLockedStyle] = useState<string>('auto');

  // 3.3 标签管理
  const [displayTags, setDisplayTags] = useState<string[]>([]);
  const [autoReplaceLowEffTags, setAutoReplaceLowEffTags] = useState(false);
  const [isSyncingTags, setIsSyncingTags] = useState(false);

  const filterLowEffTags = (tags: string[], enabled: boolean) => {
    if (!enabled) return tags;
    return tags.filter(t => !LOW_EFFICIENCY_TAGS.includes(t));
  };

  const handleImport = () => {
    if (!scriptContent) return;
    if (!selectedPlatform) {
      triggerToast("请先选择发布平台");
      return;
    }
    setIsAnalyzing(true);
    triggerToast(`正在使用 ${AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name} 生成分发策略...`);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      // 初始化标签
      const base = MOCK_SUGGESTIONS[selectedPlatform] || MOCK_SUGGESTIONS['小红书'];
      setDisplayTags(filterLowEffTags(base.tags, autoReplaceLowEffTags));
      triggerToast("分发策略已生成！");
    }, 1500);
  };

  // 当自动替换开关变化时，重新过滤标签
  useEffect(() => {
    if (isAnalyzed && selectedPlatform) {
      const base = (MOCK_SUGGESTIONS[selectedPlatform] || MOCK_SUGGESTIONS['小红书']).tags;
      setDisplayTags(filterLowEffTags(base, autoReplaceLowEffTags));
    }
  }, [autoReplaceLowEffTags, isAnalyzed, selectedPlatform]);

  const handleSyncTags = () => {
    if (!selectedPlatform) return;
    setIsSyncingTags(true);
    triggerToast("正在同步本领域热门标签...");
    setTimeout(() => {
      const hot = HOT_TAGS_POOL[selectedPlatform] || [];
      const base = (MOCK_SUGGESTIONS[selectedPlatform] || MOCK_SUGGESTIONS['小红书']).tags;
      // 合并并去重，优先保留原标签，补充热门标签
      const merged = Array.from(new Set([...base, ...hot])).slice(0, 10);
      setDisplayTags(filterLowEffTags(merged, autoReplaceLowEffTags));
      setIsSyncingTags(false);
      triggerToast("热门标签已同步！");
    }, 800);
  };

  const selectHistory = (content: string) => {
    setScriptContent(content);
    setShowHistory(false);
    triggerToast("已加载历史脚本记录");
  };

  const current = selectedPlatform ? (MOCK_SUGGESTIONS[selectedPlatform] || MOCK_SUGGESTIONS['小红书']) : null;
  const personalBest = selectedPlatform ? PERSONAL_BEST_TIME[selectedPlatform] : null;

  // 根据风格锁定获取标题
  const getDisplayTitles = () => {
    if (!current || !selectedPlatform) return [];
    if (lockedStyle === 'auto' || !TITLES_BY_STYLE[selectedPlatform]?.[lockedStyle]) {
      return current.titles;
    }
    return TITLES_BY_STYLE[selectedPlatform][lockedStyle];
  };

  const platformMeta = selectedPlatform ? PLATFORM_META[selectedPlatform] : null;
  const PlatformIcon = platformMeta?.icon || Globe;

  return (
    <div className="space-y-8 pb-12 pt-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold text-text tracking-tight">发布优化</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* 当前平台（只读） */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-normal",
            platformMeta
              ? `${platformMeta.bg} ${platformMeta.color} border-border-custom/20`
              : "bg-bg text-text-muted border-border-custom/20"
          )}>
            <PlatformIcon size={15} />
            <span>{selectedPlatform || '未选择平台'}</span>
          </div>

          {/* 模型选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg hover:bg-hover-accent rounded-xl text-base font-normal text-text-secondary transition-all border border-border-custom/20 press"
            >
              <Cpu size={13} className="text-primary" />
              <span>{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
              <ChevronDown size={14} className={cn("text-text-muted transition-transform shrink-0", showModelDropdown && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showModelDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    className="absolute top-full mt-2 right-0 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-50 min-w-[220px]"
                  >
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                        className={cn(
                          "w-full text-left px-4 py-3.5 hover:bg-hover-accent transition-all border-b last:border-b-0 border-border-custom/15 press",
                          selectedModel === model.id ? "bg-primary/5" : ""
                        )}
                      >
                        <p className={cn(
                          "text-base font-normal",
                          selectedModel === model.id ? "text-primary" : "text-text"
                        )}>{model.name}</p>
                        <p className="text-base text-text-muted">{model.desc}</p>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Script Import Box */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="apple-card p-6 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-1 w-full relative group">
            <textarea
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="导入或添加已完成脚本，AI 将自动生成对应平台风格的标题、文案与标签..."
              className="w-full h-24 bg-bg border-none rounded-2xl p-5 text-base font-normal focus:ring-4 focus:ring-primary/5 transition-all resize-none placeholder:text-text-muted"
            />
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="absolute right-4 bottom-4 flex items-center gap-2 px-3 py-1.5 bg-card border border-border-custom/20 rounded-lg text-base font-semibold text-text-muted hover:text-primary transition-all press"
            >
              <History size={12} />
              最近生成的脚本
            </button>
          </div>
          <button
            onClick={handleImport}
            disabled={!scriptContent || isAnalyzing}
            className={cn(
              "w-full md:w-auto h-24 px-10 bg-primary text-white rounded-2xl font-semibold text-base uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-3 transition-all hover:bg-primary/90 press disabled:opacity-30 disabled:pointer-events-none",
              isAnalyzing && "animate-pulse"
            )}
          >
            {isAnalyzing ? <RotateCcw size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {isAnalyzing ? "AI 生成中..." : "一键生成"}
          </button>
        </motion.div>

        {/* History Dropdown */}
        <AnimatePresence>
          {showHistory && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 mt-4 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-50 p-6 w-full max-w-lg overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-text-muted uppercase tracking-widest">脚本历史记录</h4>
                  <button onClick={() => setShowHistory(false)} className="text-text-muted hover:text-text press"><X size={14}/></button>
                </div>
                <div className="space-y-3">
                  {RECENT_SCRIPTS.map(script => (
                    <button
                      key={script.id}
                      onClick={() => selectHistory(script.content)}
                      className="w-full text-left p-4 bg-bg rounded-2xl border border-transparent hover:border-primary hover:bg-card transition-all group press"
                    >
                      <p className="text-base font-semibold text-text mb-1 group-hover:text-primary transition-colors">{script.title}</p>
                      <p className="text-base text-text-muted truncate">{script.content}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Generated Results */}
      <AnimatePresence mode="wait">
        {isAnalyzed && current && (
          <motion.div
            key={selectedPlatform + selectedModel + lockedStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* 1. 标题变体 + 文案优化 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 标题变体 */}
              <div className="apple-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-bg rounded-2xl text-text"><Type size={20} /></div>
                  <h3 className="text-xl font-semibold text-text tracking-tight">标题变体建议</h3>
                  <span className="text-base font-semibold text-text-muted uppercase tracking-[0.15em] ml-auto">A/B 测试</span>
                </div>

                {/* 3.2 风格锁定栏 */}
                <div className="bg-bg rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock size={13} className="text-text-muted" />
                    <p className="text-base font-semibold text-text-secondary uppercase tracking-widest">标题风格锁定</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TITLE_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setLockedStyle(style.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-normal transition-all border press",
                          lockedStyle === style.id
                            ? "bg-primary text-white border-primary"
                            : "bg-card text-text-secondary border-border-custom/20 hover:border-border-custom/30"
                        )}
                      >
                        <span>{style.label}</span>
                        {style.id !== 'auto' && (
                          <span className={cn("text-base font-semibold", style.deltaColor)}>
                            点击率 {style.ctr} <span className="opacity-70">{style.delta}</span>
                          </span>
                        )}
                        {style.id === 'auto' && (
                          <span className="text-base font-semibold text-primary/70">历史最佳</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-base text-text-muted font-normal">
                    {lockedStyle === 'auto'
                      ? '系统自动选择你账号历史点击率最高的标题风格'
                      : `已锁定「${TITLE_STYLES.find(s => s.id === lockedStyle)?.label}」，仅生成该风格标题`}
                  </p>
                </div>

                <div className="space-y-3">
                  {getDisplayTitles().map((title, i) => (
                    <motion.div
                      key={title + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => triggerToast("已复制到剪贴板")}
                      className="group p-5 bg-bg rounded-2xl border border-transparent hover:border-primary hover:bg-card transition-all cursor-pointer flex items-center justify-between gap-4 press"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-card text-sm font-semibold flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-text transition-all">
                          #{i+1}
                        </span>
                        <p className="text-base font-normal text-text-secondary group-hover:text-primary transition-colors">{title}</p>
                      </div>
                      <Copy size={16} className="text-text-muted group-hover:text-primary transition-colors shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 文案优化 */}
              <div className="apple-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-bg rounded-2xl text-text"><FileText size={20} /></div>
                  <h3 className="text-xl font-semibold text-text tracking-tight">文案优化</h3>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-widest ml-auto">
                    {selectedPlatform} 风格
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-bg rounded-2xl border border-border-custom/15"
                >
                  <p className="text-lg font-normal text-text-secondary leading-relaxed">{current.copy}</p>
                </motion.div>
                <div className="flex items-center gap-2 text-base font-normal text-text-muted">
                  <Sparkles size={12} className="text-primary" />
                  由 {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name} 根据 {selectedPlatform} 平台调性自动生成
                </div>
              </div>
            </div>

            {/* 2. 推荐标签 + 视觉策略 */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 标签 */}
              <div className="apple-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-bg rounded-2xl text-text"><Tag size={20} /></div>
                  <h3 className="text-xl font-semibold text-text tracking-tight">推荐标签</h3>
                </div>

                {/* 3.3 标签操作栏 */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleSyncTags}
                    disabled={isSyncingTags}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-semibold uppercase tracking-widest transition-all press disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={cn(isSyncingTags && "animate-spin")} />
                    {isSyncingTags ? '同步中...' : '同步本领域热门标签'}
                  </button>

                  <button
                    onClick={() => setAutoReplaceLowEffTags(!autoReplaceLowEffTags)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold uppercase tracking-widest transition-all border press",
                      autoReplaceLowEffTags
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800/30"
                        : "bg-card border-border-custom/20 text-text-muted hover:border-border-custom/30"
                    )}
                  >
                    <ShieldCheck size={13} />
                    自动替换低效标签
                    <div className={cn(
                      "w-7 h-4 rounded-full relative transition-colors",
                      autoReplaceLowEffTags ? "bg-emerald-400" : "bg-text-muted"
                    )}>
                      <div className={cn(
                        "absolute top-0.5 w-3 h-3 bg-card rounded-full shadow-sm transition-all",
                        autoReplaceLowEffTags ? "left-3.5" : "left-0.5"
                      )} />
                    </div>
                  </button>
                </div>

                {autoReplaceLowEffTags && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-base font-normal text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                      <TrendingUp size={12} />
                      已自动过滤从未带来互动的标签，优先推荐高效标签
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-4 py-2.5 bg-primary text-white text-base font-semibold uppercase tracking-widest rounded-xl hover:bg-primary/90 cursor-pointer transition-all press"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* 封面 */}
              <div className="apple-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-bg rounded-2xl text-text"><ImageIcon size={20} /></div>
                  <h3 className="text-xl font-semibold text-text tracking-tight">视觉策略</h3>
                </div>
                <div className="space-y-3">
                  {current.covers.map((c, i) => (
                    <motion.div
                      key={c.type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn("p-5 rounded-2xl group cursor-pointer transition-all border border-transparent hover:border-border-custom/20", c.color || "bg-bg")}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Layout size={14} className={cn(c.textColor || "text-text")} />
                        <span className={cn("text-sm font-semibold uppercase tracking-[0.2em]", c.textColor || "text-text")}>
                          {c.type}
                        </span>
                      </div>
                      <p className={cn("text-base font-normal leading-relaxed opacity-70", c.textColor || "text-text-secondary")}>
                        {c.desc}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <ChevronRight size={14} className={cn("opacity-0 group-hover:opacity-100 transition-all", c.textColor || "text-text-muted")} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 发布窗口推荐 — 放在最后 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="apple-card p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Clock size={20} /></div>
                <div>
                  <h3 className="text-xl font-semibold text-text tracking-tight">发布窗口推荐</h3>
                  <p className="text-base font-semibold text-text-muted uppercase tracking-widest mt-0.5">
                    分发几率 {current.confidence}%
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-bg rounded-2xl p-6 text-center border border-border-custom/15">
                  <span className="text-base font-semibold text-primary uppercase tracking-[0.2em] mb-2 block">推荐时机</span>
                  <span className="text-base font-semibold text-text tracking-tighter">{adoptedPersonalTime && personalBest ? `${personalBest.day} ${personalBest.time}` : current.time}</span>
                </div>
                <div className="md:col-span-2 bg-bg rounded-2xl p-6 border border-border-custom/15">
                  <p className="text-base font-semibold text-text-secondary uppercase tracking-widest mb-3">推荐理由</p>
                  <div className="space-y-2">
                    {current.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-base font-normal text-text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3.1 个人化发布时间基准线 */}
              {personalBest && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <BarChart3 size={17} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-text-secondary uppercase tracking-widest">基于你的历史最佳时段</p>
                      <p className="text-base font-normal text-text">
                        根据你过去 {personalBest.sampleSize} 条{selectedPlatform}数据，{personalBest.day} {personalBest.time} {personalBest.metric}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAdoptedPersonalTime(!adoptedPersonalTime);
                      triggerToast(adoptedPersonalTime ? "已恢复通用推荐时间" : "已采用你的专属最佳时段");
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-base font-semibold uppercase tracking-wider transition-all press shrink-0",
                      adoptedPersonalTime
                        ? "bg-bg text-text-secondary hover:bg-hover-accent border border-border-custom/20"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                  >
                    {adoptedPersonalTime ? '恢复通用时间' : '采用此时间'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isAnalyzed && (
        <div className="apple-card flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mb-5 text-text-muted">
            <Sparkles size={28} />
          </div>
          <h3 className="text-xl font-normal text-text mb-1">导入脚本，一键生成发布策略</h3>
          <p className="text-lg text-text-secondary max-w-sm leading-relaxed">
            AI 将自动为您生成符合 {selectedPlatform || '目标平台'} 风格的标题、文案、标签与发布时机建议
          </p>
        </div>
      )}
    </div>
  );
}
