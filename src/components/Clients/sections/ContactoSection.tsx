<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React from 'react';
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
import { MapPin } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface DireccionData {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

interface ContactoSectionProps {
  direccion: DireccionData;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (direccion: DireccionData) => void;
<<<<<<< HEAD
  clientId: string;
=======
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
}

const ContactoSection: React.FC<ContactoSectionProps> = ({
  direccion,
  editMode,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
<<<<<<< HEAD
  clientId,
}) => {
  // Add local state to track input values
  const [localDireccion, setLocalDireccion] = useState<DireccionData>({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
  });

  // Update local state when props change
  useEffect(() => {
    if (direccion) {
      setLocalDireccion(direccion);
    }
  }, [direccion]);

  const handleChange = (field: keyof DireccionData, value: string) => {
    console.log(`Changing ${field} to:`, value);
    
    // Update local state first
    const updatedDireccion = {
      ...localDireccion,
      [field]: value
    };
    
    setLocalDireccion(updatedDireccion);
    console.log('Updated direccion:', updatedDireccion);
    
    // Then notify parent component
    onChange(updatedDireccion);
  };

  // Function to save data to API
  const saveDireccion = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clientId}/contacto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localDireccion),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la dirección');
      }

      // Call the onSave callback to notify parent component
      onSave();
    } catch (error) {
      console.error('Error saving address:', error);
    }
=======
}) => {
  const handleChange = (field: keyof DireccionData, value: string) => {
    onChange({
      ...direccion,
      [field]: value
    });
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-emerald-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

  const getGoogleMapsUrl = () => {
<<<<<<< HEAD
    const address = `${localDireccion.calle}, ${localDireccion.ciudad}, ${localDireccion.codigoPostal}, ${localDireccion.pais}`;
=======
    const address = `${direccion.calle}, ${direccion.ciudad}, ${direccion.codigoPostal}, ${direccion.pais}`;
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

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
        title="Información de Contacto"
        Icon={MapPin}
        theme={theme}
        editMode={editMode}
<<<<<<< HEAD
        onSave={saveDireccion}
=======
        onSave={onSave}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
        isLoading={isLoading}
        iconColor="emerald"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Calle</label>
            {editMode ? (
              <input
                type="text"
<<<<<<< HEAD
                value={localDireccion.calle || ''}
=======
                value={direccion.calle}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                onChange={e => handleChange('calle', e.target.value)}
                className={`${inputClasses} ${errors?.calle ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Nombre de la calle y número"
              />
            ) : (
<<<<<<< HEAD
              <p className="text-lg">{localDireccion.calle}</p>
=======
              <p className="text-lg">{direccion.calle}</p>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
            )}
            {errors?.calle && (
              <p className={errorClasses}>{errors.calle}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Ciudad</label>
            {editMode ? (
              <input
                type="text"
<<<<<<< HEAD
                value={localDireccion.ciudad || ''}
=======
                value={direccion.ciudad}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                onChange={e => handleChange('ciudad', e.target.value)}
                className={`${inputClasses} ${errors?.ciudad ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ciudad"
              />
            ) : (
<<<<<<< HEAD
              <p className="text-lg">{localDireccion.ciudad}</p>
=======
              <p className="text-lg">{direccion.ciudad}</p>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
            )}
            {errors?.ciudad && (
              <p className={errorClasses}>{errors.ciudad}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Código Postal</label>
            {editMode ? (
              <input
                type="text"
<<<<<<< HEAD
                value={localDireccion.codigoPostal || ''}
=======
                value={direccion.codigoPostal}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                onChange={e => handleChange('codigoPostal', e.target.value)}
                className={`${inputClasses} ${errors?.codigoPostal ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Código Postal"
              />
            ) : (
<<<<<<< HEAD
              <p className="text-lg">{localDireccion.codigoPostal}</p>
=======
              <p className="text-lg">{direccion.codigoPostal}</p>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
            )}
            {errors?.codigoPostal && (
              <p className={errorClasses}>{errors.codigoPostal}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>País</label>
            {editMode ? (
              <input
                type="text"
<<<<<<< HEAD
                value={localDireccion.pais || ''}
=======
                value={direccion.pais}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                onChange={e => handleChange('pais', e.target.value)}
                className={`${inputClasses} ${errors?.pais ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="País"
              />
            ) : (
<<<<<<< HEAD
              <p className="text-lg">{localDireccion.pais}</p>
=======
              <p className="text-lg">{direccion.pais}</p>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
            )}
            {errors?.pais && (
              <p className={errorClasses}>{errors.pais}</p>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {!editMode && Object.values(localDireccion).every(value => value) && (
=======
        {!editMode && Object.values(direccion).every(value => value) && (
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
          <div className="mt-6">
            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center space-x-2 p-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'}
                transition-all duration-300 ease-in-out group
                backdrop-blur-sm
              `}
            >
              <MapPin className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
              <span className="flex-1">Ver en Google Maps</span>
              <span className="text-sm text-gray-500">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

<<<<<<< HEAD
export default ContactoSection;
=======
export default ContactoSection;
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
