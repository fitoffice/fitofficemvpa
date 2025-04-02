import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Contrato {
  _id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Finalizado' | 'Cancelado' | 'Pendiente';
  trainer?: string;
  cliente?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    contracts: Contrato[];
  };
}

interface ContratosContextType {
  contratos: Contrato[];
  isLoading: boolean;
  error: string | null;
  fetchContratos: () => Promise<void>;
  addContrato: (contrato: Omit<Contrato, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContrato: (id: string, contrato: Partial<Contrato>) => Promise<void>;
  deleteContrato: (id: string) => Promise<void>;
}

const ContratosContext = createContext<ContratosContextType | undefined>(undefined);

export const useContratos = () => {
  const context = useContext(ContratosContext);
  if (!context) {
    throw new Error('useContratos must be used within a ContratosProvider');
  }
  return context;
};

interface ContratosProviderProps {
  children: ReactNode;
}

export const ContratosProvider: React.FC<ContratosProviderProps> = ({ children }) => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContratos = async () => {
    try {
      setIsLoading(true);
      console.log('Iniciando la obtención de contratos desde el contexto...');
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        setError('No se encontró token de autenticación');
        setContratos([]);
        return;
      }
      
      const response = await axios.get<ApiResponse>(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // Add timeout to prevent hanging requests
        }
      );
      
      console.log('Respuesta de la API (contexto):', response.data);
      const contratosData = response.data.data.contracts || [];
      console.log('Contratos obtenidos (contexto):', contratosData.length);
      setContratos(contratosData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener contratos (contexto):', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error (contexto):', error.response?.data);
        console.error('Estado HTTP (contexto):', error.response?.status);
        
        if (error.response?.status === 500) {
          setError('Error del servidor. Por favor, contacte al administrador.');
        } else if (error.code === 'ECONNABORTED') {
          setError('La solicitud ha excedido el tiempo de espera. Intente nuevamente.');
        } else if (!error.response) {
          setError('No se pudo conectar al servidor. Verifique su conexión a internet.');
        } else {
          setError(`Error: ${error.response?.data?.message || error.message}`);
        }
      } else {
        setError('Error desconocido al obtener contratos');
      }
      setContratos([]);
    } finally {
      setIsLoading(false);
      console.log('Proceso de obtención de contratos finalizado (contexto)');
    }
  };

  const addContrato = async (contrato: Omit<Contrato, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }
      
      // Log the contract data being sent to help debug
      console.log('Enviando datos de contrato:', JSON.stringify(contrato, null, 2));
      
      const response = await axios.post(
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts',
        contrato,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Increase timeout for potentially slow server response
          timeout: 30000,
        }
      );
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.status === 'success') {
        // Refetch all contracts to ensure we have the latest data
        await fetchContratos();
      } else {
        setError('Error al crear el contrato');
      }
    } catch (error: any) {
      console.error('Error al añadir contrato:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Detalles completos del error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        if (error.code === 'ERR_BAD_RESPONSE') {
          setError('Error de comunicación con el servidor. Verifique que el servidor esté funcionando correctamente.');
        } else if (error.response?.status === 500) {
          setError('Error interno del servidor. Por favor, contacte al administrador.');
        } else if (error.code === 'ECONNABORTED') {
          setError('La solicitud ha excedido el tiempo de espera. El servidor puede estar sobrecargado.');
        } else if (!error.response) {
          setError('No se pudo conectar al servidor. Verifique su conexión a internet.');
        } else {
          setError(error.response?.data?.message || 'Error al crear el contrato');
        }
      } else {
        setError('Error desconocido al crear el contrato');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateContrato = async (id: string, contrato: Partial<Contrato>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts/${id}`,
        contrato,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Refetch all contracts to ensure we have the latest data
        await fetchContratos();
      } else {
        setError('Error al actualizar el contrato');
      }
    } catch (error: any) {
      console.error('Error al actualizar contrato:', error);
      setError(error.response?.data?.message || 'Error al actualizar el contrato');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContrato = async (id: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Update local state to remove the deleted contract
        setContratos(prevContratos => prevContratos.filter(contrato => contrato._id !== id));
      } else {
        setError('Error al eliminar el contrato');
      }
    } catch (error: any) {
      console.error('Error al eliminar contrato:', error);
      setError(error.response?.data?.message || 'Error al eliminar el contrato');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contracts when the component mounts
  useEffect(() => {
    fetchContratos();
  }, []);

  return (
    <ContratosContext.Provider
      value={{
        contratos,
        isLoading,
        error,
        fetchContratos,
        addContrato,
        updateContrato,
        deleteContrato
      }}
    >
      {children}
    </ContratosContext.Provider>
  );
};
