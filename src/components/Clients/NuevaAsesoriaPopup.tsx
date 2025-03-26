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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      onClose();
    } catch (error) {
      console.error('Error al crear la asesoría:', error);
      setError(error instanceof Error ? error.message : 'Error al crear la asesoría');
    } finally {
      setIsLoading(false);
    }
  };

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
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Nombre de la asesoría"
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
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe la asesoría"
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
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['Pack de Citas', 'Planificacion', 'Dietas'] as const).map((servicio) => (
                        <label
                          key={servicio}
                          className={`flex items-center p-3 rounded-xl border ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'border-blue-500 bg-blue-50/10'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                          } cursor-pointer transition-all duration-200 group/item`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.serviciosAdicionales.includes(servicio)}
                            onChange={() => handleServicioAdicionalChange(servicio)}
                            className="hidden"
                          />
                          <span className={`text-sm ${
                            formData.serviciosAdicionales.includes(servicio)
                              ? 'text-blue-500'
                              : isDarkMode
                                ? 'text-gray-300'
                                : 'text-gray-700'
                          } group-hover/item:text-blue-500 transition-colors`}>
                            {servicio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
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
      )}
    </AnimatePresence>
  );
};

export default NuevaAsesoriaPopup;
