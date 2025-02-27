import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User, Bot } from 'lucide-react';
import { getDoctorRecommendations } from '../lib/gemini';
import { supabase, getUser } from '../lib/supabase';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Add initial greeting message if there are no messages
      if (messages.length === 0) {
        setMessages([
          {
            id: Date.now().toString(),
            text: "Hello! I'm your healthcare assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
      
      // Fetch user profile for personalized recommendations
      fetchUserProfile();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserProfile = async () => {
    try {
      const user = await getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await getDoctorRecommendations(
        inputValue,
        userProfile || {
          location: 'Unknown',
          age: 30,
          gender: 'Unknown',
          therapyType: 'allopathy',
        }
      );
      
      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <MessageSquare size={24} />
      </motion.button>
      
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <h3 className="font-medium">Healthcare Assistant</h3>
              </div>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-md rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User size={14} className="text-indigo-200" />
                      ) : (
                        <Bot size={14} className="text-indigo-600" />
                      )}
                      <span className={`text-xs ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {message.sender === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                  disabled={isLoading}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;