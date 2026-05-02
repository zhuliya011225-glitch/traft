import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  Mic,
  BrainCircuit,
  Zap,
  Clock,
  Activity,
  Paperclip,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  PenTool,
  ChevronDown,
  Flame,
  Cpu,
  Settings,
  Plus,
  Cloud,
  History,
  Layout,
  X,
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { NavigationData, Project, TrendTopic } from '../types';

type ScriptType = 'emotional' | 'dry' | 'story' | 'list';
type Tempo = 'fast' | 'medium' | 'slow';
type Opening = 'suspense' | 'shock' | 'resonance' | 'question';

const MOCK_RECENT_PROJECTS: Project[] = [
  { id: '1', title: '小红书爆款封面方案：', subtitle: 'Cursor+Claude3.5做App', content: '这里是项目的具体草稿内容，包含标题建议和分段正文...', updatedAt: '2小时前', platform: '小红书', status: 'draft' },
  { id: '2', title: 'Midjourney国潮风关键词：', subtitle: '从0到1商业模式拆解', content: '分析国潮风的设计要素，并给出具体的MD提示词组...', updatedAt: '昨天', platform: '小红书', status: 'published' },
  { id: '3', title: '抖音脚本：', subtitle: '5个ChatGPT提示词提效200%', content: '开场白：你还在为写脚本头疼吗？这里有5个开挂般的提示词...', updatedAt: '3天前', platform: '抖音', status: 'published' },
  { id: '4', title: '副业笔记：AI工具集锦', subtitle: '如何利用AI月入万', content: '详细列出2024年最值得关注的10款AI副业利器...', updatedAt: '4天前', platform: '小红书', status: 'draft' },
  { id: '5', title: '知乎问答：内容营销方案', subtitle: '如何写出高赞回答', content: '针对知乎社区调性，从专业性、故事性、互动性三个维度出发...', updatedAt: '1周前', platform: '知乎', status: 'published' },
];

export default function ScriptWorkshop({ triggerToast, initialData, onClearInitialData, onNavigate, selectedPlatform, setSelectedPlatform }: { triggerToast: (m: string) => void, initialData?: NavigationData | null, onClearInitialData?: () => void, onNavigate?: (page: string) => void, selectedPlatform: string | null, setSelectedPlatform: (p: string | null) => void }) {

  // Input State
  const [inputText, setInputText] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showRecentMenu, setShowRecentMenu] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string, name: string, type: string }[]>([]);

  // Config State
  const [scriptType, setScriptType] = useState<ScriptType>('emotional');
  const [imitationSource, setImitationSource] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [tempo, setTempo] = useState<Tempo>('medium');
  const [opening, setOpening] = useState<Opening>('suspense');

  // Generation & Editor State
  const [isGenerating, setIsGenerating] = useState(false);
  const [editorContent, setEditorContent] = useState<string>('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings & Optimization State
  const [showSettings, setShowSettings] = useState(true);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [optimizationPrompt, setOptimizationPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // UI toggle states for collapsible sections
  const [showConfigPanel, setShowConfigPanel] = useState(true);

  const availableModels = [
    { id: 'gemini-pro', name: 'Gemini 1.5 Pro', desc: '全能型，适合复杂创作' },
    { id: 'gpt-4o', name: 'GPT-4o', desc: '快速响应，适合快速迭代' },
    { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', desc: '深度理解，适合精细调整' },
  ];

  useEffect(() => {
    if (initialData) {
      if (initialData.type === 'project') {
        const p = initialData.data as Project;
        setInputText(p.content || p.title);
        triggerToast("已加载项目内容");
      } else {
        const t = initialData.data as TrendTopic;
        setInputText(`【热点采用】${t.title}\n\n在这里展开你的创作思路...`);
        triggerToast("已填充热点话题");
      }
      onClearInitialData?.();
    }
  }, [initialData]);

  // 2.3 违禁词检测
  useEffect(() => {
    if (!editorContent) {
      setDetectedWords([]);
      return;
    }
    const found: {word: string, index: number}[] = [];
    Object.keys(forbiddenWords).forEach(word => {
      const regex = new RegExp(word, 'g');
      let match;
      while ((match = regex.exec(editorContent)) !== null) {
        found.push({ word, index: match.index });
      }
    });
    setDetectedWords(found);
  }, [editorContent]);

  const handleSelectRecent = (project: Project) => {
    setInputText(project.content || project.title);
    setShowRecentMenu(false);
    triggerToast(`已切换至: ${project.title}`);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
    setShowUploadMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    e.target.value = '';
  };

  const uploadFile = async (file: File) => {
    triggerToast(`正在解析: ${file.name}...`);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) { triggerToast(`解析失败: ${data.error}`); return; }

      setInputText(prev => {
        const prefix = prev ? prev + '\n\n---\n\n' : '';
        return prefix + `【${file.name}】\n${data.text}`;
      });
      setUploadedFiles(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: file.name, type: file.type }]);
      triggerToast(`解析完成: ${file.name} (${data.charCount || data.text.length}字)`);
    } catch (err) {
      triggerToast('上传失败，请检查网络');
    }
  };

  const scriptTypes = [
    { id: 'emotional', label: '情绪共鸣', desc: '打动人心' },
    { id: 'dry', label: '知识干货', desc: '步骤清晰，学完即用' },
    { id: 'story', label: '个人经历', desc: '真实故事，引发共鸣' },
    { id: 'list', label: '清单盘点', desc: '3个方法，5个工具' },
  ];

  const tempoOptions = [
    { id: 'fast', label: '激进快节奏' },
    { id: 'medium', label: '沉稳中节奏' },
    { id: 'slow', label: '细腻慢节奏' },
  ];

  const openingOptions = [
    { id: 'suspense', label: '深度悬念式' },
    { id: 'shock', label: '重磅震惊式' },
    { id: 'resonance', label: '情感共鸣式' },
    { id: 'question', label: '反思提问式' },
  ];

  const [showTempoMenu, setShowTempoMenu] = useState(false);
  const [showOpeningMenu, setShowOpeningMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);

  // 2.1 智能参数推荐
  const [showSmartRec, setShowSmartRec] = useState(true);
  const smartRecommendation = {
    type: 'dry' as ScriptType,
    intensity: 4,
    opening: 'question' as Opening,
    tempo: 'medium' as Tempo,
    label: '知识干货 + 情绪强度4 + 反思提问式 + 沉稳中节奏'
  };

  // 2.2 历史爆款模板
  const [showTemplates, setShowTemplates] = useState(false);
  const topTemplates = [
    {
      id: 't1',
      title: 'AI工具提效系列 #3',
      hook: '你可能不知道，就在上个月...',
      hookPosition: '前30字',
      climax: '注意看，这里才是关键！',
      duration: '58s',
      engagement: '9.2分'
    },
    {
      id: 't2',
      title: '副业赚钱实战复盘',
      hook: '99%的人都在犯这个错误...',
      hookPosition: '前20字',
      climax: '这就是完整的闭环逻辑',
      duration: '45s',
      engagement: '8.7分'
    },
    {
      id: 't3',
      title: '职场晋升经验分享',
      hook: '工作三年，我才明白这个道理...',
      hookPosition: '前25字',
      climax: '其实答案很简单',
      duration: '62s',
      engagement: '8.9分'
    }
  ];

  // 2.3 违禁词检测与替换
  const forbiddenWords: Record<string, string[]> = {
    '赚钱': ['获得收益', '实现盈利', '创造价值'],
    '暴利': ['高回报', '可观收益', '超额利润'],
    '躺赚': ['被动收入', '睡后收入', '自动盈利'],
    '最': ['非常', '极其', '相当'],
    '第一': ['领先', '前列', '头部'],
  };
  const [detectedWords, setDetectedWords] = useState<{word: string, index: number}[]>([]);
  const [activeReplaceWord, setActiveReplaceWord] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText) {
      triggerToast("请输入初稿内容");
      return;
    }
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputText,
          scriptType,
          intensity,
          tempo,
          opening,
          platform: selectedPlatform,
        }),
      });
      const data = await res.json();
      if (data.error) { triggerToast(`生成失败: ${data.error}`); setIsGenerating(false); return; }

      setEditorContent(data.script);
      setIsGenerating(false);
      triggerToast(`AI 脚本已生成！`);
    } catch (err) {
      triggerToast("生成失败，请检查网络");
      setIsGenerating(false);
    }
  };

  const handleOptimizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optimizationPrompt || !editorContent) return;

    setIsOptimizing(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: optimizationPrompt,
          scriptType,
          intensity,
          tempo,
          opening,
          platform: selectedPlatform,
          optimizationPrompt,
          contextText: editorContent,
        }),
      });
      const data = await res.json();
      if (data.error) { triggerToast(`优化失败: ${data.error}`); setIsOptimizing(false); return; }

      setEditorContent(data.script);
      setOptimizationPrompt('');
      setIsOptimizing(false);
      triggerToast("脚本已优化完成！");
    } catch (err) {
      triggerToast("优化失败，请检查网络");
      setIsOptimizing(false);
    }
  };

  // 2.1 一键应用推荐参数
  const applySmartRec = () => {
    setScriptType(smartRecommendation.type);
    setIntensity(smartRecommendation.intensity);
    setOpening(smartRecommendation.opening);
    setTempo(smartRecommendation.tempo);
    triggerToast(`已应用推荐参数：${smartRecommendation.label}`);
  };

  // 2.2 复用模板结构
  const applyTemplate = (template: typeof topTemplates[0]) => {
    setInputText(prev => prev + `\n\n[结构约束 - 复用「${template.title}」]\n开头要求：${template.hookPosition}内必须出现强钩子\n爆点位置：参考「${template.climax}」\n建议时长：${template.duration}\n历史互动评分：${template.engagement}`);
    triggerToast(`已注入「${template.title}」的结构约束`);
    setShowTemplates(false);
  };

  // 2.3 替换违禁词
  const replaceForbiddenWord = (original: string, replacement: string) => {
    setEditorContent(prev => prev.replace(new RegExp(original, 'g'), replacement));
    triggerToast(`已替换「${original}」→「${replacement}」`);
    setActiveReplaceWord(null);
  };

  return (
    <div className="pb-12 min-h-screen pt-4 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".txt,.md,.docx,.pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-5xl font-semibold text-text tracking-tight">内容创作</h1>
        </div>
      </div>

      {/* 统一脚本编辑器 */}
      <div className="apple-card flex flex-col relative group w-full">

        {/* ====== Header ====== */}
        <div className="px-8 py-6 border-b border-border-custom/15 flex items-center justify-between bg-bg/30 rounded-t-2xl">
          {/* 左侧：图标 + 标题 + 模型选择 */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
              <PenTool size={18} />
            </div>
            <p className="text-base font-semibold text-text uppercase tracking-widest">脚本编辑器</p>

            {/* 模型选择下拉 — 向下弹出 */}
            <div className="relative ml-1">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-bg hover:bg-hover-accent rounded-xl text-base font-normal text-text-secondary transition-all border border-transparent hover:border-border-custom/20 press"
              >
                <Cpu size={13} className="text-primary" />
                <span>{availableModels.find(m => m.id === selectedModel)?.name}</span>
                <ChevronDown size={14} className={cn("text-text-muted transition-transform shrink-0", showModelDropdown && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showModelDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      className="absolute top-full mt-2 left-0 bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-50 min-w-[220px]"
                    >
                      {availableModels.map((model) => (
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

          {/* 右侧操作按钮 */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-hover-accent rounded-xl text-text-muted transition-all press"><Save size={16}/></button>
            <div className="w-px h-4 bg-border-custom/20 mx-1" />
            <button
              onClick={() => {
                if (!selectedPlatform) {
                  triggerToast("请先选择发布平台");
                  return;
                }
                onNavigate?.('distribution');
              }}
              className="bg-primary px-5 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-primary/90 transition-all uppercase tracking-widest press"
            >发布预览</button>
          </div>
        </div>

        {/* ====== Body ====== */}
        <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border-custom/15 rounded-b-2xl">

          {/* ----- 左侧：输入区 + 参数配置 ----- */}
          <div className="lg:w-[520px] shrink-0 space-y-0">

            {/* 素材输入区 — 上传文件 和 最近项目 两个独立按钮 */}
            <div className="p-7 space-y-4">
              <label className="text-sm font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Type size={15} className="text-primary" />
                输入灵感 / 素材内容
              </label>
              <div className="relative group/input border-2 border-primary/10 rounded-2xl bg-bg/50 overflow-visible transition-all focus-within:border-primary/40 focus-within:ring-8 focus-within:ring-primary/5">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此输入灵感笔记、粘贴素材或直接拖入文件..."
                  className="w-full min-h-[180px] p-6 pb-20 bg-transparent border-none focus:outline-none text-base text-text placeholder:text-text-muted font-normal resize-none shadow-inner leading-loose"
                />

                {/* 底部工具栏 — 上传文件 + 最近项目 分开 */}
                <div className="absolute bottom-3 left-3 right-3 h-13 bg-card border border-border-custom/20 rounded-2xl shadow-lg z-30 flex items-center px-3">
                  {/* 左：上传文件按钮 + 菜单 */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowUploadMenu(!showUploadMenu); setShowRecentMenu(false); }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg text-text-secondary hover:bg-primary hover:text-white transition-all press text-base font-normal",
                          showUploadMenu && "bg-primary text-white"
                        )}
                      >
                        <Plus size={16} />
                        <span>上传文件</span>
                      </button>

                      <AnimatePresence>
                        {showUploadMenu && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowUploadMenu(false)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 8 }}
                              className="absolute bottom-full left-0 mb-3 w-[380px] bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-20 p-5 space-y-3"
                            >
                              <p className="text-base font-semibold text-text uppercase tracking-widest">上传初稿</p>
                              <p className="text-lg text-text-muted leading-relaxed">
                                支持：纯文本不限长度、图片JPG/PNG手写笔记或截图≤5MB、Word .docx自动提取文字、PDF提取文字、语音备忘录Demo阶段请先转文字
                              </p>

                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => handleFileUpload()}
                                  className="flex flex-col items-center gap-2 p-4 hover:bg-bg text-text-secondary transition-colors rounded-xl font-normal border border-border-custom/15 press"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Cloud size={20} />
                                  </div>
                                  <span className="text-base">上传文件</span>
                                </button>
                                <button
                                  onClick={() => handleFileUpload()}
                                  className="flex flex-col items-center gap-2 p-4 hover:bg-bg text-text-secondary transition-colors rounded-xl font-normal border border-border-custom/15 press"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                                    <Paperclip size={20} />
                                  </div>
                                  <span className="text-base">上传图片</span>
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 最近项目按钮 + 菜单 */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowRecentMenu(!showRecentMenu); setShowUploadMenu(false); }}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg text-text-secondary hover:bg-primary hover:text-white transition-all press text-base font-normal",
                          showRecentMenu && "bg-primary text-white"
                        )}
                      >
                        <History size={16} />
                        <span>最近项目</span>
                      </button>

                      <AnimatePresence>
                        {showRecentMenu && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowRecentMenu(false)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 8 }}
                              className="absolute bottom-full left-0 mb-3 w-[320px] bg-card border border-border-custom/20 rounded-2xl shadow-2xl z-20 overflow-hidden"
                            >
                              <div className="px-4 py-3 border-b border-border-custom/15 flex items-center gap-2">
                                <History size={14} className="text-text-muted" />
                                <p className="text-base font-semibold text-text-muted uppercase tracking-widest">最近修改</p>
                              </div>
                              <div className="max-h-[280px] overflow-y-auto custom-scrollbar py-1">
                                {MOCK_RECENT_PROJECTS.map(project => (
                                  <button
                                    key={project.id}
                                    onClick={() => handleSelectRecent(project)}
                                    className="w-full text-left px-4 py-3 hover:bg-bg transition-all flex flex-col gap-1 group/item press"
                                  >
                                    <p className="text-base font-normal text-text group-hover/item:text-primary transition-colors line-clamp-1">{project.title}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-base text-text-muted font-normal uppercase">{project.platform}</span>
                                      <span className="text-base text-text-muted font-normal">•</span>
                                      <span className="text-base text-text-muted font-normal">{project.updatedAt}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex-1" />

                  {/* 右：文件计数 + 麦克风 */}
                  <div className="flex items-center justify-end gap-3 pr-1 shrink-0">
                    {uploadedFiles.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-bg rounded-xl border border-border-custom/15 shrink-0">
                        <Paperclip size={12} className="text-primary" />
                        <span className="text-base font-semibold text-text-secondary">{uploadedFiles.length}</span>
                      </div>
                    )}
                    <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-all press shrink-0">
                      <Mic size={19} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2.1 智能参数推荐面板 */}
            <AnimatePresence>
              {showSmartRec && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mx-6 mt-4 mb-2 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles size={15} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-text-muted uppercase tracking-widest">基于你的数据推荐</p>
                        <p className="text-base font-normal text-text truncate">{smartRecommendation.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={applySmartRec}
                        className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all press"
                      >
                        一键应用
                      </button>
                      <button
                        onClick={() => setShowSmartRec(false)}
                        className="p-2 hover:bg-hover-accent rounded-xl text-text-muted transition-all press"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 参数配置折叠面板 */}
            <div className="border-t border-border-custom/15">
              <button
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className="w-full px-7 py-5 flex items-center justify-between hover:bg-hover-accent transition-colors press"
              >
                <span className="text-base font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit size={15} className="text-primary" />
                  参数配置
                </span>
                <ChevronDown size={17} className={cn("text-text-muted transition-transform duration-200", showConfigPanel && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showConfigPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-7 pb-7 space-y-6">

                      {/* 发布平台选择 */}
                      <div className="space-y-2">
                        <label className="text-sm font-normal text-text-muted uppercase flex items-center gap-2">
                          <Layout size={14} className="text-primary" />
                          发布平台
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => setShowPlatformMenu(!showPlatformMenu)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-bg rounded-2xl text-base font-normal text-text hover:bg-hover-accent transition-all border border-transparent focus:border-primary/20 press"
                          >
                            <span>{selectedPlatform || "选择发布平台..."}</span>
                            <ChevronDown size={17} className={cn("text-text-muted transition-transform shrink-0", showPlatformMenu && "rotate-180")} />
                          </button>
                          <AnimatePresence>
                            {showPlatformMenu && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowPlatformMenu(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                  className="absolute bottom-full mb-2 w-full bg-card border border-border-custom/20 rounded-2xl shadow-xl z-50"
                                >
                                  {['抖音', '小红书', '视频号', 'B站'].map(opt => (
                                    <button
                                      key={opt}
                                      onClick={() => { setSelectedPlatform(opt); setShowPlatformMenu(false); }}
                                      className={cn(
                                        "w-full text-left px-5 py-4 hover:bg-hover-accent text-base font-normal press",
                                        selectedPlatform === opt ? "text-primary" : "text-text-secondary"
                                      )}
                                    >{opt}</button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 脚本类型 */}
                      <div className="grid grid-cols-2 gap-3">
                        {scriptTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setScriptType(type.id as ScriptType)}
                            className={cn(
                              "p-5 rounded-2xl border-2 text-left transition-all press",
                              scriptType === type.id
                                ? "border-primary bg-primary/10"
                                : "border-border-custom/15 hover:border-border-custom/30"
                            )}
                          >
                            <p className={cn(
                              "text-base font-normal transition-colors mb-1",
                              scriptType === type.id ? "text-primary" : "text-text"
                            )}>{type.label}</p>
                            <p className="text-base text-text-muted">{type.desc}</p>
                          </button>
                        ))}
                      </div>

                      {/* 核心关键词 */}
                      <div>
                        <input
                          type="text"
                          value={imitationSource}
                          onChange={(e) => setImitationSource(e.target.value)}
                          placeholder="核心关键词 / 模仿对象"
                          className="w-full px-6 py-4 bg-bg border-2 border-border-custom/15 rounded-2xl text-base font-normal focus:border-primary outline-none placeholder:text-text-muted transition-all"
                        />
                      </div>

                      {/* 情绪强度滑块 */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-normal text-text-muted uppercase flex items-center gap-2">
                            <Flame size={14} className="text-red-500 fill-red-500" />
                            情绪表达强度
                          </label>
                          <span className="text-primary font-semibold text-base">{intensity}<span className="text-base text-text-muted ml-1">LV</span></span>
                        </div>
                        <input
                          type="range" min="1" max="5" step="1"
                          value={intensity}
                          onChange={(e) => setIntensity(parseInt(e.target.value))}
                          className="w-full h-3 bg-bg rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-base font-normal text-text-muted uppercase px-1">
                          <span>平静</span>
                          <span>均衡</span>
                          <span className="text-red-500">火热</span>
                        </div>
                      </div>

                      {/* 内容节奏 + 开头钩子 — 下拉菜单向上弹出 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-normal text-text-muted uppercase flex items-center gap-1.5">
                            <Zap size={13} className="text-primary" /> 内容节奏
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setShowTempoMenu(!showTempoMenu)}
                              className="w-full flex items-center justify-between px-5 py-4 bg-bg rounded-2xl text-base font-normal text-text hover:bg-hover-accent transition-all border border-transparent focus:border-primary/20 press"
                            >
                              <span>{tempoOptions.find(o => o.id === tempo)?.label}</span>
                              <ChevronDown size={17} className={cn("text-text-muted transition-transform shrink-0", showTempoMenu && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                              {showTempoMenu && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowTempoMenu(false)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute bottom-full mb-2 w-full bg-card border border-border-custom/20 rounded-2xl shadow-xl z-50"
                                  >
                                    {tempoOptions.map(opt => (
                                      <button
                                        key={opt.id}
                                        onClick={() => { setTempo(opt.id as Tempo); setShowTempoMenu(false); }}
                                        className={cn(
                                        "w-full text-left px-5 py-4 hover:bg-hover-accent text-base font-normal press",
                                        tempo === opt.id ? "text-primary" : "text-text-secondary"
                                      )}
                                    >{opt.label}</button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-normal text-text-muted uppercase flex items-center gap-1.5">
                            <PenTool size={13} className="text-primary" /> 开头钩子
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setShowOpeningMenu(!showOpeningMenu)}
                              className="w-full flex items-center justify-between px-5 py-4 bg-bg rounded-2xl text-base font-normal text-text hover:bg-hover-accent transition-all border border-transparent focus:border-primary/20 press"
                            >
                              <span>{openingOptions.find(o => o.id === opening)?.label}</span>
                              <ChevronDown size={17} className={cn("text-text-muted transition-transform shrink-0", showOpeningMenu && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                              {showOpeningMenu && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setShowOpeningMenu(false)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute bottom-full mb-2 w-full bg-card border border-border-custom/20 rounded-2xl shadow-xl z-50"
                                  >
                                    {openingOptions.map(opt => (
                                      <button
                                        key={opt.id}
                                        onClick={() => { setOpening(opt.id as Opening); setShowOpeningMenu(false); }}
                                        className={cn(
                                        "w-full text-left px-5 py-4 hover:bg-hover-accent text-base font-normal press",
                                        opening === opt.id ? "text-primary" : "text-text-secondary"
                                      )}
                                    >{opt.label}</button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* 生成按钮 */}
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-4.5 bg-primary text-white rounded-2xl font-semibold text-sm uppercase tracking-[0.15em] hover:bg-primary/90 transition-all press flex items-center justify-center gap-2.5 disabled:opacity-70"
                      >
                        {isGenerating ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <RotateCcw size={18} />
                          </motion.div>
                        ) : <Zap size={18} className="fill-current" />}
                        {isGenerating ? "正在解析并创作..." : "生成脚本"}
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ----- 右侧：编辑器输出 + 设置优化 ----- */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* 编辑器工作区 */}
            <div className="flex-1 relative p-8 flex flex-col">
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  {editorContent ? (
                    <motion.textarea
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      ref={editorRef}
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="w-full h-full bg-transparent border-none focus:ring-0 text-base font-normal text-text-secondary leading-relaxed resize-none custom-scrollbar"
                    />
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-16"
                    >
                      <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mb-5 text-text-muted">
                        <Sparkles size={28} />
                      </div>
                      <h3 className="text-xl font-normal text-text mb-1">等待生成...</h3>
                      <p className="text-base text-text-secondary max-w-sm">在左侧输入内容并配置参数后点击生成</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2.3 违禁词检测提示 */}
              <AnimatePresence>
                {editorContent && detectedWords.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3 dark:bg-red-900/20 dark:border-red-800/30">
                      <div className="flex items-center gap-2">
                        <Flame size={14} className="text-red-500" />
                        <p className="text-base font-semibold text-red-500 uppercase tracking-widest">
                          检测到 {detectedWords.length} 个敏感词，建议替换
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(detectedWords.map(d => d.word))].map(word => (
                          <div key={word} className="relative">
                            <button
                              onClick={() => setActiveReplaceWord(activeReplaceWord === word ? null : word)}
                              className="px-3 py-1.5 bg-card border border-red-200 rounded-xl text-base font-normal text-red-500 hover:bg-red-100 transition-all flex items-center gap-1 press dark:border-red-800/30 dark:hover:bg-red-900/20"
                            >
                              <span className="line-through opacity-50">{word}</span>
                              <ChevronDown size={12} className={cn("transition-transform", activeReplaceWord === word && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                              {activeReplaceWord === word && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  className="absolute bottom-full mb-2 left-0 bg-card border border-border-custom/20 rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]"
                                >
                                  {forbiddenWords[word]?.map((replacement, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => replaceForbiddenWord(word, replacement)}
                                      className="w-full text-left px-3 py-2.5 hover:bg-hover-accent text-base font-normal text-text-secondary transition-all border-b last:border-b-0 border-border-custom/15 press"
                                    >
                                      {replacement}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 元数据栏 */}
            {editorContent && (
              <div className="px-8 py-5 bg-bg border-t border-border-custom/20 flex items-center justify-around gap-8 shrink-0">
                <div className="text-center">
                  <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-1">建议片长</p>
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-primary" />
                    <span className="text-base font-semibold text-text">52s</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-1">脚本字数</p>
                  <div className="flex items-center gap-2">
                    <Type size={13} className="text-primary" />
                    <span className="text-base font-semibold text-text">{editorContent.length}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-text-muted uppercase tracking-widest mb-1">爆点密度</p>
                  <div className="flex items-center gap-2">
                    <Activity size={13} className="text-primary" />
                    <span className="text-base font-semibold text-text">3 处</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2.2 历史最佳脚本模板库 */}
            <div className="border-t border-border-custom/15">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full px-8 py-4 flex items-center justify-between hover:bg-hover-accent transition-colors press"
              >
                <span className="text-base font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <History size={14} className="text-primary" />
                  你的历史爆款结构
                </span>
                <ChevronDown size={14} className={cn("text-text-muted transition-transform duration-200", showTemplates && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 space-y-3">
                      {topTemplates.map((tmpl, i) => (
                        <motion.div
                          key={tmpl.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-bg border border-border-custom/15 rounded-2xl p-5 flex items-center justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">互动 {tmpl.engagement}</span>
                              <span className="text-base font-normal text-text-muted">时长 {tmpl.duration}</span>
                            </div>
                            <p className="text-base font-normal text-text">{tmpl.title}</p>
                            <div className="flex items-center gap-4 text-base text-text-muted">
                              <span>开头：「{tmpl.hook}」</span>
                              <span>爆点：「{tmpl.climax}」</span>
                            </div>
                          </div>
                          <button
                            onClick={() => applyTemplate(tmpl)}
                            className="px-4 py-2.5 bg-primary text-white rounded-xl text-base font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all press shrink-0"
                          >
                            复用此结构
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI 设置与优化（底部）— 向上弹出 */}
            <div className="border-t border-border-custom/15">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full px-8 py-4 flex items-center justify-between hover:bg-hover-accent transition-colors press"
              >
                <span className="text-base font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" />
                  AI 优化脚本
                </span>
                <Settings size={14} className={cn("text-text-muted transition-transform duration-200", showSettings && "rotate-90")} />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-8 pb-6 space-y-4">
                      <form onSubmit={handleOptimizationSubmit} className="flex gap-3">
                        <input
                          type="text"
                          value={optimizationPrompt}
                          onChange={(e) => setOptimizationPrompt(e.target.value)}
                          placeholder='例如：口语化一点、增加悬念、缩短到60秒...'
                          className="flex-1 px-5 py-4 bg-bg border-2 border-border-custom/15 rounded-2xl text-base font-normal focus:border-primary outline-none placeholder:text-text-muted placeholder:font-normal transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!optimizationPrompt || !editorContent || isOptimizing}
                          className="px-6 py-4 bg-primary text-white rounded-2xl font-normal text-sm uppercase tracking-wider hover:bg-primary/90 transition-all press disabled:opacity-40 disabled:active:scale-100 flex items-center gap-2 shrink-0"
                        >
                          {isOptimizing ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                              <RotateCcw size={14} />
                            </motion.div>
                          ) : (
                            <Zap size={14} className="fill-current" />
                          )}
                          {isOptimizing ? "优化中..." : "优化脚本"}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
