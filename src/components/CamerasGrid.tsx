
import React, { useEffect, useState } from 'react';
import { CameraCard, CameraData } from './CameraCard';
import { useToast } from '@/components/ui/use-toast';

// Mock data para las cámaras
const initialCamerasData: CameraData[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Cámara ${index + 1}`,
  batteryLevel: Math.floor(Math.random() * 100),
  isCharging: Math.random() > 0.7,
  status: ['downloading', 'downloaded', 'recording', 'idle', 'error'][Math.floor(Math.random() * 5)] as CameraData['status'],
  errorMessage: Math.random() > 0.8 ? 'Conexión perdida' : undefined,
  lastUpdated: new Date(),
  previewUrl: `https://picsum.photos/seed/${index + 1}/640/360`
}));

const CamerasGrid: React.FC = () => {
  const [cameras, setCameras] = useState<CameraData[]>(initialCamerasData);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  // Simulación de WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    // Normalmente conectaríamos a un WebSocket real aquí
    // socket = new WebSocket('ws://yourserver.com/cameras');
    console.log('Conectando al WebSocket para actualizaciones de cámaras...');
    
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

            // Notificar batería baja
            if (newBatteryLevel < 20 && camera.batteryLevel >= 20) {
              toast({
                title: `Batería baja: ${camera.name}`,
                description: `Nivel de batería: ${newBatteryLevel}%`,
                variant: "destructive",
              });
            }
          }
          
          // Cambio de estado ocasional
          if (Math.random() > 0.9) {
            updates.status = ['downloading', 'downloaded', 'recording', 'idle', 'error'][Math.floor(Math.random() * 5)] as CameraData['status'];
            
            // Error aleatorio
            if (updates.status === 'error' && Math.random() > 0.5) {
              updates.errorMessage = ['Conexión perdida', 'Error de grabación', 'Almacenamiento lleno'][Math.floor(Math.random() * 3)];
              
              toast({
                title: `Error: ${camera.name}`,
                description: updates.errorMessage,
                variant: "destructive",
              });
            } else {
              updates.errorMessage = undefined;
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
      if (socket) {
        socket.close();
      }
    };
  }, [toast]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {cameras.map(camera => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
};

export default CamerasGrid;
