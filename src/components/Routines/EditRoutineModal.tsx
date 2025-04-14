import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Plus, Trash2, ChevronDown, List } from 'lucide-react';
import { BasicInformation } from './BasicInformation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ExerciseListModal from './ExerciseListModal';

interface ExerciseSet {
  _id?: string;
  reps: number | string;
  weight: number | string;
  rest: number | string;
  [key: string]: any;
}

interface Exercise {
  _id?: string;
  id: string;
  name: string;
  notes: string;
  sets: ExerciseSet[];
  metrics?: Array<{ type: string; value: string }>;
}

interface RenderConfig {
  _id?: string;
  campo1: string;
  campo2: string;
  campo3: string;
  [key: string]: any;
}

export interface RoutineData {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  renderConfig: RenderConfig;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface EditRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  // Función para actualizar inmediatamente la rutina en el estado global
  onImmediateChange: (data: RoutineData) => void;
  routine: RoutineData;
  theme?: 'light' | 'dark';
}

const metricOptions = [
  'Repeticiones', 'Peso', 'Descanso', 'Tiempo', 'RPE',
  'RPM', 'RIR', 'Velocidad', 'Cadencia', 'Distancia', 'Altura', 'Calorías', 'Rondas'
];

const metricKeyMap: Record<string, string> = {
  'Repeticiones': 'reps',
  'Peso': 'weight',
  'Descanso': 'rest',
  'Tiempo': 'tempo',
  'RPE': 'rpe',
  'RPM': 'rpm',
  'RIR': 'rir',
  'Velocidad': 'speed',
  'Cadencia': 'cadence',
  'Distancia': 'distance',
  'Altura': 'height',
  'Calorías': 'calories',
  'Rondas': 'round'
};

const keyMetricMap: Record<string, string> = {
  'reps': 'Repeticiones',
  'weight': 'Peso',
  'rest': 'Descanso',
  'tempo': 'Tiempo',
  'rpe': 'RPE',
  'rpm': 'RPM',
  'rir': 'RIR',
  'speed': 'Velocidad',
  'cadence': 'Cadencia',
  'distance': 'Distancia',
  'height': 'Altura',
  'calories': 'Calorías',
  'round': 'Rondas'
};

const EditRoutineModal: React.FC<EditRoutineModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  onImmediateChange,
  routine,
  theme = 'light'
}) => {
  const [routineName, setRoutineName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [openMetricDropdown, setOpenMetricDropdown] = useState<string | null>(null);
  const [apiExercises, setApiExercises] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [focusedExerciseId, setFocusedExerciseId] = useState<string | null>(null);
  const [isExerciseListOpen, setIsExerciseListOpen] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<string[]>(['Repeticiones', 'Peso', 'Descanso']);
  // Bandera para cargar la rutina solo si cambia
  const [loadedRoutineId, setLoadedRoutineId] = useState<string | null>(null);

  // Cargar los datos de la rutina solo la primera vez que se abre el modal o cuando la rutina cambie
  useEffect(() => {
    if (isOpen && routine && routine._id !== loadedRoutineId) {
      setRoutineName(routine.name || '');
      setDescription(routine.description || '');
      setSelectedTags(routine.tags || []);
      setNotes(routine.notes || '');
      
      const metricKeys = [
        routine.renderConfig.campo1,
        routine.renderConfig.campo2,
        routine.renderConfig.campo3
      ].filter(Boolean);
      
      const metricNames = metricKeys.map(
        key => keyMetricMap[key] || (key.charAt(0).toUpperCase() + key.slice(1))
      );
      setCurrentMetrics(metricNames);
      
      const formattedExercises = routine.exercises.map(ex => {
        const firstSet = ex.sets[0] || {};
        const metrics = metricKeys.map(key => ({
          type: keyMetricMap[key] || (key.charAt(0).toUpperCase() + key.slice(1)),
          value: String(firstSet[key] || '')
        }));
        return {
          _id: ex._id,
          id: ex._id || Date.now().toString(),
          name: ex.name,
          notes: ex.notes || '',
          sets: ex.sets,
          metrics
        };
      });
      
      setExercises(formattedExercises);
      setLoadedRoutineId(routine._id);
    }
  }, [isOpen, routine, loadedRoutineId]);

  // Al cerrar el modal, reiniciamos loadedRoutineId para forzar recarga si se vuelve a abrir
  useEffect(() => {
    if (!isOpen) {
      setLoadedRoutineId(null);
    }
  }, [isOpen]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('https://fitoffice2-ff8035a9df10.herokuapp.com/api/exercises');
      setApiExercises(response.data.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  useEffect(() => {
    if (apiExercises.length === 0) {
      fetchExercises();
    }
  }, [apiExercises.length]);

  const handleExerciseNameChange = (exerciseId: string, value: string) => {
    const filteredSuggestions = apiExercises.filter(exercise =>
      exercise.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filteredSuggestions : []);
    setFocusedExerciseId(exerciseId);

    const newExercises = exercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, name: value } : exercise
    );
    setExercises(newExercises);
    onImmediateChange({ ...routine, exercises: newExercises });
  };

  const handleSelectExercises = (selectedExercises: any[]) => {
    const newExercises = selectedExercises.map(exercise => {
      const set: Record<string, string> = {};
      currentMetrics.forEach(metricName => {
        const key = metricKeyMap[metricName] || metricName.toLowerCase();
        set[key] = '';
      });

      return {
        id: exercise._id || Date.now().toString(),
        name: exercise.nombre,
        notes: exercise.descripcion || '',
        sets: [set],
        metrics: currentMetrics.map(type => ({ type, value: '' }))
      };
    });
    
    const updatedExercises = [...exercises, ...newExercises];
    setExercises(updatedExercises);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };

  const handleUpdateMetric = (exerciseId: string, metricIndex: number, newMetricType: string) => {
    const newCurrentMetrics = [...currentMetrics];
    newCurrentMetrics[metricIndex] = newMetricType;
    setCurrentMetrics(newCurrentMetrics);
    
    const updatedExercises = exercises.map(exercise => {
      const updatedMetrics = [...(exercise.metrics || [])];
      if (updatedMetrics[metricIndex]) {
        updatedMetrics[metricIndex] = { ...updatedMetrics[metricIndex], type: newMetricType };
      }
      return { ...exercise, metrics: updatedMetrics };
    });
    
    setExercises(updatedExercises);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };
  
  const updateMetricValue = (exerciseId: string, metricIndex: number, value: string) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedMetrics = [...(exercise.metrics || [])];
        if (updatedMetrics[metricIndex]) {
          updatedMetrics[metricIndex] = { ...updatedMetrics[metricIndex], value };
        }
        
        const metricType = updatedMetrics[metricIndex]?.type;
        if (metricType) {
          const key = metricKeyMap[metricType] || metricType.toLowerCase();
          const updatedSets = exercise.sets.map((set, idx) =>
            idx === 0 ? { ...set, [key]: value } : set
          );
          return { ...exercise, metrics: updatedMetrics, sets: updatedSets };
        }
        return { ...exercise, metrics: updatedMetrics };
      }
      return exercise;
    });
    
    setExercises(updatedExercises);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };
  
  const selectSuggestion = (exerciseId: string, suggestion: any) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, name: suggestion.nombre, notes: suggestion.descripcion || exercise.notes }
        : exercise
    );
    setExercises(updatedExercises);
    setSuggestions([]);
    setFocusedExerciseId(null);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };
  
  const removeExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
    setExercises(updatedExercises);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };

  const addExercise = () => {
    const set: Record<string, string> = {};
    currentMetrics.forEach(metricName => {
      const key = metricKeyMap[metricName] || metricName.toLowerCase();
      set[key] = '';
    });
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      notes: '',
      sets: [set],
      metrics: currentMetrics.map(type => ({ type, value: '' }))
    };
    
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    onImmediateChange({ ...routine, exercises: updatedExercises });
  };

  // Nuevo efecto para actualizar inmediatamente los campos básicos (nombre, descripción, tags, notas)
  useEffect(() => {
    if (isOpen) {
      const updatedRoutine = {
        ...routine,
        name: routineName,
        description,
        tags: selectedTags,
        notes,
        exercises
      };
      onImmediateChange(updatedRoutine);
    }
  }, [routineName, description, selectedTags, notes, exercises, isOpen, routine, onImmediateChange]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const renderConfig: Record<string, string> = {};
      currentMetrics.forEach((metricName, index) => {
        const key = metricKeyMap[metricName] || metricName.toLowerCase();
        renderConfig[`campo${index + 1}`] = key;
      });
      
      const formattedExercises = exercises.map(exercise => {
        const sets = exercise.sets.map(set => {
          const updatedSet: Record<string, any> = { ...set };
          exercise.metrics?.forEach(metric => {
            const key = metricKeyMap[metric.type] || metric.type.toLowerCase();
            updatedSet[key] = metric.value;
          });
          return updatedSet;
        });
        
        return {
          _id: exercise._id,
          name: exercise.name,
          notes: exercise.notes,
          sets
        };
      });
      
      const updatedRoutine = {
        _id: routine._id,
        name: routineName,
        description,
        tags: selectedTags,
        notes,
        exercises: formattedExercises,
        renderConfig
      };
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const response = await axios.put(
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/routines/routines/${routine._id}`,
        updatedRoutine,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Error al actualizar la rutina: ${response.statusText}`);
      }
      
      onSave(response.data);
      alert('Rutina actualizada correctamente');
    } catch (error: any) {
      console.error('Error al actualizar la rutina:', error);
      alert(`Error: ${error.message || 'Ha ocurrido un error al guardar la rutina'}`);
      return;
    }
    
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className={`relative w-full max-w-4xl mx-4 rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        style={{ 
          maxHeight: '90vh',
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className={`px-8 py-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} bg-gradient-to-r from-blue-600/10 to-purple-600/10`}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Editar Rutina
          </h2>
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 hover:rotate-90 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <form onSubmit={handleSave}>
            <div className="space-y-8">
              <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-xl p-6 shadow-lg border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500/50 transition-all duration-200`}>
                <BasicInformation
                  routineName={routineName}
                  setRoutineName={setRoutineName}
                  description={description}
                  setDescription={setDescription}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  notes={notes}
                  setNotes={setNotes}
                  theme={theme}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExerciseListOpen(true)}
                  className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                    } transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-purple-500/30`}
                >
                  <List className="w-5 h-5 mr-2" />
                  Abrir Listado de Ejercicios
                </button>
              </div>
              
              <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-xl shadow-lg border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500/50 transition-all duration-200`}>
                <div className="overflow-x-auto">
                  <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <thead className={`${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-50'}`}>
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Ejercicio
                          </span>
                        </th>
                        {exercises.length > 0 && exercises[0]?.metrics ? 
                          exercises[0].metrics.map((metric, index) => (
                            <th key={index} className="px-6 py-4 text-left" data-metric-index={index}>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setOpenMetricDropdown(index.toString())}
                                  className={`group inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme === 'dark' 
                                      ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                                      : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                                    } transition-all duration-200`}
                                >
                                  <span className="text-xs font-semibold uppercase tracking-wider">{metric.type}</span>
                                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openMetricDropdown === index.toString() ? 'rotate-180' : ''}`} />
                                </button>
                                {openMetricDropdown === index.toString() && (
                                  <div 
                                    className={`absolute mt-2 w-48 rounded-xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 z-[9999] max-h-64 overflow-y-auto`}
                                    style={{ top: '100%', left: '0' }}
                                  >
                                    <div className="py-2" role="menu" aria-orientation="vertical">
                                      {metricOptions.map((option) => (
                                        <button
                                          key={option}
                                          type="button"
                                          onClick={() => {
                                            handleUpdateMetric('', index, option);
                                            setOpenMetricDropdown(null);
                                          }}
                                          className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark'
                                              ? metric.type === option 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700'
                                              : metric.type === option
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            } transition-colors duration-150`}
                                          role="menuitem"
                                        >
                                          {option}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </th>
                          ))
                        : (
                          <>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Repeticiones
                              </span>
                            </th>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Peso
                              </span>
                            </th>
                            <th className="px-6 py-4 text-left">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                Descanso
                              </span>
                            </th>
                          </>
                        )}
                        <th className="px-6 py-4 text-left">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Notas
                          </span>
                        </th>
                        <th className="px-6 py-4 text-right">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            Acciones
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {exercises.map((exercise) => (
                        <tr key={exercise.id} className={`${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <input
                                type="text"
                                value={exercise.name}
                                onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                                className={`block w-full px-4 py-2 rounded-lg ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  } border focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Nombre del ejercicio"
                              />
                              {focusedExerciseId === exercise.id && suggestions.length > 0 && (
                                <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-h-60 overflow-auto`}>
                                  <ul className="py-1">
                                    {suggestions.map((suggestion) => (
                                      <li
                                        key={suggestion._id}
                                        onClick={() => selectSuggestion(exercise.id, suggestion)}
                                        className={`cursor-pointer px-4 py-2 ${theme === 'dark'
                                            ? 'hover:bg-gray-700 text-gray-200'
                                            : 'hover:bg-gray-100 text-gray-900'
                                          }`}
                                      >
                                        {suggestion.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                          {exercise.metrics?.map((metric, metricIndex) => (
                            <td key={metricIndex} className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => updateMetricValue(exercise.id, metricIndex, e.target.value)}
                                className={`block w-full px-4 py-2 rounded-lg ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                  } border focus:ring-blue-500 focus:border-blue-500`}
                                placeholder={`${metric.type}`}
                              />
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={exercise.notes}
                              onChange={(e) => {
                                const newExercises = exercises.map(ex =>
                                  ex.id === exercise.id ? { ...ex, notes: e.target.value } : ex
                                );
                                setExercises(newExercises);
                                onImmediateChange({ ...routine, exercises: newExercises });
                              }}
                              className={`block w-full px-4 py-2 rounded-lg ${theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                } border focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Notas del ejercicio"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => removeExercise(exercise.id)}
                              className={`inline-flex items-center p-2 rounded-full ${theme === 'dark'
                                  ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400'
                                  : 'bg-red-100 hover:bg-red-200 text-red-600'
                                } transition-colors duration-150`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 flex justify-center">
                  <button
                    type="button"
                    onClick={addExercise}
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                      } transition-colors duration-150`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir Ejercicio
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-3 rounded-lg ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } transition-colors duration-200`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    } transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-purple-500/30`}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {modalContent}
          <ExerciseListModal 
            isOpen={isExerciseListOpen}
            onClose={() => setIsExerciseListOpen(false)}
            onSelectExercises={handleSelectExercises}
            theme={theme}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EditRoutineModal;