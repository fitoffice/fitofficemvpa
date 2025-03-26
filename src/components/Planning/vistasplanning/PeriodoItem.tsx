import React, { useState, useEffect } from 'react';
import { Calendar, Edit2, Trash2, ChevronRight, ChevronLeft, Clock, Filter, Dumbbell, Plus, Search } from 'lucide-react';
import Button from './Button';
import { Exercise, Period, getWeekAndDay } from './utils/estadisticasUtils';
import { useExercise } from '../../../contexts/ExerciseContext'; // Add this import
import EditExercisePopup from '../../modals/EditExercisePopup';

interface PeriodoItemProps {
  periodo: Period;
  index: number;
  activeAccordion: number | null;
  toggleAccordion: (index: number) => void;
  handleEditPeriodName: (index: number, currentName: string) => void;
  handleSavePeriodName: () => void;
  editingPeriodIndex: number | null;
  editingPeriodName: string;
  setEditingPeriodName: (name: string) => void;
  handleApplyPeriod: (periodId: string) => void;
  handleDeletePeriod: (index: number) => void;
  handleAdjustPeriod: (periodIndex: number, isStart: boolean, increment: boolean) => void;
  handleApplyExercise: (periodId: string, exerciseId: string) => void;
  handleEditExercise: (exercise: Exercise, periodIndex: number) => void;
  searchTerm: string;
  showFilterMenu: boolean;
  handleFilterToggle: () => void;
  filters: {
    upperBody: boolean;
    lowerBody: boolean;
    core: boolean;
    cardio: boolean;
  };
  handleFilterChange: (filterName: keyof typeof filters) => void;
  filterExercises: (ejercicios: Exercise[]) => Exercise[];
  renderEjercicio: (ejercicio: Exercise) => JSX.Element | null;
}

const PeriodoItem: React.FC<PeriodoItemProps> = ({
  periodo,
  index,
  activeAccordion,
  toggleAccordion,
  handleEditPeriodName,
  handleSavePeriodName,
  editingPeriodIndex,
  editingPeriodName,
  setEditingPeriodName,
  handleApplyPeriod,
  handleDeletePeriod,
  handleAdjustPeriod,
  handleApplyExercise,
  handleEditExercise,
  searchTerm,
  showFilterMenu,
  handleFilterToggle,
  filters,
  handleFilterChange,
  filterExercises,
  renderEjercicio
}) => {
  console.log('PeriodoItem - DETAILED PROPS RECEIVED:', {
    periodoId: periodo.id,
    periodoName: periodo.name,
    planningId: periodo.planningId,
    index,
    startDate: periodo.start,
    endDate: periodo.end,
    ejerciciosCount: periodo.exercises?.length || 0,
    originalData: periodo.originalData, // Log the original data if it exists
    completePeriodsObject: periodo // Log the complete periodo object
  });
    
  console.log('PeriodoItem - DETAILED EXERCISES:', {
    exercises: periodo.exercises,
    exercisesType: periodo.exercises ? typeof periodo.exercises : 'undefined',
    isArray: Array.isArray(periodo.exercises),
    firstExercise: periodo.exercises && periodo.exercises.length > 0 ? periodo.exercises[0] : 'No exercises'
  });


  const startInfo = getWeekAndDay(periodo.start);
  const endInfo = getWeekAndDay(periodo.end);
  const ejercicios = periodo.exercises || [];
  const isActive = activeAccordion === index;
  const { openExerciseModal } = useExercise();
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchExercise, setSearchExercise] = useState('');

  
  // Add these states for the EditExercisePopup
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseRM, setExerciseRM] = useState<number | undefined>(undefined);
  const [relativeWeight, setRelativeWeight] = useState<number | undefined>(undefined);
  const [exerciseSets, setExerciseSets] = useState<Array<{
    weight: number;
    reps: number;
    rest: number;
    _id: string;
  }> | undefined>(undefined);

  useEffect(() => {
    // Solo se obtienen los ejercicios cuando el acordeón está activo
    if (isActive) {
      fetchExercises();
    }
  }, [isActive]);
  const handleEditExerciseLocal = (exercise: Exercise, periodIndex: number) => {
    console.log('PeriodoItem - Opening Edit Exercise:', {
      exercise,
      periodIndex,
      planningId: periodo.planningId,
      periodoId: periodo.id
    });
    
    // Format the exercise data if it has the nested structure
    let formattedExercise = exercise;
    
    // Extract real data from the exercise object
    if (exercise.raw && exercise.raw.ejercicio) {
      formattedExercise = {
        ...exercise,
        // Use the actual adjustment data from the exercise
        porcentaje: exercise.raw.porcentaje || exercise.porcentaje || 0,
        ajuste: exercise.raw.ajuste || exercise.ajuste || {
          tipo: 'maintain',
          unidad: 'kg',
          valor: 0
        }
      };
    }
    
    setSelectedExercise(formattedExercise);
    setIsEditExerciseOpen(true);
    
    // Use the actual exercise data for RM and sets
    // Find the exercise in the period data
    const periodExercise = periodo.exercises?.find(ex => {
      if (typeof ex === 'string') return ex === exercise.id;
      if (ex.ejercicio && ex.ejercicio._id) return ex.ejercicio._id === exercise.id;
      return ex.id === exercise.id;
    });
    
    // Extract real values from the period exercise data
    if (periodExercise && typeof periodExercise !== 'string') {
      // Set real RM value if available
      setExerciseRM(periodExercise.rm || periodExercise.ejercicio?.rm || 0);
      
      // Set real relative weight if available
      setRelativeWeight(periodExercise.porcentaje || 0);
      
      // Set real sets if available
      if (periodExercise.series && Array.isArray(periodExercise.series)) {
        setExerciseSets(periodExercise.series);
      } else if (periodExercise.ejercicio?.series && Array.isArray(periodExercise.ejercicio.series)) {
        setExerciseSets(periodExercise.ejercicio.series);
      } else {
        // If no sets data is available, create a default set
        setExerciseSets([
          { 
            weight: (periodExercise.rm || 0) * (periodExercise.porcentaje || 0) / 100, 
            reps: 10, 
            rest: 60, 
            _id: '1' 
          }
        ]);
      }
    } else {
      // Fallback to reasonable defaults if no data is available
      setExerciseRM(0);
      setRelativeWeight(formattedExercise.porcentaje || 0);
      setExerciseSets([{ weight: 0, reps: 10, rest: 60, _id: '1' }]);
    }
    
    console.log('PeriodoItem - Exercise data prepared for editing:', {
      formattedExercise,
      rm: exerciseRM,
      relativeWeight,
      sets: exerciseSets
    });
  };
  const handleSaveExercise = async (updatedExercise: any) => {
    console.log('PeriodoItem - Saving edited exercise:', updatedExercise);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Prepare the data to send to the API
      const exerciseData = {
        ejercicioId: updatedExercise.id,
        porcentaje: updatedExercise.porcentaje || 0,
        ajuste: updatedExercise.ajuste || {
          tipo: 'maintain',
          unidad: 'kg',
          valor: 0
        }
      };
      
      // API endpoint for updating exercise in a period
      const apiUrl = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${periodo.planningId}/periodos/${periodo.id}/ejercicios/${updatedExercise.id}`;
      
      console.log('PeriodoItem - Sending update request to:', apiUrl);
      console.log('PeriodoItem - Request data:', exerciseData);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(exerciseData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al actualizar ejercicio: ${response.status}`);
      }
      
      // Close the popup and refresh data if needed
      setIsEditExerciseOpen(false);
      
      // You might want to refresh the period data here
      // For now, we'll just update the local state
      if (isActive) {
        fetchExercises();
      }
      
      // Show success message
      alert('Ejercicio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar ejercicio:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al actualizar ejercicio');
    }
  };

  // Add this function to handle exercise click
  const handleEjercicioClick = (ejercicio: Exercise) => {
    console.log('DEBUGGING - handleEjercicioClick called with:', {
      ejercicioId: ejercicio.id,
      ejercicioNombre: ejercicio.nombre,
      periodId: periodo.id,
      planningId: periodo.planningId || '',
      periodIndex: index,
      // Log the complete exercise object to verify adjustment data
      completeExercise: ejercicio
    });
    
    // Pass all parameters at once
    try {
      openExerciseModal(
        ejercicio,
        periodo.id,
        periodo.planningId || '',
        index
      );
      console.log('DEBUGGING - openExerciseModal called successfully');
    } catch (error) {
      console.error('DEBUGGING - Error calling openExerciseModal:', error);
    }
  };
 // Add this function to render exercise with click handler
  const getFullExerciseDetails = (ejercicioId: string): Exercise | undefined => {
    return availableExercises.find(exercise => exercise.id === ejercicioId);
  };


  const renderEjercicioWithClick = (ejercicio: any) => {
    // Check if ejercicio is an ID string or has an 'ejercicio' property (from period data)
    let fullExercise: Exercise | undefined;
    
    if (typeof ejercicio === 'string') {
      fullExercise = getFullExerciseDetails(ejercicio);
    } else if (ejercicio.ejercicio && ejercicio.ejercicio._id) {
      // This is the case for exercises from the period with the API structure
      fullExercise = {
        id: ejercicio.ejercicio._id,
        nombre: ejercicio.ejercicio.nombre,
        ejercicioId: ejercicio.ejercicio._id,
        detalles: {
          descripcion: ejercicio.ejercicio.descripcion,
          grupoMuscular: ejercicio.ejercicio.grupoMuscular || [],
          equipo: ejercicio.ejercicio.equipo || []
        },
        // Include the adjustment and percentage data
        porcentaje: ejercicio.porcentaje,
        ajuste: ejercicio.ajuste,
        // Keep the original data for reference
        raw: ejercicio
      };
    } else if (ejercicio.id) {
      fullExercise = ejercicio;
    }
    
    if (!fullExercise) {
      console.log('Exercise not found:', ejercicio);
      return null;
    }
    
    const renderedEjercicio = renderEjercicio(fullExercise);
    if (!renderedEjercicio) return null;
    
    return (
      <div onClick={() => handleEjercicioClick(fullExercise!)}>
        {renderedEjercicio}
      </div>
    );
  };
  const filteredExercises = availableExercises.filter(ejercicio => 
    ejercicio.nombre.toLowerCase().includes(searchExercise.toLowerCase()) ||
    ejercicio.detalles?.descripcion?.toLowerCase().includes(searchExercise.toLowerCase()) ||
    ejercicio.detalles?.grupoMuscular?.some(grupo => 
      grupo.toLowerCase().includes(searchExercise.toLowerCase())
    )
  );

  const fetchExercises = async () => {
    console.log('PeriodoItem - Iniciando petición para obtener ejercicios...');
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      console.log('PeriodoItem - Token recuperado:', token ? 'Token encontrado' : 'Token no encontrado');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      console.log('PeriodoItem - Enviando petición a https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('PeriodoItem - Respuesta recibida, status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('PeriodoItem - Error en la respuesta:', errorData);
        throw new Error(errorData.mensaje || `Error al obtener ejercicios: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('PeriodoItem - Datos recibidos:', responseData);
      
      // Se extraen los ejercicios desde la propiedad "data" de la respuesta
      const exercisesArray = responseData.data || [];
      
      // Se formatea la data para que coincida con la interfaz Exercise
      const formattedExercises = exercisesArray.map((item: any) => ({
        id: item._id,
        ejercicioId: item._id,
        nombre: item.nombre,
        detalles: {
          descripcion: item.descripcion,
          grupoMuscular: item.grupoMuscular,
          equipo: item.equipo
        }
      }));
      
      console.log('PeriodoItem - Ejercicios procesados:', formattedExercises.length);
      
      setAvailableExercises(formattedExercises);
    } catch (err) {
      console.error('PeriodoItem - Error al cargar los ejercicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
      console.log('PeriodoItem - Finalizada petición de ejercicios');
    }
  };
  const filterAvailableExercises = () => {
    // Get all exercise IDs that are already in the period
    const existingExerciseIds = ejercicios.map(ejercicio => {
      // Handle different exercise data structures
      if (typeof ejercicio === 'string') {
        return ejercicio;
      } else if (ejercicio.ejercicio && ejercicio.ejercicio._id) {
        return ejercicio.ejercicio._id;
      } else if (ejercicio.ejercicio) {
        return ejercicio.ejercicio;
      } else {
        return ejercicio.id;
      }
    });
    
    console.log('Existing exercise IDs in period:', existingExerciseIds);
    
    // Filter out exercises that are already in the period
    return availableExercises.filter(ejercicio => {
      const isIncluded = existingExerciseIds.includes(ejercicio.id);
      console.log(`Exercise ${ejercicio.nombre} (${ejercicio.id}) included in period? ${isIncluded}`);
      return !isIncluded;
    });
  };

  const formatPeriodExercises = () => {
    return ejercicios.map(ejercicio => {
      if (typeof ejercicio === 'string') {
        return availableExercises.find(e => e.id === ejercicio) || { id: ejercicio, nombre: 'Ejercicio desconocido' };
      } else if (ejercicio.ejercicio && ejercicio.ejercicio._id) {
        // Format from the API structure
        console.log('Formatting exercise with adjustment data:', ejercicio);
        return {
          id: ejercicio.ejercicio._id,
          nombre: ejercicio.ejercicio.nombre,
          ejercicioId: ejercicio.ejercicio._id,
          detalles: {
            descripcion: ejercicio.ejercicio.descripcion,
            grupoMuscular: ejercicio.ejercicio.grupoMuscular || [],
            equipo: ejercicio.ejercicio.equipo || []
          },
          // Include the adjustment and percentage data
          porcentaje: ejercicio.porcentaje || 0,
          ajuste: ejercicio.ajuste || {
            tipo: 'maintain',
            unidad: 'kg',
            valor: 0
          },
          // Keep the original data for reference
          raw: ejercicio
        };
      } else {
        return ejercicio;
      }
    });
  };
  
  return (
    <div className={`p-6 mb-6 bg-white rounded-xl shadow-lg border border-indigo-100 transition-all duration-300 
      ${isActive ? 'ring-2 ring-indigo-300 transform scale-[1.01]' : 'hover:shadow-md hover:border-indigo-200'}`}>
      
      {/* Sección de cabecera */}
      <div 
        className="flex items-center justify-between mb-5 cursor-pointer group"
        onClick={() => toggleAccordion(index)}
      >
        <div className="flex items-center gap-3">
          {editingPeriodIndex === index ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingPeriodName}
                onChange={(e) => setEditingPeriodName(e.target.value)}
                className="border border-indigo-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSavePeriodName();
                }}
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPeriodName(-1, '');
                }}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{periodo.name}</h3>
            </>
          )}
        </div>
        <div className="flex gap-2">
        <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Send request with planning and period data
              const sendPeriodRequest = async () => {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                  }
                  
                  // Use the correct API endpoint format
                  const apiUrl = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${periodo.planningId}/periodos/${periodo.id}/aplicar-completo`;
                  console.log('Enviando petición a:', apiUrl);
                  
                  const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensaje || `Error al aplicar periodo: ${response.status}`);
                  }
                  
                  // Call the original handler after successful request
                  handleApplyPeriod(periodo.id);
                  
                  // Show success message
                  alert('Periodo aplicado correctamente');
                } catch (error) {
                  console.error('Error al aplicar periodo:', error);
                  alert(error instanceof Error ? error.message : 'Error desconocido al aplicar periodo');
                }
              };
              
              sendPeriodRequest();
            }}
            className="flex items-center gap-1"
          >
            <Calendar className="w-4 h-4" />
            Aplicar Periodo
          </Button>
          {editingPeriodIndex !== index && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditPeriodName(index, periodo.name);
              }}
              className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePeriod(index);
            }}
            className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
            <ChevronRight className={`w-5 h-5 text-gray-600 transform ${isActive ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdjustPeriod(index, true, false)}
            className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Semana {startInfo.week} día {startInfo.day}</span>
          </div>
          <button
            onClick={() => handleAdjustPeriod(index, true, true)}
            className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <span className="text-gray-500">a</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdjustPeriod(index, false, false)}
            className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Semana {endInfo.week} día {endInfo.day}</span>
          </div>
          <button
            onClick={() => handleAdjustPeriod(index, false, true)}
            className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-5 transition-all duration-500 animate-fadeIn">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-indigo-600"></div>
              <span className="ml-3 text-indigo-600 font-medium">Cargando ejercicios...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg mb-5 shadow-sm">
              <p className="font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Error al cargar ejercicios
              </p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchExercises();
                }}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reintentar
              </button>
            </div>
          )}
                {isEditExerciseOpen && selectedExercise && (
        <EditExercisePopup
          open={isEditExerciseOpen}
          onClose={() => setIsEditExerciseOpen(false)}
          exercise={selectedExercise}
          onSave={handleSaveExercise}
          periodIndex={index}
          rm={exerciseRM}
          relativeWeight={relativeWeight}
          sets={exerciseSets}
          planningId={periodo.planningId || ''}
          periodoId={periodo.id || ''}
        />
      )}

          {!loading && !error && ejercicios.length > 0 ? (
            <div>
              <div className="flex gap-3 mb-5 items-center">
                <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex items-center p-2 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-300">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setEditingPeriodName(e.target.value)}
                    placeholder="Buscar ejercicios..."
                    className="w-full border-none focus:outline-none text-gray-700"
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="exportar"
                    onClick={handleFilterToggle}
                    className="flex items-center gap-2 shadow-sm hover:shadow transition-shadow"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                  </Button>
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Filter className="w-4 h-4 text-indigo-600" />
                          Grupos Musculares
                        </h4>
                      </div>
                      <div className="p-3">
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.upperBody}
                            onChange={() => handleFilterChange('upperBody')}
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="text-sm font-medium">Tren Superior</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.lowerBody}
                            onChange={() => handleFilterChange('lowerBody')}
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="text-sm font-medium">Tren Inferior</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.core}
                            onChange={() => handleFilterChange('core')}
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="text-sm font-medium">Core</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.cardio}
                            onChange={() => handleFilterChange('cardio')}
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="text-sm font-medium">Cardio</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Mostrar ejercicios del periodo */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Dumbbell className="w-5 h-5 text-indigo-600" />
                  Ejercicios en este periodo
                </h4>
                <div className="space-y-3">
          {filterExercises(formatPeriodExercises()).map((ejercicio) => (
            <div key={ejercicio.id} className="transform transition-transform hover:scale-[1.01]">
              <div className="relative">
                {renderEjercicioWithClick(ejercicio)}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Use our local edit function instead of the prop
                      handleEditExerciseLocal(ejercicio, index);
                    }}
                    className="text-xs bg-white"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Send request to apply this specific exercise
                              const applyExerciseRequest = async () => {
                                try {
                                  const token = localStorage.getItem('token');
                                  if (!token) {
                                    throw new Error('No se encontró el token de autenticación');
                                  }
                                  
                                  const apiUrl = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${periodo.planningId}/periodos/${periodo.id}/aplicar/${ejercicio.id}/`;
                                  console.log('Enviando petición a:', apiUrl);
                                  
                                  const response = await fetch(apiUrl, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    }
                                  });
                                  
                                  if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.mensaje || `Error al aplicar ejercicio: ${response.status}`);
                                  }
                                  
                                  // Call the original handler
                                  handleApplyExercise(periodo.id, ejercicio.id);
                                  
                                  // Show success message
                                  alert('Ejercicio aplicado correctamente');
                                } catch (error) {
                                  console.error('Error al aplicar ejercicio:', error);
                                  alert(error instanceof Error ? error.message : 'Error desconocido al aplicar ejercicio');
                                }
                              };
                              
                              applyExerciseRequest();
                            }}
                            className="text-xs"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>              </div>
              {/* Mostrar ejercicios disponibles desde la API */}
              {availableExercises.length > 0 && (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
        <Dumbbell className="w-5 h-5 text-indigo-600" />
        Ejercicios disponibles
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filterAvailableExercises().map((ejercicio) => (
          <div 
            key={ejercicio.id} 
            className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer group"                                      onClick={() => {
                                        console.log('DEBUGGING - Available exercise clicked:', {
                                          ejercicioId: ejercicio.id,
                                          ejercicioNombre: ejercicio.nombre,
                                          periodoId: periodo.id
                                        });
                                        
                                        // First add the exercise to the period
                                        console.log('PeriodoItem - Añadiendo ejercicio al periodo:', ejercicio);
                                        handleApplyExercise(periodo.id, ejercicio.id);
                                        
                                        // Then open the edit modal for the exercise
                                        handleEditExercise(ejercicio, index);
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                            <Dumbbell className="w-5 h-5" />
                                          </div>
                                          <span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                            {ejercicio.nombre || 'Ejercicio sin nombre'}
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditExercise(ejercicio, index);
                                            }}
                                            className="text-xs bg-white"
                                          >
                                            <Edit2 className="w-3 h-3 mr-1" />
                                            Editar
                                          </Button>
                                          <button className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Plus className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </div>
                                      {ejercicio.detalles?.grupoMuscular && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {ejercicio.detalles.grupoMuscular.map((grupo, idx) => (
                                            <span 
                                              key={idx} 
                                              className="px-2 py-1 bg-white text-xs font-medium text-indigo-700 rounded-full shadow-sm"
                                            >
                                              {grupo}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {ejercicio.detalles?.descripcion && (
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                          {ejercicio.detalles.descripcion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
              )}
            </div>
          ) : (
            <div className="py-8">
              <div className="text-center">
                {availableExercises.length > 0 ? (
                  <div className="mt-6">
                                        <div className="mb-4 flex items-center gap-3">
                      <div className="flex-1 relative">
                      <input
        type="text"
        placeholder="Buscar ejercicios..."
        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={searchExercise}
        onChange={(e) => setSearchExercise(e.target.value)}
      />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      <Button
                        variant="exportar"
                        onClick={handleFilterToggle}
                        className="flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Filtros
                      </Button>
                    </div>

                    <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-center gap-2">
                      <Dumbbell className="w-5 h-5 text-indigo-600" />
                      Ejercicios disponibles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {filteredExercises.map((ejercicio) => (
                        <div 
                          key={ejercicio.id} 
                          className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                          onClick={() => {
                            console.log('PeriodoItem - Añadiendo ejercicio al periodo:', ejercicio);
                            handleApplyExercise(periodo.id, ejercicio.id);
                            handleEjercicioClick(ejercicio);
                          }}
                        >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                <Dumbbell className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                {ejercicio.nombre || 'Ejercicio sin nombre'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Send request to apply this specific exercise
                                  const applyExerciseRequest = async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      if (!token) {
                                        throw new Error('No se encontró el token de autenticación');
                                      }
                                      
                                      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planning/apply-exercise', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({
                                          planningId: periodo.planningId,
                                          periodId: periodo.id,
                                          exerciseId: ejercicio.id
                                        })
                                      });
                                      
                                      if (!response.ok) {
                                        const errorData = await response.json();
                                        throw new Error(errorData.mensaje || `Error al aplicar ejercicio: ${response.status}`);
                                      }
                                      
                                      alert('Ejercicio aplicado correctamente');
                                    } catch (error) {
                                      console.error('Error al aplicar ejercicio:', error);
                                      alert(error instanceof Error ? error.message : 'Error desconocido al aplicar ejercicio');
                                    }
                                  };
                                  
                                  applyExerciseRequest();
                                }}
                                className="text-xs"
                              >
                                Aplicar
                              </Button>
                              <button className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          {ejercicio.detalles?.grupoMuscular && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {ejercicio.detalles.grupoMuscular.map((grupo, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-white text-xs font-medium text-indigo-700 rounded-full shadow-sm"
                                >
                                  {grupo}
                                </span>
                              ))}
                            </div>
                          )}
                          {ejercicio.detalles?.descripcion && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {ejercicio.detalles.descripcion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>                    
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchExercises();
                    }}
                    className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <Dumbbell className="w-5 h-5" />
                    Cargar ejercicios disponibles
                  </button>
                )}
              </div>
              
            </div>
            
          )}
        </div>
      
      )}
    </div>
    

  );};



export default PeriodoItem;
