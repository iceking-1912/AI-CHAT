import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Space, Chat } from '../types';

interface LeftSidebarProps {
  isOpen: boolean;
  spaces: Space[];
  activeSpaceId: string | null;
  activeChatId: string | null;
  recentChatIds: string[];
  onSelectChat: (spaceId: string, chatId: string) => void;
  onNewChat: () => void;
  onNewSpace: () => void;
  onMoveChat: (chatId: string, sourceSpaceId: string, destinationSpaceId: string) => void;
  onRenameItem: (type: 'space' | 'chat', id: string, newName: string) => void;
}

const EditableName: React.FC<{
    initialName: string;
    onSave: (newName: string) => void;
    className?: string;
    inputClassName?: string;
    isTitle?: boolean;
}> = ({ initialName, onSave, className, inputClassName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (name.trim() && name !== initialName) {
            onSave(name);
        } else {
            setName(initialName);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setName(initialName);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={name}
                onClick={e => e.stopPropagation()}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={inputClassName}
            />
        );
    }

    return (
        <span onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className={className}>
            {name}
        </span>
    );
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  isOpen, spaces, activeSpaceId, activeChatId, recentChatIds, onSelectChat, onNewChat, onNewSpace, onMoveChat, onRenameItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const recentChats = useMemo(() => {
    return recentChatIds
      .map(chatId => {
        for (const space of spaces) {
          const chat = space.chats.find(c => c.id === chatId);
          if (chat) {
            return { ...chat, spaceId: space.id, spaceName: space.name, spaceColor: space.color };
          }
        }
        return null;
      })
      .filter((chat): chat is (Chat & { spaceId: string; spaceName: string; spaceColor: string; }) => chat !== null);
  }, [recentChatIds, spaces]);

  const filteredSpaces = useMemo(() => {
    if (!searchTerm) return spaces;
    const lowercasedFilter = searchTerm.toLowerCase();

    return spaces
      .filter(space => 
        space.name.toLowerCase().includes(lowercasedFilter) ||
        space.chats.some(chat => chat.name.toLowerCase().includes(lowercasedFilter))
      )
      .map(space => {
        if (space.name.toLowerCase().includes(lowercasedFilter)) {
          return space;
        }
        const filteredChats = space.chats.filter(chat =>
          chat.name.toLowerCase().includes(lowercasedFilter)
        );
        return { ...space, chats: filteredChats };
      });
  }, [spaces, searchTerm]);

  const handleDragStart = (e: React.DragEvent, chatId: string, sourceSpaceId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ chatId, sourceSpaceId }));
  };

  const handleDragOver = (e: React.DragEvent, spaceId: string) => {
    e.preventDefault();
    setDropTargetId(spaceId);
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, destinationSpaceId: string) => {
    e.preventDefault();
    setDropTargetId(null);
    try {
      const { chatId, sourceSpaceId } = JSON.parse(e.dataTransfer.getData('application/json'));
      if (sourceSpaceId !== destinationSpaceId) {
        onMoveChat(chatId, sourceSpaceId, destinationSpaceId);
      }
    } catch (error) {
      console.error("Failed to parse drag-and-drop data:", error);
    }
  };

  return (
    <aside
      className={`bg-[#1C1B22] rounded-2xl h-full flex flex-col p-4 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <h1 className="font-semibold text-lg text-white">Conversations</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
        <button 
          onClick={onNewChat}
          className="inline-flex items-center justify-center gap-2 bg-[#2A2833] hover:bg-[#3B3A4A] w-full py-2 px-4 rounded-lg text-sm font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
          <Icon name="message-square-plus" className="w-4 h-4" />
          New Chat
        </button>
        <button 
          onClick={onNewSpace}
          className="inline-flex items-center justify-center gap-2 bg-[#2A2833] hover:bg-[#3B3A4A] w-full py-2 px-4 rounded-lg text-sm font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] focus:ring-offset-[#1C1B22]">
          <Icon name="layout-grid" className="w-4 h-4" />
          New Space
        </button>
      </div>

      <div className="relative mb-6 flex-shrink-0">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search spaces & chats"
          className="w-full bg-[#2A2833] border border-[#3B3A4A] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] text-sm rounded-lg pl-9 pr-10 py-2 placeholder:text-gray-500 text-gray-200 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-gray-400 bg-[#1C1B22] px-1.5 py-0.5 rounded">
          ⌘ K
        </div>
      </div>

      <div className="flex-grow overflow-y-auto -mr-2 pr-2">
        {recentChats.length > 0 && !searchTerm && (
          <div className="mb-4">
              <h2 className="text-gray-400 text-sm font-medium px-2 pt-2 mb-2 flex items-center gap-2">
                <Icon name="history" className="w-4 h-4" />
                Recent Chats
              </h2>
              <ul>
                {recentChats.map(chat => (
                  <li key={chat.id}>
                    <button 
                      onClick={() => onSelectChat(chat.spaceId, chat.id)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                        activeChatId === chat.id ? 'bg-[#3B3A4A] text-white' : 'text-gray-300 hover:bg-[#2A2833]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: chat.spaceColor}}></div>
                      <span className="truncate">{chat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <hr className="border-gray-700 my-4" />
          </div>
        )}

        {filteredSpaces.length > 0 ? filteredSpaces.map(space => (
          <div 
            key={space.id} 
            className={`mb-4 rounded-lg transition-colors ${dropTargetId === space.id ? 'bg-[#2A2833]' : ''}`}
            onDragOver={(e) => handleDragOver(e, space.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, space.id)}
          >
            <h2 className="text-gray-400 text-sm font-medium px-2 pt-2 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: space.color}}></div>
               <EditableName
                  initialName={space.name}
                  onSave={(newName) => onRenameItem('space', space.id, newName)}
                  className="flex-grow cursor-text truncate"
                  inputClassName="bg-transparent border-b border-[#4f46e5] w-full focus:outline-none text-gray-400 text-sm font-medium"
              />
            </h2>
            <ul>
              {space.chats.map(chat => (
                <li key={chat.id} 
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, chat.id, space.id)}
                  className="cursor-move"
                >
                  <button 
                    onClick={() => onSelectChat(space.id, chat.id)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                      activeChatId === chat.id ? 'bg-[#3B3A4A] text-white' : 'text-gray-300 hover:bg-[#2A2833]'
                    }`}
                  >
                    <EditableName
                      initialName={chat.name}
                      onSave={(newName) => onRenameItem('chat', chat.id, newName)}
                      className="block w-full text-left truncate"
                      inputClassName="bg-transparent w-full text-sm p-0 focus:outline-none"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-10">
            <Icon name="search" className="w-8 h-8 mx-auto mb-2" />
            <p>No results found.</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[#2A2833] flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40" alt="Alex Designer" className="w-10 h-10 rounded-lg" />
          <div>
            <p className="font-semibold text-white">Alex</p>
            <p className="text-gray-400 text-sm">Designer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;