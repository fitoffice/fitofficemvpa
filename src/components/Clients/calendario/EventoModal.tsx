<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alert {
  type: 'email' | 'push' | 'sms' | 'popup';
  timeBeforeEvent: number;
}

interface Evento {
  id: string | number;
=======
import React from 'react';
import { X, Clock, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Evento {
  id: number;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  title: string;
  start: Date;
  end: Date;
  descripcion: string;
  color?: string;
  categoria?: string;
<<<<<<< HEAD
  subcategoria?: string;
  cliente?: string;
  ubicacion?: string;
  recordatorios?: string[];
  notas?: string;
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
}

interface EventoModalProps {
  evento: Evento;
  onClose: () => void;
<<<<<<< HEAD
  onEdit: (evento: Evento) => void;
}

const TIPOS_EVENTO = [
  { id: 'TAREA_PROPIA', nombre: 'Tarea Propia', color: '#2563EB' },
  { id: 'CITA_CON_CLIENTE', nombre: 'Cita con Cliente', color: '#16A34A' },
  { id: 'RUTINA_CLIENTE', nombre: 'Rutina de Cliente', color: '#DC2626' },
  { id: 'PAGO_CLIENTE', nombre: 'Pago de Cliente', color: '#9333EA' },
  { id: 'ALARMA', nombre: 'Alarma', color: '#EAB308' },
  { id: 'GENERAL', nombre: 'General', color: '#64748B' }
];

const TIPOS_ALERTA = [
  { id: 'email', nombre: 'Email' },
  { id: 'push', nombre: 'Notificación Push' },
  { id: 'sms', nombre: 'SMS' },
  { id: 'popup', nombre: 'Popup' }
];

const TIEMPOS_ALERTA = [
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 día antes' }
];

export default function EventoModal({ evento, onClose, onEdit }: EventoModalProps) {
  const [title, setTitle] = useState(evento.title);
  const [description, setDescription] = useState(evento.descripcion || '');
  const [startDate, setStartDate] = useState(format(evento.start, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(evento.start, 'HH:mm'));
  const [endDate, setEndDate] = useState(format(evento.end, 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState(format(evento.end, 'HH:mm'));
  const [type, setType] = useState(evento.categoria || 'GENERAL');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Convertir recordatorios a alertas
  useEffect(() => {
    if (evento.recordatorios && evento.recordatorios.length > 0) {
      const parsedAlerts = evento.recordatorios.map(recordatorio => {
        const timeMatch = recordatorio.match(/(\d+)/);
        const time = timeMatch ? parseInt(timeMatch[0]) : 30;
        return {
          type: 'popup' as const,
          timeBeforeEvent: time
        };
      });
      setAlerts(parsedAlerts);
    }
  }, [evento]);

  const handleAddAlert = () => {
    setAlerts([...alerts, { type: 'popup', timeBeforeEvent: 30 }]);
  };

  const handleRemoveAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const handleUpdateAlert = (index: number, field: keyof Alert, value: string | number) => {
    const newAlerts = [...alerts];
    newAlerts[index] = { ...newAlerts[index], [field]: value };
    setAlerts(newAlerts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      // Datos para la API
      const eventData = {
        id: evento.id,
        title,
        description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type,
        alerts
      };

      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/events/${evento.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el evento');
      }

      // Formatear el evento actualizado para el calendario
      const eventoActualizado: Evento = {
        id: evento.id,
        title,
        start: startDateTime,
        end: endDateTime,
        descripcion: description || type,
        color: TIPOS_EVENTO.find(t => t.id === type)?.color || '#4F46E5',
        categoria: type,
        subcategoria: evento.subcategoria || '',
        cliente: evento.cliente || 'N/A',
        ubicacion: evento.ubicacion || 'Ubicación por Defecto',
        recordatorios: alerts.map(alert => `${alert.timeBeforeEvent} minutos antes`),
        notas: description || 'Sin notas'
      };

      onEdit(eventoActualizado);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el evento');
      console.error('Error al actualizar evento:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all animate-fadeIn">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Editar Evento
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                  Tipo de Evento
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                >
                  {TIPOS_EVENTO.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Alertas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAlert}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Añadir Alerta
                  </button>
                </div>
                
                {alerts.map((alert, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-100 dark:border-gray-600 hover:border-blue-500/50 transition-all duration-200">
                    <select
                      value={alert.type}
                      onChange={(e) => handleUpdateAlert(index, 'type', e.target.value as Alert['type'])}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    >
                      {TIPOS_ALERTA.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                    <select
                      value={alert.timeBeforeEvent}
                      onChange={(e) => handleUpdateAlert(index, 'timeBeforeEvent', parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    >
                      {TIEMPOS_ALERTA.map(tiempo => (
                        <option key={tiempo.value} value={tiempo.value}>{tiempo.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlert(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl border-2 border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
=======
}

export default function EventoModal({ evento, onClose }: EventoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative p-6" style={{ borderTop: `4px solid ${evento.color}` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-900 pr-8 mb-4">
            {evento.title}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(evento.start, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(evento.start, 'HH:mm', { locale: es })} - {format(evento.end, 'HH:mm', { locale: es })}
                </p>
              </div>
            </div>

            {evento.categoria && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tag className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex items-center">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${evento.color}20`,
                      color: evento.color 
                    }}
                  >
                    {evento.categoria}
                  </span>
                </div>
              </div>
            )}
            
            {evento.descripcion && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {evento.descripcion}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Editar
            </button>
          </div>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        </div>
      </div>
    </div>
  );
}