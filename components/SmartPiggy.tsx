import React, { useState, useRef, useEffect } from 'react';
import { AppData } from '../types';
import { askSmartPiggy } from '../services/geminiService';
import { Send, Bot, User } from 'lucide-react';

interface SmartPiggyProps {
  data: AppData;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export const SmartPiggy: React.FC<SmartPiggyProps> = ({ data }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Oink! I'm Smart Piggy. Ask me about your money, saving goals, or if you can afford that cool toy!" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askSmartPiggy(input, data);
    
    const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: response };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-pink-50">
      <div className="bg-white p-4 shadow-sm z-10">
        <h2 className="text-xl font-bold text-pink-600 flex items-center gap-2">
          <Bot size={24} />
          Smart Piggy Advisor
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-pink-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 shadow-md rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-75 text-xs">
                 {msg.sender === 'user' ? <User size={12}/> : <Bot size={12}/>}
                 {msg.sender === 'user' ? 'You' : 'Smart Piggy'}
              </div>
              <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md">
               <span className="animate-pulse text-pink-400">Thinking... 🐷</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-pink-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
