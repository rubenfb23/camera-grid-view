
import React from 'react';
import { Battery, BatteryCharging, CloudDownload, CloudOff, WifiOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CameraStatus = 'downloading' | 'downloaded' | 'recording' | 'idle' | 'error';

export interface CameraData {
  id: number;
  name: string;
  batteryLevel: number;
  isCharging: boolean;
  status: CameraStatus;
  errorMessage?: string;
  lastUpdated: Date;
  previewUrl: string;
}

interface CameraCardProps {
  camera: CameraData;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  const getBatteryColor = (level: number) => {
    if (level < 20) return 'text-error';
    if (level < 50) return 'text-warning';
    return 'text-success';
  };

  const getStatusIcon = (status: CameraStatus) => {
    switch (status) {
      case 'downloading':
        return <CloudDownload className="h-5 w-5 text-blue-500 animate-pulse-download" />;
      case 'downloaded':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'recording':
        return <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-error" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: CameraStatus) => {
    switch (status) {
      case 'downloading':
        return 'Descargando video';
      case 'downloaded':
        return 'Video descargado';
      case 'recording':
        return 'Grabando';
      case 'idle':
        return 'Inactivo';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border-gray-200 shadow-sm">
      <div className="relative">
        {camera.previewUrl ? (
          <img
            src={camera.previewUrl}
            alt={`Cámara ${camera.name}`}
            className="w-full aspect-video object-cover bg-gray-800"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-gray-500" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white">
          {camera.name}
        </div>
      </div>

      <div className="p-3 flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {camera.isCharging ? (
              <BatteryCharging className={cn("h-5 w-5", getBatteryColor(camera.batteryLevel))} />
            ) : (
              <Battery className={cn("h-5 w-5", getBatteryColor(camera.batteryLevel))} />
            )}
            <span className={cn("text-sm font-medium", getBatteryColor(camera.batteryLevel))}>
              {camera.batteryLevel}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {getStatusIcon(camera.status)}
            <span className="text-sm text-gray-600">{getStatusText(camera.status)}</span>
          </div>
        </div>
        
        {camera.errorMessage && (
          <div className="mt-1 p-1.5 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-xs text-error flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              {camera.errorMessage}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
