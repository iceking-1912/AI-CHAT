import React from 'react';
import { Icon, IconName } from './Icon';
import { Space, Chat, Tag } from '../types';

interface RightSidebarProps {
  isOpen: boolean;
  activeSpace: Space | undefined;
  activeChat: Chat | undefined;
  onAddItem: (type: 'tag' | 'knowledge' | 'persona') => void;
  onDeleteItem: (type: 'tag' | 'knowledge' | 'persona', itemId: string) => void;
}

const TagComponent: React.FC<{ tag: Tag; onDelete: () => void }> = ({ tag, onDelete }) => {
  return (
    <div className={`group relative inline-flex items-center gap-2 text-sm font-medium text-white rounded-full px-3 py-1.5 border`} style={{ backgroundColor: `${tag.color}30`, borderColor: tag.color }}>
      <Icon name={tag.icon} className="w-4 h-4" style={{ color: tag.color }}/>
      <span>{tag.name}</span>
      <button onClick={onDelete} className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon name="x" className="w-3 h-3 text-white" />
      </button>
    </div>
  );
};

const SidebarSection: React.FC<{
  title: string;
  icon: IconName;
  items: Tag[];
  onAdd: () => void;
  onDelete: (itemId: string) => void;
  disabled?: boolean;
}> = ({ title, icon, items, onAdd, onDelete, disabled = false }) => (
  <div className={`mb-6 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-300 font-semibold flex items-center gap-2">
              <Icon name={icon} className="w-5 h-5" /> {title}
          </h3>
          <button onClick={onAdd} disabled={disabled} className="p-1 rounded-md hover:bg-[#3B3A4A] disabled:cursor-not-allowed">
              <Icon name="plus" className="w-4 h-4 text-gray-400"/>
          </button>
      </div>
      <div className="flex flex-wrap gap-2">
          {items.map(item => <TagComponent key={item.id} tag={item} onDelete={() => onDelete(item.id)} />)}
      </div>
  </div>
);


const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, activeSpace, activeChat, onAddItem, onDeleteItem }) => {
    return (
        <aside 
            className={`bg-[#1C1B22] rounded-2xl h-full flex flex-col p-4 transition-all duration-300 ease-in-out overflow-y-auto ${
                isOpen ? 'opacity-100' : 'opacity-0 invisible'
            }`}
        >
            {activeChat && activeSpace && (
                <div className="mb-6">
                    <h3 className="text-gray-300 font-semibold flex items-center gap-2 mb-3">
                        <Icon name="folder" className="w-5 h-5" /> Current Space
                    </h3>
                    <div className="flex flex-wrap gap-2">
                         <div className={`inline-flex items-center gap-2 text-sm font-medium text-white rounded-md px-3 py-1.5 border`} style={{ backgroundColor: `${activeSpace.color}30`, borderColor: activeSpace.color }}>
                            <span>{activeSpace.name}</span>
                        </div>
                    </div>
                </div>
            )}

            <SidebarSection
                title="Chat Tags"
                icon="tag"
                items={activeChat?.tags || []}
                onAdd={() => onAddItem('tag')}
                onDelete={(id) => onDeleteItem('tag', id)}
                disabled={!activeChat}
            />

            <SidebarSection
                title="Knowledge Area"
                icon="book-open"
                items={activeChat?.knowledgeAreas || []}
                onAdd={() => onAddItem('knowledge')}
                onDelete={(id) => onDeleteItem('knowledge', id)}
                disabled={!activeChat}
            />

            <SidebarSection
                title="Space Personas"
                icon="users"
                items={activeSpace?.personas || []}
                onAdd={() => onAddItem('persona')}
                onDelete={(id) => onDeleteItem('persona', id)}
                disabled={!activeSpace}
            />
        </aside>
    );
};

export default RightSidebar;