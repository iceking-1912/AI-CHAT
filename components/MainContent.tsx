import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from './Icon';
import { Chat, ChatMessage, AIModel } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MainContentProps {
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  activeChat: Chat | undefined;
  onAddMessage: (message: Omit<ChatMessage, 'id'>) => void;
  onRenameItem: (type: 'chat', id: string, newName: string) => void;
  availableModels: AIModel[];
  onSetChatModel: (chatId: string, modelId: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  isLeftSidebarOpen, toggleLeftSidebar, toggleRightSidebar, activeChat, 
  onAddMessage, onRenameItem, availableModels, onSetChatModel
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  
  const [editingTitle, setEditingTitle] = useState(false);
  const [chatTitle, setChatTitle] = useState(activeChat?.name || '');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  const activeModel = availableModels.find(m => m.id === activeChat?.modelId);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);
  
  useEffect(() => {
    setChatTitle(activeChat?.name || '');
  }, [activeChat?.name]);

  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isAiResponding || !activeModel || !activeChat) return;

    const userMessageContent = userInput;
    onAddMessage({ role: 'user', content: userMessageContent });
    setUserInput('');
    
    setIsAiResponding(true);

    try {
      let aiResponse = '';
      if (activeModel.provider === 'google') {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userMessageContent,
        });
        aiResponse = response.text;
      } else if (activeModel.provider === 'ollama') {
          const response = await fetch('http://localhost:11434/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  model: activeModel.id,
                  prompt: userMessageContent,
                  stream: false,
              }),
          });
          if (!response.ok) {
              throw new Error(`Ollama API request failed: ${response.statusText}`);
          }
          const data = await response.json();
          aiResponse = data.response;
      }
      onAddMessage({ role: 'ai', content: aiResponse });
    } catch (error) {
      console.error("Error calling AI API:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      onAddMessage({ role: 'ai', content: `Sorry, I encountered an error. Please check the console for details.\n\n**Error:**\n\`\`\`\n${errorMessage}\n\`\`\`` });
    } finally {
      setIsAiResponding(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  const handleTitleSave = () => {
    if (activeChat && chatTitle.trim() && chatTitle !== activeChat.name) {
      onRenameItem('chat', activeChat.id, chatTitle);
    } else if (activeChat) {
      setChatTitle(activeChat.name);
    }
    setEditingTitle(false);
  };
  
  return (
    <div className="bg-[#1C1B22] rounded-2xl h-full flex flex-col">
      <header className="flex-shrink-0 p-4">
        <div className="flex items-center justify-between">
            <button onClick={toggleLeftSidebar} className="p-1 rounded-md hover:bg-[#3B3A4A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
               <Icon name="panel-left" className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isLeftSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
            <div className="flex items-center gap-2">
                <button className="bg-[#3B3A4A] text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
                    <Icon name="message-square-plus" className="w-4 h-4" />
                    Chat
                </button>
                <button className="bg-transparent hover:bg-[#2A2833] text-gray-300 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
                    <Icon name="pen-tool" className="w-4 h-4" />
                    Canvas
                </button>
            </div>
            <button onClick={toggleRightSidebar} className="p-1 rounded-md hover:bg-[#3B3A4A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
               <Icon name="panel-right" className="w-5 h-5 text-gray-400" />
            </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto px-10 pt-4 pb-8 text-gray-300">
        {activeChat ? (
          <div>
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-headings:font-light">
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') setEditingTitle(false); }}
                  className="text-3xl font-light bg-transparent border-b-2 border-[#4f46e5] focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-3xl font-light cursor-text" onDoubleClick={() => setEditingTitle(true)}>
                  {activeChat.name}
                </h2>
              )}
            </div>
            <hr className="border-gray-700 my-8" />
            
            <div className="space-y-6">
            {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'ai' && (
                        <div className="w-8 h-8 flex-shrink-0 bg-[#2A2833] rounded-full flex items-center justify-center">
                            <Icon name="bot" className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                    <div className="relative group max-w-[75%]">
                        <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#4f46e5] text-white' : 'bg-[#2A2833]'}`}>
                           <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md prose-a:text-blue-400 hover:prose-a:text-blue-300">
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                           </div>
                        </div>
                        {msg.role === 'ai' && (
                            <button 
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="absolute top-2 right-2 p-1 rounded-md bg-[#1C1B22] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                aria-label="Copy message"
                            >
                                <Icon name={copiedMessageId === msg.id ? 'check' : 'copy'} className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                     {msg.role === 'user' && (
                        <div className="w-8 h-8 flex-shrink-0 bg-[#2A2833] rounded-full flex items-center justify-center">
                            <Icon name="user" className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                </div>
            ))}
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Icon name="message-square-plus" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl">Select a chat or create a new one to start.</h2>
            </div>
          </div>
        )}
        <div ref={bottomOfChatRef} />
      </main>

      <footer className="flex-shrink-0 p-4 m-4 bg-[#2A2833] rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <button 
              onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
              disabled={!activeChat}
              className="flex items-center gap-2 text-sm bg-[#1C1B22] hover:bg-[#3B3A4A] px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#2A2833] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activeModel ? `${activeModel.name} (${activeModel.provider})` : 'Select Model'}
              <Icon name="chevron-down" className="w-4 h-4" />
            </button>
            {isModelSelectorOpen && activeChat && (
              <div className="absolute bottom-full mb-2 w-max bg-[#1C1B22] border border-[#3B3A4A] rounded-lg shadow-lg z-10 p-2">
                {availableModels.map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSetChatModel(activeChat.id, model.id);
                      setIsModelSelectorOpen(false);
                    }}
                    className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-[#2A2833]"
                  >
                    {model.name} <span className="text-gray-400 capitalize">({model.provider})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#2A2833]">
            <Icon name="sparkles" className="w-4 h-4" />
            Space Name
          </button>
        </div>
        <div className="relative">
          <textarea
            rows={2}
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none border-none p-2 pr-24"
            placeholder="Ask anything or type a command..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!activeChat}
          ></textarea>
          <button 
            onClick={handleSendMessage}
            disabled={!activeChat || !userInput.trim() || isAiResponding}
            className="absolute right-2 bottom-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-[#4f46e5] disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isAiResponding ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
                <Icon name="send" className="w-4 h-4" />
            )}
            {isAiResponding ? 'Generating...' : 'Send'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MainContent;