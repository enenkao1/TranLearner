import type { PlasmoCSConfig, PlasmoGetInlineAnchorList, PlasmoCSUIProps } from "plasmo"
import React, { useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

// 这里的选择器指向 YouTube 评论的操作栏（点赞、踩、回复那一排）
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll("#action-buttons")
}

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "28px",
  padding: "0 14px",
  backgroundColor: "#f2f2f2",
  border: "1px solid #d3d3d3",
  borderRadius: "14px",
  fontSize: "13px",
  fontWeight: 500,
  color: "#065fd4",
  cursor: "pointer",
  whiteSpace: "nowrap",
  lineHeight: 1
}

const resultBaseStyle: React.CSSProperties = {
  padding: "8px 10px",
  fontSize: "13px",
  color: "#0f0f0f",
  marginTop: "2px",
  lineHeight: 1.6
}

const YoutubeActionButtons = ({ anchor }: PlasmoCSUIProps) => {
  const [translatedText, setTranslatedText] = useState("")
  const [grammarAnalysis, setGrammarAnalysis] = useState("")
  const [loading, setLoading] = useState(false)

  // 获取评论文本的函数
  const getCommentText = () => {
    // anchor 是 #action-buttons
    const commentElement = anchor?.element.closest("#body")?.querySelector("#content-text")
    return commentElement?.textContent?.trim() || ""
  }

  const handleTranslate = async () => {
    const text = getCommentText()
    if (!text) return

    if (!chrome.runtime?.id) {
      alert("插件已更新，请刷新页面后重试。")
      return
    }

    setLoading(true)
    chrome.runtime.sendMessage(
      { type: "TRANSLATE", text: text },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("通信失败:", chrome.runtime.lastError)
          setLoading(false)
          return
        }
        if (response?.translatedText) {
          setTranslatedText(response.translatedText)
        }
        setLoading(false)
      }
    )
  }

  const handleGrammarCheck = async () => {
    const text = getCommentText()
    if (!text) return

    if (!chrome.runtime?.id) {
      alert("插件已更新，请刷新页面后重试。")
      return
    }

    setLoading(true)
    chrome.runtime.sendMessage(
      { type: "ANALYZE_GRAMMAR", text: text },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("通信失败:", chrome.runtime.lastError)
          setLoading(false)
          return
        }
        if (response?.analysis) {
          setGrammarAnalysis(response.analysis)
        } else if (response?.error) {
          alert(`错误: ${response.error}`)
        }
        setLoading(false)
      }
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "10px", gap: "8px" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
        <button onClick={handleTranslate} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.5 : 1 }}>
          {loading ? "..." : "翻译"}
        </button>
        <button onClick={handleGrammarCheck} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.5 : 1 }}>
          {loading ? "..." : "语法学习"}
        </button>
      </div>

      {translatedText && (
        <div style={{ ...resultBaseStyle, backgroundColor: "#f9f9f9", borderLeft: "3px solid #065fd4", borderRadius: "0 4px 4px 0" }}>
          <strong>翻译：</strong> {translatedText}
        </div>
      )}

      {grammarAnalysis && (
        <div style={{ ...resultBaseStyle, backgroundColor: "#f0f7ff", borderLeft: "3px solid #0078d4", borderRadius: "0 4px 4px 0", whiteSpace: "pre-wrap" }}>
          <strong>语法分析：</strong> {grammarAnalysis}
        </div>
      )}
    </div>
  )
}

export default YoutubeActionButtons
