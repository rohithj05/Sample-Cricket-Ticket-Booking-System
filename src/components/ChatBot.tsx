import React, { useState, useCallback } from "react";
import { Send, MessageCircle, Ticket, Home } from "lucide-react";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    { text: "Welcome to Cricket Ticket Central! How can I help you with ticket booking today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = useCallback(async (userMessage: string) => {
    setLoading(true);

    // Important: Use environment variable for API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log(`API Key: ${apiKey}`); // Debugging line to check if API key is loaded

    
    if (!apiKey) {
      setMessages((prev) => [
        ...prev, 
        { text: "Error: Gemini API key is not configured.", sender: "bot" }
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `You are a helpful cricket ticket booking assistant. Respond to the following query about cricket tickets: ${userMessage}. 
                Your responses should be concise and helpful, focusing on match information, ticket availability, pricing, and booking process.` 
              }] 
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm having trouble processing your request. Could you please rephrase?";

      setMessages((prev) => [
        ...prev, 
        { text: botReply, sender: "bot" }
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev, 
        { text: "Sorry, there was an error connecting to the chat service. Please try again.", sender: "bot" }
      ]);
    }

    setLoading(false);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages((prev) => [
      ...prev, 
      { text: input, sender: "user" }
    ]);
    
    // Fetch bot response
    fetchResponse(input);
    
    // Clear input
    setInput("");
  }, [input, fetchResponse]);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[600px] border-2 border-blue-100 rounded-3xl shadow-2xl bg-white overflow-hidden">
      {/* Chat Header */}
      <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-lg font-bold flex items-center">
        <Home className="mr-3" size={24} />
        Cricket Ticket Central
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white border border-gray-200 text-gray-800 shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500 italic">
            Cricket bot is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Ask about cricket tickets..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;