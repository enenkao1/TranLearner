export {}

// 保持 Service Worker 活跃，防止在等待 AI 响应时被 Chrome 休眠
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TRANSLATE") {
    ;(async () => {
      try {
        const translatedText = await translateText(request.text, request.targetLang || "zh-CN")
        sendResponse({ translatedText })
      } catch (error: any) {
        console.error("Translation error:", error)
        sendResponse({ error: error.message })
      }
    })()
    return true
  }

  if (request.type === "ANALYZE_GRAMMAR") {
    const timer = keepAlive()
    ;(async () => {
      try {
        const analysis = await analyzeGrammar(request.text)
        sendResponse({ analysis })
      } catch (error: any) {
        console.error("Grammar analysis error:", error)
        sendResponse({ error: error.message })
      } finally {
        clearInterval(timer)
      }
    })()
    return true
  }
})

async function analyzeGrammar(text: string) {
  const apiKey = process.env.PLASMO_PUBLIC_DEEPSEEK_API_KEY
  console.log("Debug - API Key exists:", !!apiKey)
  
  if (!apiKey || apiKey === "sk-your-deepseek-key-here" || apiKey === "undefined") {
    throw new Error(`未检测到有效的 API Key (当前值: ${apiKey})。请确保已在 .env 中配置并重启 npm run dev`)
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一个语言学习助手。请分析用户提供的语句，指出其中的语法点和可能的少见词汇，并用中文回复，包括：各个动词的变形（过去时，被动式，等等，全部列出来）；特殊语法，包括：主谓宾的特殊用法；少见的词汇，如舶来词。请用中文回答。但是回复请尽可能简洁，只需要回复‘句子中的动词变形包括...句子中的特殊语法包括...句子中的少见词汇包括...’不过记得换行不要挤压在一句话里"
          },
          {
            role: "user",
            content: text
          }
        ],
        stream: false
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("DeepSeek API 调用失败:", error)
    throw new Error("AI 语法分析失败，请检查网络或 API Key")
  }
}

async function translateText(text: string, targetLang: string) {
  const apiKey = process.env.PLASMO_PUBLIC_GOOGLE_TRANSLATE_API_KEY

  if (apiKey && apiKey !== "undefined") {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q: text,
          target: targetLang
        })
      })
      const data = await response.json()
      if (data.data && data.data.translations) {
        return data.data.translations[0].translatedText
      }
      console.warn("官方 API 返回异常，尝试降级到免费接口", data)
    } catch (error) {
      console.error("官方 API 调用失败:", error)
    }
  }

  // 降级方案：使用之前的免费 Web 接口
  const freeUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`

  try {
    const response = await fetch(freeUrl)
    const data = await response.json()
    return data[0].map((item: any) => item[0]).join("")
  } catch (error) {
    throw new Error("无法连接到翻译服务")
  }
}

