
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import CamerasGrid from '@/components/CamerasGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Bloquear el zoom en dispositivos táctiles para mejorar la experiencia en tablets
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    return () => {
      // Restaurar cuando el componente se desmonte
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ScrollArea className="flex-grow">
        <main className={`p-3 ${isMobile ? 'p-2' : 'md:p-4 lg:p-6'}`}>
          <div className="mb-3 md:mb-4">
            <h2 className="text-lg font-medium text-gray-800">Estado de Cámaras</h2>
            <p className="text-sm text-gray-500">Monitoreo de 10 cámaras conectadas</p>
          </div>
          <CamerasGrid />
        </main>
      </ScrollArea>
    </div>
  );
};

export default Index;
