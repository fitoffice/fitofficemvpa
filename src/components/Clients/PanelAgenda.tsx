import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Filter,
  Tag,
  BookOpen,
  Dumbbell,
  Apple,
  DollarSign,
  Search,
  ChevronRight,
} from 'lucide-react';
import Button from '../Common/Button';
import Calendar from 'react-calendar';
import './PanelAgenda.css';
import EventoPopup from './EventoPopup';

interface PanelAgendaProps {
  clienteId: string;
}

interface Evento {
  id: string;
  fecha: Date;
  hora: string;
  tipo: 'entrenamiento' | 'nutricion' | 'finanzas' | 'otro';
  titulo: string;
  descripcion?: string;
  esDelEntrenador: boolean;
}

interface Nota {
  id: string;
  fecha: Date;
  titulo: string;
  contenido: string;
  tags: string[];
  categoria: 'nutricion' | 'entrenamiento' | 'finanzas' | 'general';
}

const PanelAgenda: React.FC<PanelAgendaProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendario' | 'notas'>('calendario');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [mostrarFormularioNota, setMostrarFormularioNota] = useState(false);
  const [mostrarPopupEvento, setMostrarPopupEvento] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    fecha: new Date(),
    hora: '',
    tipo: 'entrenamiento',
    esDelEntrenador: false,
  });
  const [nuevaNota, setNuevaNota] = useState<Partial<Nota>>({
    fecha: new Date(),
    titulo: '',
    contenido: '',
    tags: [],
    categoria: 'general',
  });

  const categoriasNotas = [
    { valor: 'nutricion', icono: <Apple size={18} />, color: 'bg-green-100 text-green-600' },
    { valor: 'entrenamiento', icono: <Dumbbell size={18} />, color: 'bg-blue-100 text-blue-600' },
    { valor: 'finanzas', icono: <DollarSign size={18} />, color: 'bg-yellow-100 text-yellow-600' },
    { valor: 'general', icono: <BookOpen size={18} />, color: 'bg-gray-100 text-gray-600' },
  ];

  const tiposEvento = [
    { valor: 'entrenamiento', color: 'bg-blue-500' },
    { valor: 'nutricion', color: 'bg-green-500' },
    { valor: 'finanzas', color: 'bg-yellow-500' },
    { valor: 'otro', color: 'bg-purple-500' },
  ];

  const filtrarEventosPorFecha = (fecha: Date) => {
    return eventos.filter(evento => 
      evento.fecha.toDateString() === fecha.toDateString()
    );
  };

  const filtrarNotas = () => {
    let notasFiltradas = notas;
    
    if (filtroCategoria !== 'todos') {
      notasFiltradas = notasFiltradas.filter(nota => nota.categoria === filtroCategoria);
    }
    
    if (searchTerm.trim() !== '') {
      const termLower = searchTerm.toLowerCase();
      notasFiltradas = notasFiltradas.filter(nota => 
        nota.titulo.toLowerCase().includes(termLower) || 
        nota.contenido.toLowerCase().includes(termLower) ||
        nota.tags.some(tag => tag.toLowerCase().includes(termLower))
      );
    }
    
    return notasFiltradas;
  };

  const agregarEvento = () => {
    if (nuevoEvento.titulo && nuevoEvento.hora) {
      const eventoCompleto: Evento = {
        id: Date.now().toString(),
        fecha: nuevoEvento.fecha || new Date(),
        hora: nuevoEvento.hora,
        tipo: nuevoEvento.tipo || 'otro',
        titulo: nuevoEvento.titulo,
        descripcion: nuevoEvento.descripcion,
        esDelEntrenador: nuevoEvento.esDelEntrenador || false,
      };
      setEventos([...eventos, eventoCompleto]);
      setMostrarFormularioEvento(false);
      setNuevoEvento({
        fecha: new Date(),
        hora: '',
        tipo: 'entrenamiento',
        esDelEntrenador: false,
      });
    }
  };

  const agregarNota = () => {
    if (nuevaNota.titulo && nuevaNota.contenido) {
      const notaCompleta: Nota = {
        id: Date.now().toString(),
        fecha: new Date(),
        titulo: nuevaNota.titulo,
        contenido: nuevaNota.contenido,
        tags: nuevaNota.tags || [],
        categoria: nuevaNota.categoria || 'general',
      };
      setNotas([...notas, notaCompleta]);
      setMostrarFormularioNota(false);
      setNuevaNota({
        fecha: new Date(),
        titulo: '',
        contenido: '',
        tags: [],
        categoria: 'general',
      });
    }
  };

  const handleCrearEvento = (eventoNuevo: Evento) => {
    setEventos([...eventos, eventoNuevo]);
    setMostrarPopupEvento(false);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="panel-agenda rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div className="tabs-container p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Agenda Personal</h2>
          <div className="flex space-x-2">
            <button
              className={`tab-button px-4 py-2 rounded-full transition-all ${
                activeTab === 'calendario' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40'
              }`}
              onClick={() => setActiveTab('calendario')}
            >
              <div className="flex items-center">
                <CalendarIcon size={18} className="mr-2" />
                <span>Calendario</span>
              </div>
            </button>
            <button
              className={`tab-button px-4 py-2 rounded-full transition-all ${
                activeTab === 'notas' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40'
              }`}
              onClick={() => setActiveTab('notas')}
            >
              <div className="flex items-center">
                <BookOpen size={18} className="mr-2" />
                <span>Notas</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'calendario' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="calendario-container p-4 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="calendar-wrapper md:col-span-1 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
                tileContent={({ date }) => {
                  const eventosDelDia = filtrarEventosPorFecha(date);
                  return eventosDelDia.length > 0 ? (
                    <div className="evento-indicator flex justify-center items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                        {eventosDelDia.length}
                      </span>
                    </div>
                  ) : null;
                }}
              />
            </div>

            <div className="eventos-del-dia md:col-span-2 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <div className="header-eventos flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {formatDate(selectedDate)}
                </h3>
                <Button
                  onClick={() => setMostrarPopupEvento(true)}
                  className="btn-agregar-popup bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all shadow-md"
                >
                  <Plus size={18} className="mr-2" />
                  Añadir Evento
                </Button>
              </div>

              <div className="lista-eventos space-y-3">
                {filtrarEventosPorFecha(selectedDate).length > 0 ? (
                  filtrarEventosPorFecha(selectedDate).map(evento => {
                    const tipoEvento = tiposEvento.find(t => t.valor === evento.tipo);
                    return (
                      <motion.div 
                        key={evento.id} 
                        className={`evento-card rounded-lg p-4 border-l-4 ${tipoEvento?.color.replace('bg-', 'border-')} bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all flex`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`evento-hora-badge w-16 h-16 rounded-full ${tipoEvento?.color} text-white flex flex-col items-center justify-center mr-4 shadow-md`}>
                          <Clock size={16} />
                          <span className="text-sm font-bold">{evento.hora}</span>
                        </div>
                        <div className="evento-contenido flex-1">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{evento.titulo}</h4>
                          {evento.descripcion && <p className="text-gray-600 dark:text-gray-300 mt-1">{evento.descripcion}</p>}
                          <div className="flex mt-2">
                            {evento.esDelEntrenador && (
                              <span className="badge-entrenador bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                                Entrenador
                              </span>
                            )}
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${tipoEvento?.color} bg-opacity-20 text-${tipoEvento?.color.split('-')[1]}-600`}>
                              {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-state p-8 text-center">
                    <div className="empty-icon mb-4 text-gray-300 dark:text-gray-600 flex justify-center">
                      <CalendarIcon size={64} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400">No hay eventos para este día</h4>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">Haz clic en "Añadir Evento" para programar algo</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notas' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="notas-container p-4"
          >
            <div className="header-notas flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="search-bar w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Buscar notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="filtros-categoria flex flex-wrap gap-2 justify-center">
                <button
                  className={`filtro-btn px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filtroCategoria === 'todos' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}                  onClick={() => setFiltroCategoria('todos')}
                  >
                    Todas
                  </button>
                  {categoriasNotas.map(cat => (
                    <button
                      key={cat.valor}
                      className={`filtro-btn px-3 py-1 rounded-full text-sm font-medium transition-all flex items-center ${
                        filtroCategoria === cat.valor 
                          ? `${cat.color.split(' ')[0].replace('bg-', 'bg-')} ${cat.color.split(' ')[1]}`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => setFiltroCategoria(cat.valor)}
                    >
                      <span className="mr-1">{cat.icono}</span>
                      {cat.valor.charAt(0).toUpperCase() + cat.valor.slice(1)}
                    </button>
                  ))}
                </div>
                
                <Button
                  onClick={() => setMostrarFormularioNota(true)}
                  className="btn-agregar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all shadow-md"
                >
                  <Plus size={18} className="mr-2" />
                  Nueva Nota
                </Button>
              </div>
  
              <div className="lista-notas grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtrarNotas().length > 0 ? (
                  filtrarNotas().map(nota => {
                    const categoriaInfo = categoriasNotas.find(cat => cat.valor === nota.categoria);
                    return (
                      <motion.div
                        key={nota.id}
                        className={`nota-card rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all border-t-4 ${categoriaInfo?.color.split(' ')[0]}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="nota-header flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{nota.titulo}</h4>
                          <span className={`categoria-badge ${categoriaInfo?.color} p-1 rounded-md`}>
                            {categoriaInfo?.icono}
                          </span>
                        </div>
                        <p className="nota-contenido text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{nota.contenido}</p>
                        {nota.tags.length > 0 && (
                          <div className="nota-tags flex flex-wrap gap-1 mb-2">
                            {nota.tags.map(tag => (
                              <span key={tag} className="tag bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full flex items-center">
                                <Tag size={12} className="mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="nota-fecha text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(nota.fecha).toLocaleDateString()}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-state col-span-full p-8 text-center">
                    <div className="empty-icon mb-4 text-gray-300 dark:text-gray-600 flex justify-center">
                      <BookOpen size={64} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400">No hay notas disponibles</h4>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">
                      {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'Haz clic en "Nueva Nota" para crear una'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Modal para nuevo evento (existente) */}
        {mostrarFormularioEvento && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nuevo Evento</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Título del evento"
                    value={nuevoEvento.titulo || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
                  <input
                    type="time"
                    value={nuevoEvento.hora || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                  <select
                    value={nuevoEvento.tipo || 'entrenamiento'}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entrenamiento">Entrenamiento</option>
                    <option value="nutricion">Nutrición</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
                  <textarea
                    placeholder="Descripción del evento"
                    value={nuevoEvento.descripcion || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevoEvento.esDelEntrenador || false}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, esDelEntrenador: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Evento del entrenador</span>
                </label>
              </div>
              
              <div className="modal-actions flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setMostrarFormularioEvento(false)}
                  className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={agregarEvento} 
                  className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                >
                  <Check size={18} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
  
        {/* Nuevo popup de evento usando el componente externo */}
        {mostrarPopupEvento && (
          <EventoPopup 
            onClose={() => setMostrarPopupEvento(false)}
            onSave={handleCrearEvento}
            fechaSeleccionada={selectedDate}
          />
        )}
  
        {/* Modal para nueva nota */}
        {mostrarFormularioNota && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nueva Nota</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Título de la nota"
                    value={nuevaNota.titulo || ''}
                    onChange={e => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <select
                    value={nuevaNota.categoria || 'general'}
                    onChange={e => setNuevaNota({ ...nuevaNota, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoriasNotas.map(cat => (
                      <option key={cat.valor} value={cat.valor}>
                        {cat.valor.charAt(0).toUpperCase() + cat.valor.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                  <textarea
                    placeholder="Contenido de la nota"
                    value={nuevaNota.contenido || ''}
                    onChange={e => setNuevaNota({ ...nuevaNota, contenido: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (separados por comas)</label>
                  <input
                    type="text"
                    placeholder="ej: importante, seguimiento, revisión"
                    value={nuevaNota.tags?.join(', ') || ''}
                    onChange={e => setNuevaNota({
                      ...nuevaNota,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="modal-actions flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setMostrarFormularioNota(false)}
                  className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={agregarNota} 
                  className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                >
                  <Check size={18} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };
  
  export default PanelAgenda;