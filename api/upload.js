// Vercel Serverless Function — 上传文件并解析文字（支持图片OCR）
import formidable from 'formidable';
import fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export const config = {
  api: { bodyParser: false },
};

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

async function extractImageText(filePath, ext, apiKey) {
  const base64 = fs.readFileSync(filePath, 'base64');
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const response = await fetch(ZHIPU_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4v-flash',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: '请提取图片中的所有文字内容，保持原有排版格式。如果图片是手写笔记，也请尽量识别。' },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
          ],
        },
      ],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '图片文字识别失败';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ZHIPUAI_API_KEY;

  try {
    const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: '未找到上传的文件' });
    }

    const ext = file.originalFilename?.split('.').pop()?.toLowerCase();
    let text = '';

    if (ext === 'txt' || ext === 'md') {
      text = fs.readFileSync(file.filepath, 'utf-8');
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ path: file.filepath });
      text = result.value;
    } else if (ext === 'pdf') {
      const buffer = fs.readFileSync(file.filepath);
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      if (!apiKey) {
        return res.status(500).json({ error: '服务器未配置 API Key，无法识别图片' });
      }
      text = await extractImageText(file.filepath, ext, apiKey);
    } else {
      text = `不支持的文件类型: .${ext}。目前支持: txt, md, docx, pdf, jpg, png, webp`;
    }

    fs.unlinkSync(file.filepath);

    const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n[内容已截断，仅保留前8000字]' : text;

    res.status(200).json({ text: truncated, filename: file.originalFilename, charCount: text.length });
  } catch (error) {
    console.error('Upload parse error:', error);
    res.status(500).json({ error: error.message || '文件解析失败' });
  }
}
