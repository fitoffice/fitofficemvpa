import React, { useState } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';

interface CondicionesMedicasSectionProps {
  condiciones: string[];
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (condiciones: string[]) => void;
}

const CondicionesMedicasSection: React.FC<CondicionesMedicasSectionProps> = ({
  condiciones,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
}) => {
  const [nuevaCondicion, setNuevaCondicion] = useState('');

  const handleAddCondicion = () => {
    if (nuevaCondicion.trim() && !condiciones.includes(nuevaCondicion.trim())) {
      onChange([...condiciones, nuevaCondicion.trim()]);
      setNuevaCondicion('');
    }
  };

  const handleRemoveCondicion = (index: number) => {
    onChange(condiciones.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCondicion();
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-red-500/50 focus:border-red-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-red-400
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
        title="Condiciones Médicas"
        Icon={Heart}
        theme={theme}
        editMode={editMode}
        onSave={onSave}
        isLoading={isLoading}
        iconColor="red"
      />
      <div className="p-6">
        {editMode && (
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={nuevaCondicion}
                onChange={(e) => setNuevaCondicion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Agregar condición médica"
                className={inputClasses}
              />
              <Button
                variant="primary"
                onClick={handleAddCondicion}
                disabled={!nuevaCondicion.trim()}
                className={`
                  flex-shrink-0
                  bg-gradient-to-r from-red-500 to-red-600
                  hover:from-red-600 hover:to-red-700
                  shadow-lg hover:shadow-xl
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95
                `}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {errors?.condiciones && (
              <p className="text-sm text-red-500 mt-2 animate-pulse">{errors.condiciones}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          {condiciones.length === 0 ? (
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay condiciones médicas registradas
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {condiciones.map((condicion, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
                    group hover:bg-red-500/10
                    transition-all duration-300 ease-in-out
                    backdrop-blur-sm
                  `}
                >
                  <span className="font-medium">{condicion}</span>
                  {editMode && (
                    <button
                      onClick={() => handleRemoveCondicion(index)}
                      className={`
                        p-1 rounded-full opacity-0 group-hover:opacity-100
                        ${theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-500/20'}
                        text-red-500
                        transition-all duration-300 ease-in-out
                      `}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CondicionesMedicasSection;
