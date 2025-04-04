
import React, { useEffect, useState, useRef } from 'react';
import { CameraCard, CameraData } from './CameraCard';
import { useToast } from '@/hooks/use-toast';

// Mock data para las cámaras
const initialCamerasData: CameraData[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Cámara ${index + 1}`,
  batteryLevel: Math.floor(Math.random() * 100),
  isCharging: Math.random() > 0.7,
  status: ['idle', 'idle', 'recording', 'idle', 'idle'][Math.floor(Math.random() * 5)] as CameraData['status'],
  downloadProgress: undefined,
  errorMessage: undefined,
  lastUpdated: new Date(),
  assignedKart: undefined,
  videoTimestamp: undefined
}));

// Lista para almacenar los videos descargados
export interface DownloadedVideo {
  id: string;
  cameraId: number;
  cameraName: string;
  timestamp: string;
  assignedKart?: number;
  fileName: string;
}

// Almacén global de videos descargados
export const downloadedVideos: DownloadedVideo[] = [];

const CamerasGrid: React.FC = () => {
  const [cameras, setCameras] = useState<CameraData[]>(initialCamerasData);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();
  
  // Referencias para mantener las notificaciones fuera del ciclo de renderizado
  const toastRef = useRef(toast);
  const camerasRef = useRef(cameras);
  
  useEffect(() => {
    camerasRef.current = cameras;
  }, [cameras]);

  // Mostrar notificación de batería baja
  const showLowBatteryNotification = (camera: CameraData) => {
    toastRef.current({
      title: `Batería baja: ${camera.name}`,
      description: `Nivel de batería: ${camera.batteryLevel}%`,
      variant: "destructive",
    });
  };
  
  // Mostrar notificación de error
  const showErrorNotification = (camera: CameraData, errorMessage: string) => {
    toastRef.current({
      title: `Error: ${camera.name}`,
      description: errorMessage,
      variant: "destructive",
    });
  };

  // Asignar un kart a una cámara específica
  const handleKartAssign = (cameraId: number, kartId: number) => {
    setCameras(prevCameras => 
      prevCameras.map(camera => {
        if (camera.id === cameraId) {
          // Actualizar el video descargado con la asignación de kart
          const matchingVideo = downloadedVideos.find(
            video => video.cameraId === cameraId && !video.assignedKart
          );
          
          if (matchingVideo) {
            matchingVideo.assignedKart = kartId;
          }
          
          // Actualizar la cámara
          return {
            ...camera,
            assignedKart: kartId
          };
        }
        return camera;
      })
    );
    
    toastRef.current({
      title: `Video asignado`,
      description: `Cámara ${cameraId} asignada al Kart ${kartId}`,
    });
  };

  // Simulación de WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    console.log('Conectando al WebSocket para actualizaciones de cámaras...');
    
    // Simular detección de nuevas cámaras ocasionalmente
    const detectNewCamerasInterval = setInterval(() => {
      const shouldSimulateNewDownload = Math.random() > 0.8;
      
      if (shouldSimulateNewDownload) {
        const randomCameraIndex = Math.floor(Math.random() * camerasRef.current.length);
        
        setCameras(prevCameras => 
          prevCameras.map((camera, index) => {
            if (index === randomCameraIndex && camera.status !== 'downloading' && camera.status !== 'error') {
              // Iniciar proceso de descarga
              toastRef.current({
                title: `Nueva descarga iniciada`,
                description: `${camera.name} ha comenzado a descargar un video`,
              });
              
              return {
                ...camera,
                status: 'downloading',
                downloadProgress: 0,
                lastUpdated: new Date()
              };
            }
            return camera;
          })
        );
      }
    }, 10000);
    
    // Simulamos actualizaciones periódicas
    const intervalId = setInterval(() => {
      setCameras(prevCameras => 
        prevCameras.map(camera => {
          // Simulamos algunos cambios aleatorios
          const updates: Partial<CameraData> = {};
          
          // Actualización de batería (pequeños cambios)
          if (Math.random() > 0.7) {
            let newBatteryLevel = camera.batteryLevel;
            if (camera.isCharging) {
              newBatteryLevel = Math.min(100, camera.batteryLevel + Math.floor(Math.random() * 3));
            } else {
              newBatteryLevel = Math.max(0, camera.batteryLevel - Math.floor(Math.random() * 2));
            }
            updates.batteryLevel = newBatteryLevel;

            // Notificar batería baja (fuera del ciclo de renderizado)
            if (newBatteryLevel < 20 && camera.batteryLevel >= 20) {
              setTimeout(() => showLowBatteryNotification(camera), 0);
            }
          }
          
          // Progreso de descarga
          if (camera.status === 'downloading' && camera.downloadProgress !== undefined) {
            const newProgress = Math.min(100, camera.downloadProgress + Math.floor(Math.random() * 10));
            updates.downloadProgress = newProgress;
            
            // Si la descarga se completa
            if (newProgress >= 100) {
              updates.status = 'downloaded';
              updates.downloadProgress = undefined;
              
              // Crear timestamp para el video
              const videoTimestamp = new Date().toISOString();
              updates.videoTimestamp = videoTimestamp;
              
              // Agregar a la lista de videos descargados
              const videoId = `video-${Date.now()}-${camera.id}`;
              downloadedVideos.push({
                id: videoId,
                cameraId: camera.id,
                cameraName: camera.name,
                timestamp: videoTimestamp,
                fileName: `video-${camera.id}-${Date.now()}.mp4`,
                assignedKart: camera.assignedKart
              });
              
              // Notificar descarga completada (fuera del ciclo de renderizado)
              setTimeout(() => {
                toastRef.current({
                  title: `Descarga completada`,
                  description: `${camera.name} ha finalizado la descarga del video`,
                });
              }, 0);
            }
          }
          
          // Cambio de estado ocasional o error
          if (Math.random() > 0.95) {
            if (camera.status !== 'downloading') {
              updates.status = ['idle', 'recording', 'error'][Math.floor(Math.random() * 3)] as CameraData['status'];
            
              // Error aleatorio
              if (updates.status === 'error' && Math.random() > 0.5) {
                updates.errorMessage = ['Conexión perdida', 'Error de grabación', 'Almacenamiento lleno'][Math.floor(Math.random() * 3)];
                
                // Notificar error (fuera del ciclo de renderizado)
                setTimeout(() => {
                  if (updates.errorMessage) {
                    showErrorNotification(camera, updates.errorMessage);
                  }
                }, 0);
              } else {
                updates.errorMessage = undefined;
              }
            }
          }
          
          return { 
            ...camera, 
            ...updates,
            lastUpdated: new Date()
          };
        })
      );
    }, 3000);

    // Limpieza al desmontar
    return () => {
      clearInterval(intervalId);
      clearInterval(detectNewCamerasInterval);
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {cameras.map(camera => (
        <CameraCard 
          key={camera.id} 
          camera={camera} 
          onKartAssign={handleKartAssign} 
        />
      ))}
    </div>
  );
};

export default CamerasGrid;
