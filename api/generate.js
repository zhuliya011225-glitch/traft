// Vercel Serverless Function — 调用智谱 AI 生成/优化脚本
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

function buildSystemPrompt(scriptType, intensity, tempo, opening, platform) {
  const typeMap = {
    emotional: '情绪共鸣型',
    dry: '知识干货型',
    story: '个人经历型',
    list: '清单盘点型',
  };

  const tempoMap = {
    fast: '激进快节奏',
    medium: '沉稳中节奏',
    slow: '细腻慢节奏',
  };

  const openingMap = {
    suspense: '深度悬念式',
    shock: '重磅震惊式',
    resonance: '情感共鸣式',
    question: '反思提问式',
  };

  return `你是一位资深短视频内容创作专家，专门帮创作者写出高完播率、高互动的爆款脚本。

【创作要求】
- 平台：${platform || '通用短视频平台'}
- 脚本类型：${typeMap[scriptType] || '通用型'}
- 情绪强度：${intensity || 3}/5（1=平静，5=火热）
- 内容节奏：${tempoMap[tempo] || '中节奏'}
- 开头钩子：${openingMap[opening] || '悬念式'}
- 时长：控制在 30-90 秒的口播量

【输出格式】
请严格按照以下格式输出：

# 【标题】
（15字以内的吸睛标题）

## 黄金开头（前3秒）
（强力钩子，必须抓住注意力）

## 正文
（分2-3段，每段有爆点）

## 结尾引导
（引导点赞/关注/评论）

## 拍摄建议
（镜头、字幕、BGM建议）

注意：语言口语化、有画面感，适合直接对着镜头念。`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ZHIPUAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置 API Key，请在 Vercel Settings → Environment Variables 中添加 ZHIPUAI_API_KEY' });
  }

  try {
    const { prompt, scriptType, intensity, tempo, opening, platform, optimizationPrompt, contextText } = req.body;

    let systemContent, userContent;

    if (optimizationPrompt && contextText) {
      systemContent = '你是一位资深短视频内容优化专家，擅长根据用户反馈精准调整脚本。';
      userContent = `请基于以下原始脚本，按照用户的优化要求进行修改。

【原始脚本】
${contextText}

【优化要求】
${optimizationPrompt}

请直接输出优化后的完整脚本，保持原有格式结构。`;
    } else {
      systemContent = buildSystemPrompt(scriptType, intensity, tempo, opening, platform);
      userContent = `请根据以下灵感/素材创作短视频脚本：\n\n${prompt || '请创作一个吸引人的短视频脚本'}`;
    }

    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userContent },
        ],
        temperature: 0.75,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: `智谱 API 错误: ${errorText}` });
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content;

    if (!script) {
      return res.status(500).json({ error: 'AI 返回内容为空，请重试' });
    }

    res.status(200).json({ script });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
  }
}
