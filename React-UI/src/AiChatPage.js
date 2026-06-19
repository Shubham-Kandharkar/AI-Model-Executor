import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Separate small component to handle individual copy button states
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div style={{ position: "relative", margin: "15px 0" }}>
      {/* Copy Button Container */}
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: copied ? "#28a745" : "#4a5568",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 10px",
          fontSize: "12px",
          cursor: "pointer",
          zIndex: 10,
          transition: "background-color 0.2s ease"
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Code Window Container */}
      <pre style={{
        backgroundColor: "#2d3748",
        color: "#f7fafc",
        padding: "40px 15px 15px 15px", // Extra top padding so the button doesn't overlap text
        borderRadius: "6px",
        overflowX: "auto",
        fontFamily: "monospace",
        fontSize: "14px"
      }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function AiChatPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
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
    } catch (error) {
      setResponse("Failed to fetch response from AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h2>AI Assistant</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          fontSize: "16px",
          resize: "vertical"
        }}
      />

      <br /><br />

      <button 
        onClick={askAI} 
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <hr style={{ margin: "40px 0", border: "0", borderTop: "1px solid #eee" }} />

      <h3>Response:</h3>

      {response && (
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
          lineHeight: "1.6"
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Intercept the markdown code rendering block
              code({ node, inline, className, children, ...props }) {
                // If it's inline code (like `let x = 1`), don't add a big copy block box
                if (inline) {
                  return (
                    <code style={{ backgroundColor: "#e2e8f0", padding: "2px 4px", borderRadius: "4px" }} {...props}>
                      {children}
                    </code>
                  );
                }
                
                // If it's a full multi-line code snippet window, pass it to our CodeBlock component
                return <CodeBlock {...props}>{String(children).replace(/\n$/, '')}</CodeBlock>;
              }
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default AiChatPage;