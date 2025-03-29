// NuevaAsesoriaPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevaAsesoriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newService: any) => void;
  isDarkMode: boolean;
}

interface FormData {
  nombre: string;
  descripcion: string;
  tipo: string;
  serviciosAdicionales: ('Pack de Citas' | 'Planificacion' | 'Dietas')[];
}

const NuevaAsesoriaPopup: React.FC<NuevaAsesoriaPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    tipo: 'Asesoría Individual',
    serviciosAdicionales: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
=======
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServicioAdicionalChange = (servicio: 'Pack de Citas' | 'Planificacion' | 'Dietas') => {
    setFormData(prev => {
      const servicios = prev.serviciosAdicionales.includes(servicio)
        ? prev.serviciosAdicionales.filter(s => s !== servicio)
        : [...prev.serviciosAdicionales, servicio];
      return { ...prev, serviciosAdicionales: servicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      // Instead of making an API call here, just pass the form data to the parent component
      onAdd({
        ...formData,
        fechaCreacion: new Date().toISOString()
      });
=======
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          fechaCreacion: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al crear la asesoría');
      }

      const newService = await response.json();
      console.log('Asesoría creada exitosamente:', newService);
      
      onAdd(newService);
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
      onClose();
    } catch (error) {
      console.error('Error al crear la asesoría:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la asesoría');
    } finally {
      setIsLoading(false);
    }
  };
<<<<<<< HEAD
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Nueva Asesoría Individual
                  </h3>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre Field */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                      Nombre
=======

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md overflow-hidden ${
              isDarkMode
                ? 'bg-gray-800/95 border-gray-700/50'
                : 'bg-white/95 border-gray-200/50'
            } rounded-3xl shadow-2xl overflow-hidden`}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />

            <div className="p-8">
              {/* Header */}
              <div className="relative mb-8">
                <div className="absolute -top-3 -right-3">
                  <button
                    onClick={onClose}
                    className={`p-2.5 rounded-full shadow-lg ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    } transform transition-all duration-200 hover:scale-110 hover:rotate-90 group border ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                  </button>
                </div>

                <h2 className={`text-3xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                } pb-3 border-b relative`}>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Nueva Asesoría Individual
                  </span>
                  <div className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                </h2>
              </div>

              {error && (
                <div className="mb-6">
                  <div className="p-4 bg-red-100/90 backdrop-blur-sm border border-red-400 text-red-700 rounded-xl">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="group">
                    <label
                      htmlFor="nombre"
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}
                    >
                      <span>Nombre</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Nombre de la asesoría"
<<<<<<< HEAD
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Descripción Field */}
                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                      Descripción
=======
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/50 text-white border-gray-600'
                          : 'bg-white/50 text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="descripcion"
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}
                    >
                      <span>Descripción</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe la asesoría"
<<<<<<< HEAD
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Servicios Adicionales Field */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Servicios Adicionales
=======
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        isDarkMode
                          ? 'bg-gray-700/50 text-white border-gray-600'
                          : 'bg-white/50 text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 backdrop-blur-sm resize-none`}
                    />
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}>
                      <span>Servicios Adicionales</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['Pack de Citas', 'Planificacion', 'Dietas'] as const).map((servicio) => (
                        <label
                          key={servicio}
<<<<<<< HEAD
                          className={`flex items-center p-3 rounded-lg border ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          } cursor-pointer transition-colors`}
=======
                          className={`flex items-center p-3 rounded-xl border ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'border-blue-500 bg-blue-50/10'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                          } cursor-pointer transition-all duration-200 group/item`}
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                        >
                          <input
                            type="checkbox"
                            checked={formData.serviciosAdicionales.includes(servicio)}
                            onChange={() => handleServicioAdicionalChange(servicio)}
<<<<<<< HEAD
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
=======
                            className="hidden"
                          />
                          <span className={`text-sm ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'text-blue-500'
                              : isDarkMode
                                ? 'text-gray-300'
                                : 'text-gray-700'
                          } group-hover/item:text-blue-500 transition-colors`}>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
                            {servicio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
<<<<<<< HEAD

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg font-medium transition-colors
                               bg-gray-100 hover:bg-gray-200 text-gray-700
                               dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 rounded-lg font-medium text-white 
                               bg-gradient-to-r from-blue-600 to-blue-400 
                               hover:from-blue-700 hover:to-blue-500 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creando...
                        </span>
                      ) : (
                        'Crear Asesoría'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
=======
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700/50">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700/70 text-gray-200 hover:bg-gray-600/70' 
                        : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
                    } backdrop-blur-sm`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25'
                    } bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:to-purple-600`}
                  >
                    {isLoading ? 'Creando...' : 'Crear Asesoría'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
      )}
    </AnimatePresence>
  );
};

<<<<<<< HEAD
export default NuevaAsesoriaPopup;
=======
export default NuevaAsesoriaPopup;
>>>>>>> b8373c7173fdde2697439aec9aabf8a811bb037c
