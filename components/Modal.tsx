import React, { useState, useEffect } from 'react';
import { Icon, iconsList, IconName } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, icon: IconName, color?: string) => void;
  title: string;
  showColorPicker?: boolean;
}

const colors = ['#4f46e5', '#a855f7', '#db2777', '#eab308', '#22c55e', '#0ea5e9'];

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, showColorPicker = false }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>('tag');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    if (isOpen) {
        setName('');
        setSelectedIcon('tag');
        setSelectedColor(colors[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, selectedIcon, showColorPicker ? selectedColor : undefined);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-[#1C1B22] border border-[#3B3A4A] rounded-2xl p-6 w-full max-w-md m-4 text-white transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2A2833] border border-[#3B3A4A] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] text-sm rounded-lg p-2.5 placeholder:text-gray-500 text-gray-200 transition"
              required
            />
          </div>

          {showColorPicker && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-[#1C1B22] ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto bg-[#2A2833] p-2 rounded-lg">
              {iconsList.map(iconName => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${selectedIcon === iconName ? 'bg-[#4f46e5] text-white' : 'hover:bg-[#3B3A4A]'}`}
                >
                  <Icon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#2A2833] hover:bg-[#3B3A4A] text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};