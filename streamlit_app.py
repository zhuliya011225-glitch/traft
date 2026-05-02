"""
Traft - 灵感成稿，增长有道
Streamlit 应用：支持上传文档/图片，调用智谱 AI 大模型生成脚本
"""

import streamlit as st
import os
import io
import tempfile

# -------------------- 页面配置 --------------------
st.set_page_config(
    page_title="Traft - 灵感成稿",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -------------------- 样式美化 --------------------
st.markdown("""
<style>
    .stApp { background-color: #FAFBFC; }
    .main-header { font-size: 2.5rem; font-weight: 700; color: #1A1A2E; margin-bottom: 0.2rem; }
    .sub-header { font-size: 1.1rem; color: #6B7A91; margin-bottom: 2rem; }
    .card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #E8ECF0; margin-bottom: 1rem; }
    .card-title { font-size: 1.2rem; font-weight: 600; color: #1A1A2E; margin-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: #EEF2FF; color: #4F46E5; margin-right: 0.3rem; }
    .script-output { background: #F8F9FB; border: 1px solid #E8ECF0; border-radius: 12px; padding: 1.5rem; white-space: pre-wrap; line-height: 1.7; }
</style>
""", unsafe_allow_html=True)

# -------------------- 侧边栏：API Key 配置 --------------------
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/artificial-intelligence.png", width=48)
    st.markdown("### ⚙️ 配置")

    # 优先从 secrets.toml 读取，否则让用户手动输入
    api_key = st.text_input(
        "智谱 AI API Key",
        type="password",
        value=st.secrets.get("ZHIPUAI_API_KEY", os.environ.get("ZHIPUAI_API_KEY", "")),
        help="在 https://open.bigmodel.cn/ 注册获取",
    )
    if api_key:
        st.session_state.api_key = api_key
        st.success("✅ API Key 已配置")
    else:
        st.warning("⚠️ 请在左侧输入 API Key")

    st.divider()
    st.caption("Traft v1.0 · 基于智谱 GLM-4V-Flash")


# -------------------- 初始化智谱客户端 --------------------
def get_zhipu_client():
    """获取智谱 AI 客户端"""
    try:
        from zhipuai import ZhipuAI
        key = st.session_state.get("api_key", "")
        if not key:
            return None
        return ZhipuAI(api_key=key)
    except Exception as e:
        st.error(f"初始化智谱客户端失败: {e}")
        return None


# -------------------- 文件解析函数 --------------------
def extract_text_from_uploaded(uploaded_file):
    """
    从上传的文件中提取文字。
    支持: .txt, .md, .docx, .pdf, .jpg, .jpeg, .png, .gif, .webp
    """
    import tempfile

    file_type = uploaded_file.name.rsplit(".", 1)[-1].lower() if "." in uploaded_file.name else ""
    file_bytes = uploaded_file.getvalue()

    # ---------- 纯文本 ----------
    if file_type in ("txt", "md"):
        try:
            return file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return file_bytes.decode("gbk", errors="replace")

    # ---------- Word 文档 ----------
    elif file_type == "docx":
        try:
            from docx import Document
            doc = Document(io.BytesIO(file_bytes))
            return "\n".join(p.text for p in doc.paragraphs)
        except Exception as e:
            return f"[解析 Word 失败: {e}]"

    # ---------- PDF ----------
    elif file_type == "pdf":
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text if text.strip() else "[PDF 无可提取文字]"
        except Exception as e:
            return f"[解析 PDF 失败: {e}]"

    # ---------- 图片 (使用智谱多模态模型) ----------
    elif file_type in ("jpg", "jpeg", "png", "gif", "webp"):
        try:
            from zhipuai import ZhipuAI
            import base64

            key = st.session_state.get("api_key", "")
            if not key:
                return "[请先配置 API Key 以识别图片]"

            client = ZhipuAI(api_key=key)

            # 转 base64
            img_b64 = base64.b64encode(file_bytes).decode("utf-8")
            data_uri = f"data:image/{file_type};base64,{img_b64}"

            response = client.chat.completions.create(
                model="glm-4v-flash",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": data_uri}},
                            {"type": "text", "text": "请详细描述这张图片中的文字内容和画面信息，完整提取所有可见文字。"}
                        ]
                    }
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"[图片识别失败: {e}]"

    else:
        return f"[不支持的文件类型: .{file_type}]"


# -------------------- 调用智谱大模型生成脚本 --------------------
def generate_script(client, topic, style, tone, additional_context=""):
    """调用智谱 AI 生成脚本"""
    style_map = {
        "情感共鸣": "用讲故事的方式开头，营造情感共鸣，让读者有代入感",
        "干货教程": "结构化分步骤讲解，注重实操性和可复现性",
        "故事叙述": "以第一人称或第三人称讲述一个完整故事，有起承转合",
        "清单盘点": "以清单形式罗列要点，每点配简短说明",
        "热点评论": "结合热点事件发表观点，引导讨论",
    }
    tone_map = {
        "正式专业": "语气正式、专业，使用行业术语",
        "轻松活泼": "语气轻松、活泼，适当使用网络用语和表情",
        "亲切自然": "像朋友聊天一样自然亲切",
        "幽默风趣": "加入幽默元素和趣味表达",
    }

    style_desc = style_map.get(style, "干货教程")
    tone_desc = tone_map.get(tone, "轻松活泼")

    prompt = f"""你是一名资深的内容创作专家，擅长为新媒体平台撰写爆款脚本。

## 创作要求
- **主题**: {topic}
- **风格**: {style_desc}
- **语气**: {tone_desc}
- **平台**: 适合抖音/小红书/视频号等主流平台

## 附加素材
{additional_context if additional_context else "（无）"}

## 输出格式
请严格按照以下结构输出：

### 标题建议（3个备选）
1. 
2. 
3. 

### 正文脚本
[正文内容，包含开场、主体、结尾]

### 核心观点
- 观点1
- 观点2

### 互动引导
- 结尾引导话术
"""

    response = client.chat.completions.create(
        model="glm-4-flash",
        messages=[
            {"role": "system", "content": "你是一个专业的内容创作助手，擅长为新媒体平台撰写高质量脚本。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=4096,
    )
    return response.choices[0].message.content


# -------------------- 主界面 --------------------
st.markdown('<p class="main-header">✨ Traft · 灵感成稿</p>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">上传素材，AI 自动提取文字并生成爆款脚本</p>', unsafe_allow_html=True)

# 检查 API Key
if "api_key" not in st.session_state or not st.session_state.api_key:
    st.info("👈 请先在左侧边栏输入您的智谱 AI API Key")
    st.stop()

# ---------- 双栏布局 ----------
col_left, col_right = st.columns([1, 1], gap="large")

with col_left:
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown('<p class="card-title">📄 上传素材</p>', unsafe_allow_html=True)
        uploaded_files = st.file_uploader(
            "支持文档（.txt, .docx, .pdf）和图片（.jpg, .png, .webp）",
            type=["txt", "md", "docx", "pdf", "jpg", "jpeg", "png", "gif", "webp"],
            accept_multiple_files=True,
            label_visibility="collapsed",
        )

        if uploaded_files:
            st.markdown(f"已上传 **{len(uploaded_files)}** 个文件")
            for f in uploaded_files:
                st.markdown(f'<span class="badge">📎 {f.name}</span>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown('<p class="card-title">✍️ 创作设置</p>', unsafe_allow_html=True)

        topic = st.text_input(
            "脚本主题",
            placeholder="例如：如何提高学习效率",
            value=st.session_state.get("last_topic", ""),
        )

        style = st.selectbox(
            "创作风格",
            ["干货教程", "情感共鸣", "故事叙述", "清单盘点", "热点评论"],
            index=0,
        )

        tone = st.selectbox(
            "语气风格",
            ["轻松活泼", "正式专业", "亲切自然", "幽默风趣"],
            index=0,
        )

        generate_btn = st.button("🚀 生成脚本", type="primary", use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

with col_right:
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown('<p class="card-title">📝 生成结果</p>', unsafe_allow_html=True)

        if generate_btn and topic:
            client = get_zhipu_client()
            if not client:
                st.error("请先配置有效的 API Key")
                st.stop()

            # 提取上传文件中的文字
            context_parts = []
            if uploaded_files:
                with st.status("📂 正在解析上传文件...", expanded=True) as status:
                    for f in uploaded_files:
                        st.write(f"解析: {f.name}")
                        text = extract_text_from_uploaded(f)
                        if text and not text.startswith("[") and text != "":
                            context_parts.append(f"--- 来自 {f.name} ---\n{text[:3000]}")
                        else:
                            st.warning(f"{f.name}: {text}")
                    status.update(label="✅ 文件解析完成", state="complete")

            additional_context = "\n\n".join(context_parts) if context_parts else ""

            with st.spinner("🤖 AI 正在创作中..."):
                try:
                    result = generate_script(client, topic, style, tone, additional_context)
                    st.session_state.last_topic = topic
                    st.markdown(f'<div class="script-output">{result}</div>', unsafe_allow_html=True)

                    # 下载按钮
                    st.download_button(
                        label="📥 下载脚本",
                        data=result,
                        file_name=f"Traft_脚本_{topic[:10]}.md",
                        mime="text/markdown",
                        use_container_width=True,
                    )
                except Exception as e:
                    st.error(f"生成失败: {e}")
                    st.info("💡 请检查 API Key 是否有效，或智谱服务是否正常。")
        elif generate_btn and not topic:
            st.warning("请先输入脚本主题")
        else:
            st.info("👆 左侧填写主题后点击「生成脚本」")
        st.markdown('</div>', unsafe_allow_html=True)

# -------------------- 底部信息 --------------------
st.divider()
st.caption("Traft · 基于智谱 GLM-4-Flash & GLM-4V-Flash | 支持文档解析 & 图片文字提取")
