import React from 'react';
import { Ruler } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface InfoFisicaData {
  altura: number;
  peso: number;
}

interface InfoFisicaSectionProps {
  data: InfoFisicaData;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (data: InfoFisicaData) => void;
}

const InfoFisicaSection: React.FC<InfoFisicaSectionProps> = ({
  data,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
}) => {
  const handleChange = (field: keyof InfoFisicaData, value: string) => {
    onChange({
      ...data,
      [field]: parseFloat(value) || 0
    });
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-green-500/50 focus:border-green-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-green-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

  const calculateIMC = () => {
    if (data.altura && data.peso) {
      const alturaEnMetros = data.altura / 100;
      const imc = data.peso / (alturaEnMetros * alturaEnMetros);
      return imc.toFixed(1);
    }
    return null;
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { text: 'Bajo peso', color: 'yellow' };
    if (imc < 25) return { text: 'Peso normal', color: 'green' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'orange' };
    return { text: 'Obesidad', color: 'red' };
  };

  const imc = calculateIMC();
  const imcCategory = imc ? getIMCCategory(parseFloat(imc)) : null;

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
        title="Información Física"
        Icon={Ruler}
        theme={theme}
        editMode={editMode}
        onSave={onSave}
        isLoading={isLoading}
        iconColor="green"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Altura (cm)</label>
            {editMode ? (
              <input
                type="number"
                value={data.altura || ''}
                onChange={e => handleChange('altura', e.target.value)}
                className={`${inputClasses} ${errors?.altura ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese la altura en cm"
                min="0"
                step="1"
              />
            ) : (
              <p className="text-lg">{data.altura} cm</p>
            )}
            {errors?.altura && (
              <p className={errorClasses}>{errors.altura}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Peso (kg)</label>
            {editMode ? (
              <input
                type="number"
                value={data.peso || ''}
                onChange={e => handleChange('peso', e.target.value)}
                className={`${inputClasses} ${errors?.peso ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese el peso en kg"
                min="0"
                step="0.1"
              />
            ) : (
              <p className="text-lg">{data.peso} kg</p>
            )}
            {errors?.peso && (
              <p className={errorClasses}>{errors.peso}</p>
            )}
          </div>
        </div>

        {imc && (
          <div className={`
            mt-6 p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
            backdrop-blur-sm
            transition-all duration-300 ease-in-out
          `}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">IMC (Índice de Masa Corporal)</span>
                <span className="text-lg font-bold">{imc}</span>
              </div>
              {imcCategory && (
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  bg-${imcCategory.color}-500/20 text-${imcCategory.color}-600
                  dark:bg-${imcCategory.color}-500/30 dark:text-${imcCategory.color}-400
                  inline-flex items-center space-x-1 self-start
                `}>
                  <span>{imcCategory.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InfoFisicaSection;
