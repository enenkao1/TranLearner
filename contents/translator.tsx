import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const PageTranslator = () => {
  useEffect(() => {
    console.log("tranLearn 翻译模块已加载")

    // 简单的双击翻译示例
    const handleDoubleClick = async (e: MouseEvent) => {
      const selection = window.getSelection()?.toString().trim()
      if (selection && /^[a-zA-Z\s,.]+$/.test(selection)) { // 简单判断是否为英文
        console.log("正在翻译:", selection)
        
        chrome.runtime.sendMessage(
          { type: "TRANSLATE", text: selection },
          (response) => {
            if (response?.translatedText) {
              alert(`原文: ${selection}\n翻译: ${response.translatedText}`)
            }
          }
        )
      }
    }

    window.addEventListener("dblclick", handleDoubleClick)
    return () => window.removeEventListener("dblclick", handleDoubleClick)
  }, [])

  return null
}

export default PageTranslator

