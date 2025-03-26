import React, { useState } from 'react';
import { Tag, Plus, X, CheckCircle, XCircle } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';

interface Tag {
  name: string;
  color: string;
  _id?: string;
}

interface TagsSectionProps {
  tags: Tag[];
  activo: boolean;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (data: { tags: Tag[]; activo: boolean }) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  activo,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
}) => {
  const [nuevoTag, setNuevoTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1'); // Default indigo color

  const handleAddTag = () => {
    if (nuevoTag.trim() && !tags.some(tag => tag.name === nuevoTag.trim())) {
      onChange({ 
        tags: [...tags, { name: nuevoTag.trim(), color: selectedColor }], 
        activo 
      });
      setNuevoTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    onChange({
      tags: tags.filter((_, i) => i !== index),
      activo
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const toggleActivo = () => {
    onChange({ tags, activo: !activo });
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-indigo-400
  `;

  return (
    <section className={`
      rounded-xl border-2 
      ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'}
      shadow-lg hover:shadow-xl 
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      overflow-hidden
    `}>
      <SectionHeader
        title="Tags y Estado"
        Icon={Tag}
        theme={theme}
        editMode={editMode}
        onSave={onSave}
        isLoading={isLoading}
        iconColor="indigo"
      />
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Estado del Cliente
              </h3>
              <button
                onClick={toggleActivo}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 
                  transition-colors duration-300 ease-in-out
                  ${activo 
                    ? 'bg-green-500 border-green-500' 
                    : `${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-200'}`}
                  focus:outline-none focus:ring-2 focus:ring-green-500/50
                `}
                disabled={!editMode}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full 
                    bg-white shadow-lg ring-0 transition duration-300 ease-in-out
                    ${activo ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
            <div className={`
              flex items-center space-x-2 p-3 rounded-lg
              ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
              backdrop-blur-sm
            `}>
              {activo ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">Cliente Activo</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-500 font-medium">Cliente Inactivo</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Tags
            </h3>
            {editMode && (
              <div className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={nuevoTag}
                      onChange={(e) => setNuevoTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Agregar nuevo tag"
                      className={inputClasses}
                    />
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-12 h-12 p-1 rounded-lg cursor-pointer"
                      title="Seleccionar color del tag"
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleAddTag}
                    disabled={!nuevoTag.trim()}
                    className={`
                      flex-shrink-0
                      bg-gradient-to-r from-indigo-500 to-indigo-600
                      hover:from-indigo-600 hover:to-indigo-700
                      shadow-lg hover:shadow-xl
                      transform transition-all duration-300 ease-in-out
                      hover:scale-105 active:scale-95
                    `}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                {errors?.tags && (
                  <p className="text-sm text-red-500 mt-2 animate-pulse">{errors.tags}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className={`text-center w-full py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No hay tags agregados
                </p>
              ) : (
                tags.map((tag, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-1 px-3 py-1 rounded-full text-sm
                      transition-all duration-300 ease-in-out
                    `}
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color
                    }}
                  >
                    <span>{tag.name}</span>
                    {editMode && (
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className={`
                          ml-1 rounded-full p-0.5
                          opacity-0 group-hover:opacity-100
                          hover:bg-black/10
                          transition-all duration-300 ease-in-out
                        `}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TagsSection;
