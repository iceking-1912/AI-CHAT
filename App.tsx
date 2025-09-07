import React, { useState, useMemo, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import { Modal } from './components/Modal';
import { Space, Chat, Tag, ChatMessage, AIModel } from './types';
import { IconName } from './components/Icon';

const RECENT_CHATS_KEY = 'ai-convo-recent-chats';
const MAX_RECENT_CHATS = 5;

const initialData: Space[] = [
  {
    id: 'space-1',
    name: 'Productivity',
    color: '#4f46e5',
    personas: [{ id: 'persona-1', name: 'Analyst', icon: 'pie-chart', color: '#4f46e5' }],
    chats: [
      {
        id: 'chat-1',
        name: 'Tesla AI Integration',
        tags: [{ id: 'tag-1', name: 'AI', icon: 'brain-circuit', color: '#a855f7' }],
        knowledgeAreas: [{ id: 'ka-1', name: 'Auto Tech', icon: 'school', color: '#db2777' }],
        messages: [
          { id: 'msg-1', role: 'ai', content: "Tesla feature advanced, conversational AI assistants as standard." },
          { id: 'msg-2', role: 'ai', content: "Key features of Tesla's integration: Doubao (by ByteDance) handles practical car-related voice commands, such as navigation, media, cabin temperature, an Chinese AI Doubao DeepSeek" }
        ],
        modelId: 'gemini-2.5-flash',
      },
       {
        id: 'chat-2',
        name: 'Market Research',
        tags: [{ id: 'tag-2', name: 'Data', icon: 'bar-chart-3', color: '#22c55e' }],
        knowledgeAreas: [],
        messages: [
          { id: 'msg-3', role: 'ai', content: "Let's begin the market research for Q3." }
        ],
        modelId: 'gemini-2.5-flash',
      },
    ],
  },
   {
    id: 'space-2',
    name: 'Creative',
    color: '#db2777',
    personas: [],
    chats: [
       {
        id: 'chat-3',
        name: 'Ad Campaign Ideas',
        tags: [],
        knowledgeAreas: [],
        messages: [
          { id: 'msg-4', role: 'ai', content: "Here are three concepts for the new ad campaign." }
        ],
        modelId: 'gemini-2.5-flash',
      },
    ],
  },
];

const GOOGLE_MODELS: AIModel[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google' },
];

type ModalState = {
    type: 'tag' | 'knowledge' | 'persona' | 'space' | null;
    isOpen: boolean;
};

const App: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>(initialData);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>('space-1');
  const [activeChatId, setActiveChatId] = useState<string | null>('chat-1');

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  
  const [modalState, setModalState] = useState<ModalState>({ type: null, isOpen: false });
  const [availableModels, setAvailableModels] = useState<AIModel[]>(GOOGLE_MODELS);
  
  const [recentChatIds, setRecentChatIds] = useState<string[]>(() => {
    try {
        const storedRecents = localStorage.getItem(RECENT_CHATS_KEY);
        return storedRecents ? JSON.parse(storedRecents) : [];
    } catch (error) {
        console.error("Failed to parse recent chats from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    const fetchOllamaModels = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (!response.ok) {
                console.warn("Could not fetch Ollama models. Is Ollama running?");
                return;
            }
            const data = await response.json();
            const ollamaModels: AIModel[] = data.models.map((model: any) => ({
                id: model.name,
                name: model.name.split(':')[0],
                provider: 'ollama'
            }));
            setAvailableModels(prev => [...prev, ...ollamaModels]);
        } catch (error) {
            console.warn("Ollama server not found. Running with Google Models only.");
        }
    };
    fetchOllamaModels();
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(recentChatIds));
  }, [recentChatIds]);

  const activeSpace = useMemo(() => spaces.find(s => s.id === activeSpaceId), [spaces, activeSpaceId]);
  const activeChat = useMemo(() => activeSpace?.chats.find(c => c.id === activeChatId), [activeSpace, activeChatId]);

  const handleSelectChat = (spaceId: string, chatId: string) => {
    setActiveSpaceId(spaceId);
    setActiveChatId(chatId);
    
    setRecentChatIds(prev => {
        const newRecents = [chatId, ...prev.filter(id => id !== chatId)];
        return newRecents.slice(0, MAX_RECENT_CHATS);
    });
  };

  const handleCreateSpace = (name: string, icon: IconName, color?: string) => {
      const newSpace: Space = {
          id: `space-${Date.now()}`,
          name,
          color: color || '#4f46e5',
          personas: [],
          chats: [],
      };
      setSpaces(prev => [...prev, newSpace]);
      setActiveSpaceId(newSpace.id);
      setActiveChatId(null);
  };
  
  const handleCreateChat = () => {
    if (!activeSpaceId) return;
    const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name: 'New Chat',
        messages: [],
        tags: [],
        knowledgeAreas: [],
        modelId: availableModels[0]?.id || undefined,
    };
    setSpaces(prevSpaces => prevSpaces.map(space => {
        if (space.id === activeSpaceId) {
            return { ...space, chats: [...space.chats, newChat] };
        }
        return space;
    }));
    setActiveChatId(newChat.id);
  };
  
  const handleAddMessage = (message: Omit<ChatMessage, 'id'>) => {
    if (!activeSpaceId || !activeChatId) return;

    const newMessage = { ...message, id: `msg-${Date.now()}` };

    setSpaces(prevSpaces => prevSpaces.map(space => {
      if (space.id === activeSpaceId) {
        return {
          ...space,
          chats: space.chats.map(chat => {
            if (chat.id === activeChatId) {
              return { ...chat, messages: [...chat.messages, newMessage] };
            }
            return chat;
          })
        };
      }
      return space;
    }));
  };

  const handleAddItem = (type: 'tag' | 'knowledge' | 'persona', name: string, icon: IconName, color: string) => {
      if (!activeSpaceId) return;
      const newItem: Tag = { id: `${type}-${Date.now()}`, name, icon, color };
      
      setSpaces(prevSpaces => prevSpaces.map(space => {
          if (space.id !== activeSpaceId) return space;
          if (type === 'persona') {
              return { ...space, personas: [...space.personas, newItem] };
          } else {
              if (!activeChatId) return space;
              return {
                  ...space,
                  chats: space.chats.map(chat => {
                      if (chat.id !== activeChatId) return chat;
                      if (type === 'tag') {
                          return { ...chat, tags: [...chat.tags, newItem] };
                      }
                      if (type === 'knowledge') {
                          return { ...chat, knowledgeAreas: [...chat.knowledgeAreas, newItem] };
                      }
                      return chat;
                  })
              }
          }
      }));
  };
  
  const handleDeleteItem = (type: 'tag' | 'knowledge' | 'persona', itemId: string) => {
      if (!activeSpaceId) return;

      setSpaces(prevSpaces => prevSpaces.map(space => {
          if (space.id !== activeSpaceId) return space;
          if (type === 'persona') {
              return { ...space, personas: space.personas.filter(p => p.id !== itemId) };
          } else {
              if (!activeChatId) return space;
              return {
                  ...space,
                  chats: space.chats.map(chat => {
                      if (chat.id !== activeChatId) return chat;
                      if (type === 'tag') {
                          return { ...chat, tags: chat.tags.filter(t => t.id !== itemId) };
                      }
                      if (type === 'knowledge') {
                          return { ...chat, knowledgeAreas: chat.knowledgeAreas.filter(k => k.id !== itemId) };
                      }
                      return chat;
                  })
              }
          }
      }));
  };

  const handleMoveChat = (chatId: string, sourceSpaceId: string, destinationSpaceId: string) => {
    if (sourceSpaceId === destinationSpaceId) return;

    setSpaces(prevSpaces => {
        let chatToMove: Chat | undefined;
        const newSpaces = JSON.parse(JSON.stringify(prevSpaces)); // Deep copy to avoid mutation issues

        const sourceSpace = newSpaces.find((s: Space) => s.id === sourceSpaceId);
        if (sourceSpace) {
            const chatIndex = sourceSpace.chats.findIndex((c: Chat) => c.id === chatId);
            if (chatIndex > -1) {
                [chatToMove] = sourceSpace.chats.splice(chatIndex, 1);
            }
        }

        if (chatToMove) {
            const destSpace = newSpaces.find((s: Space) => s.id === destinationSpaceId);
            if (destSpace) {
                destSpace.chats.push(chatToMove);
            }
        }

        return newSpaces;
    });
  };
  
  const handleRenameItem = (type: 'space' | 'chat', id: string, newName: string) => {
    if (!newName.trim()) return;
    setSpaces(prevSpaces => prevSpaces.map(space => {
        if (type === 'space' && space.id === id) {
            return { ...space, name: newName };
        }
        if (type === 'chat') {
            const chatExists = space.chats.some(c => c.id === id);
            if (chatExists) {
                return {
                    ...space,
                    chats: space.chats.map(chat => {
                        if (chat.id === id) {
                            return { ...chat, name: newName };
                        }
                        return chat;
                    })
                };
            }
        }
        return space;
    }));
  };

  const handleSetChatModel = (chatId: string, modelId: string) => {
    setSpaces(prevSpaces => prevSpaces.map(space => ({
      ...space,
      chats: space.chats.map(chat => 
        chat.id === chatId ? { ...chat, modelId } : chat
      ),
    })));
  };

  const openModal = (type: ModalState['type']) => setModalState({ type, isOpen: true });

  const getModalTitle = () => {
      switch (modalState.type) {
          case 'space': return 'Create New Space';
          case 'tag': return 'Add Chat Tag';
          case 'knowledge': return 'Add Knowledge Area';
          case 'persona': return 'Add Space Persona';
          default: return '';
      }
  };

  return (
    <>
      <div className="flex h-screen text-gray-200 font-sans p-4 gap-4 bg-[#13131A]">
        <div
          className="transition-all duration-300 ease-in-out"
          style={{ width: isLeftSidebarOpen ? '280px' : '0px' }}
        >
          <LeftSidebar 
            isOpen={isLeftSidebarOpen}
            spaces={spaces}
            activeSpaceId={activeSpaceId}
            activeChatId={activeChatId}
            recentChatIds={recentChatIds}
            onSelectChat={handleSelectChat}
            onNewChat={handleCreateChat}
            onNewSpace={() => openModal('space')}
            onMoveChat={handleMoveChat}
            onRenameItem={handleRenameItem}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <MainContent
            activeChat={activeChat}
            onAddMessage={handleAddMessage}
            isLeftSidebarOpen={isLeftSidebarOpen}
            toggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            toggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            onRenameItem={handleRenameItem}
            availableModels={availableModels}
            onSetChatModel={handleSetChatModel}
          />
        </div>

        <div
          className="transition-all duration-300 ease-in-out"
          style={{ width: isRightSidebarOpen ? '280px' : '0px' }}
        >
          <RightSidebar 
            isOpen={isRightSidebarOpen}
            activeSpace={activeSpace}
            activeChat={activeChat}
            onAddItem={openModal}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </div>
      <Modal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ type: null, isOpen: false })}
          onSubmit={(name, icon, color) => {
              if (modalState.type === 'space') {
                  handleCreateSpace(name, icon, color);
              } else if (modalState.type) {
                  handleAddItem(modalState.type, name, icon, color || '#a855f7');
              }
          }}
          title={getModalTitle()}
          showColorPicker={['space', 'tag', 'knowledge', 'persona'].includes(modalState.type || '')}
      />
    </>
  );
};

export default App;