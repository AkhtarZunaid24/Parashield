import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  FileText, 
  Phone, 
  ShieldAlert, 
  HelpCircle,
  Bot,
  User,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Support: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi! I am your RiderGuard AI assistant. How can I help you with your policy today?' }
  ]);

  const topics = [
    { id: 'policy', title: 'Understanding My Policy', icon: FileText, desc: 'Coverage details, limits, and terms' },
    { id: 'claims', title: 'Claims & Payouts', icon: ShieldAlert, desc: 'How to file, track status, or appeal' },
    { id: 'app', title: 'App Issues', icon: HelpCircle, desc: 'Tracking, GPS, or account problems' },
  ];

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setStep(2);
  };

  const startChat = () => {
    setStep(3);
    setChatHistory([
      { sender: 'bot', text: `You selected help with: ${topics.find(t => t.id === selectedTopic)?.title}. What specific question do you have?` }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: 'I understand. Let me connect you with a live support agent who specializes in this area. Please hold on for a moment.' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-black font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-zinc-100 rounded-xl transition-colors border-2 border-transparent hover:border-black">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-black uppercase tracking-tight">Support Center</h1>
          </div>
          <button className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-yellow-400 border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">How can we help?</h2>
                <p className="font-bold text-black/80">Select a topic to get quick answers or connect with our support team.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topics.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <button 
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      className="bg-white border-2 border-black rounded-2xl p-6 text-left hover:bg-zinc-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group"
                    >
                      <div className="w-12 h-12 bg-zinc-100 border-2 border-black rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-black uppercase mb-1">{topic.title}</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase">{topic.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-black flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Back to topics
              </button>
              
              <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Quick Answers</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-zinc-50 border-2 border-black rounded-xl">
                    <h4 className="font-black text-sm uppercase mb-2">What does my policy cover?</h4>
                    <p className="text-xs font-medium text-zinc-600">Your Pro Rider Plus policy covers medical expenses up to ₹5,00,000, accidental death, and third-party property damage while you are actively on a delivery.</p>
                  </div>
                  <div className="p-4 bg-zinc-50 border-2 border-black rounded-xl">
                    <h4 className="font-black text-sm uppercase mb-2">When is my coverage active?</h4>
                    <p className="text-xs font-medium text-zinc-600">Coverage is automatically activated when you log into any of your linked delivery apps (Swiggy, Zomato) and accept an order.</p>
                  </div>
                </div>

                <div className="border-t-2 border-zinc-100 pt-6">
                  <h3 className="text-sm font-black uppercase mb-4">Still need help?</h3>
                  <button 
                    onClick={startChat}
                    className="w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with Support
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-[600px]"
            >
              <div className="bg-black text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-black uppercase tracking-tight">Live Support</h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Usually replies in 2 mins</p>
                  </div>
                </div>
                <Bot className="w-6 h-6 text-yellow-400" />
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-zinc-50 flex flex-col gap-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2 shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                      msg.sender === 'user' 
                        ? 'bg-yellow-400 text-black rounded-br-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black rounded-bl-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 bg-zinc-200 border-2 border-black rounded-full flex items-center justify-center ml-2 shrink-0">
                        <User className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-black flex items-center gap-3">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-100 border-2 border-black rounded-xl px-4 py-3 text-sm font-bold outline-none focus:bg-white"
                />
                <button 
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Support;
