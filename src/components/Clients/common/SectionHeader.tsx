import React from 'react';
<<<<<<< HEAD
import { Edit3, Save } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  Icon: React.ComponentType<any>;
  theme: string;
  editMode: boolean;
  onSave: () => void;
  isLoading: boolean;
=======
import { LucideIcon } from 'lucide-react';
import Button from '../../Common/Button';
import { Save } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  Icon: LucideIcon;
  theme: string;
  editMode: boolean;
  onSave?: () => void;
  isLoading?: boolean;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  Icon,
  theme,
  editMode,
  onSave,
  isLoading,
<<<<<<< HEAD
  iconColor = 'purple'
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <Icon className={`w-6 h-6 text-${iconColor}-500`} />
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>
      <button
        onClick={onSave}
        disabled={isLoading}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {editMode ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
      </button>
=======
  iconColor = 'blue'
}) => {
  return (
    <div className={`
      flex justify-between items-center p-4 border-b
      ${theme === 'dark' ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/50 bg-gray-50/50'}
      backdrop-blur-sm transition-all duration-300 ease-in-out
      sticky top-0 z-10
    `}>
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-lg 
          ${theme === 'dark' ? `bg-${iconColor}-500/10` : `bg-${iconColor}-500/10`}
          transition-all duration-300 ease-in-out
        `}>
          <Icon className={`
            w-5 h-5
            ${theme === 'dark' ? `text-${iconColor}-400` : `text-${iconColor}-500`}
            transform transition-transform duration-300 ease-in-out
            group-hover:scale-110
          `} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      {editMode && onSave && (
        <Button
          variant="primary"
          onClick={onSave}
          disabled={isLoading}
          className={`
            shadow-lg hover:shadow-xl 
            transform transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            ${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'}
          `}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2 animate-pulse" />
          )}
          Guardar
        </Button>
      )}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    </div>
  );
};

<<<<<<< HEAD
export default SectionHeader;
=======
export default SectionHeader;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
