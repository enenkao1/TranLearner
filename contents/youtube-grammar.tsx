import type { PlasmoCSConfig, PlasmoGetInlineAnchorList, PlasmoCSUIProps } from "plasmo"
import React, { useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

// 这里的选择器指向 YouTube 评论的操作栏（点赞、踩、回复那一排）
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll("#action-buttons")
}

const YoutubeActionButtons = ({ anchor }: PlasmoCSUIProps) => {
  const [translatedText, setTranslatedText] = useState("")
  const [grammarAnalysis, setGrammarAnalysis] = useState("")
  const [loading, setLoading] = useState(false)

  // 获取评论文本的函数
  const getCommentText = () => {
    // anchor 是 #action-buttons，我们需要向上找到评论主体内容
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
    <div style={{ display: "flex", flexDirection: "column", marginTop: "8px", gap: "8px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleTranslate}
          disabled={loading}
          style={{
            padding: "4px 12px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "18px",
            fontSize: "12px",
            cursor: "pointer",
            color: "#065fd4",
            fontWeight: "500"
          }}>
          {loading ? "..." : "翻译"}
        </button>
        <button
          onClick={handleGrammarCheck}
          disabled={loading}
          style={{
            padding: "4px 12px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "18px",
            fontSize: "12px",
            cursor: "pointer",
            color: "#065fd4",
            fontWeight: "500"
          }}>
          {loading ? "..." : "语法学习"}
        </button>
      </div>
      
      {translatedText && (
        <div style={{
          padding: "8px",
          backgroundColor: "#f9f9f9",
          borderLeft: "3px solid #065fd4",
          fontSize: "13px",
          color: "#0f0f0f",
          marginTop: "4px"
        }}>
          <strong>翻译：</strong> {translatedText}
        </div>
      )}

      {grammarAnalysis && (
        <div style={{
          padding: "8px",
          backgroundColor: "#f0f7ff",
          borderLeft: "3px solid #0078d4",
          fontSize: "13px",
          color: "#0f0f0f",
          marginTop: "4px",
          whiteSpace: "pre-wrap"
        }}>
          <strong>语法分析：</strong> {grammarAnalysis}
        </div>
      )}
    </div>
  )
}

export default YoutubeActionButtons
