import React from 'react';
import { User } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface InfoBasicaData {
  nombre: string;
  email: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decirlo';
  telefono: string;
}

interface InfoBasicaSectionProps {
  data: InfoBasicaData;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (data: InfoBasicaData) => void;
}

const InfoBasicaSection: React.FC<InfoBasicaSectionProps> = ({
  data,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
}) => {
  const handleChange = (field: keyof InfoBasicaData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-blue-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

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
        title="Información Básica"
        Icon={User}
        theme={theme}
        editMode={editMode}
        onSave={onSave}
        isLoading={isLoading}
        iconColor="blue"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Nombre</label>
            {editMode ? (
              <input
                type="text"
                value={data.nombre}
                onChange={e => handleChange('nombre', e.target.value)}
                className={`${inputClasses} ${errors?.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese el nombre"
              />
            ) : (
              <p className="text-lg font-semibold">{data.nombre}</p>
            )}
            {errors?.nombre && (
              <p className={errorClasses}>{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Email</label>
            {editMode ? (
              <input
                type="email"
                value={data.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`${inputClasses} ${errors?.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="ejemplo@correo.com"
              />
            ) : (
              <p className="text-lg">{data.email}</p>
            )}
            {errors?.email && (
              <p className={errorClasses}>{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Fecha de Nacimiento</label>
            {editMode ? (
              <input
                type="date"
                value={data.fechaNacimiento}
                onChange={e => handleChange('fechaNacimiento', e.target.value)}
                className={`${inputClasses} ${errors?.fechaNacimiento ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              />
            ) : (
              <p className="text-lg">{new Date(data.fechaNacimiento).toLocaleDateString()}</p>
            )}
            {errors?.fechaNacimiento && (
              <p className={errorClasses}>{errors.fechaNacimiento}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Género</label>
            {editMode ? (
              <select
                value={data.genero}
                onChange={e => handleChange('genero', e.target.value)}
                className={`${inputClasses} ${errors?.genero ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            ) : (
              <p className="text-lg">{data.genero}</p>
            )}
            {errors?.genero && (
              <p className={errorClasses}>{errors.genero}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Teléfono</label>
            {editMode ? (
              <input
                type="tel"
                value={data.telefono}
                onChange={e => handleChange('telefono', e.target.value)}
                className={`${inputClasses} ${errors?.telefono ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="+34 XXX XXX XXX"
              />
            ) : (
              <p className="text-lg">{data.telefono}</p>
            )}
            {errors?.telefono && (
              <p className={errorClasses}>{errors.telefono}</p>
            )}
          </div>
        </div>

        <div className={`
          mt-6 p-4 rounded-lg
          ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          backdrop-blur-sm
          transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center space-x-3">
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            )}
            <span className="font-medium">{data.nombre}</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-500">{data.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoBasicaSection;
