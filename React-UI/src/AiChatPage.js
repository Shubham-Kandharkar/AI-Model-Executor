import React, { useState } from "react";

function AiChatPage() {

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {

    const res = await fetch("http://localhost:8080/query/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        promptMessage: prompt
      })
    });

    const data = await res.text();
    setResponse(data);
  };

  return (
    <div style={{width:"600px", margin:"50px auto"}}>

      <h2>AI Assistant</h2>

      <textarea
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        placeholder="Ask something..."
        style={{width:"100%",height:"100px"}}
      />

      <br/><br/>

      <button onClick={askAI}>
        Ask AI
      </button>

      <h3>Response:</h3>

      <p>{response}</p>

    </div>
  );
}

export default AiChatPage;