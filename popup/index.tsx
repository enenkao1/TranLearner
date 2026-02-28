import React, { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 200
      }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        tranLearn
      </h2>
      <p>欢迎使用 tranLearn！</p>
    </div>
  )
}

export default IndexPopup

