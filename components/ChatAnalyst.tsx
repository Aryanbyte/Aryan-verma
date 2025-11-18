import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { Chat } from "@google/genai";

export const ChatAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your AI Cricket Analyst. Ask me about rules, history, stats, or strategy." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to hold the chat session instance
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat on mount
  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    // Optimistic update
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = createChatSession();
      }
      
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const modelText = result.text || "I'm stumped! Could you rephrase that?";
      
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Apologies, I encountered a network bouncer. Try again?", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    chatSessionRef.current = createChatSession();
    setMessages([{ role: 'model', text: "Session reset. What's on your mind now?" }]);
  };

  return (
    <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg text-emerald-900">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold">CricAI Analyst</h3>
            <p className="text-xs text-slate-400">Always on call</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          title="Reset Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
              ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : msg.isError 
                  ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about LBW rules, highest run chases..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};