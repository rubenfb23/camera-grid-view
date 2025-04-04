
import React, { useState } from 'react';
import { Battery, BatteryCharging, CloudDownload, CloudOff, WifiOff, CheckCircle2, AlertTriangle, Camera, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CameraStatus = 'downloading' | 'downloaded' | 'recording' | 'idle' | 'error';

export interface CameraData {
  id: number;
  name: string;
  batteryLevel: number;
  isCharging: boolean;
  status: CameraStatus;
  downloadProgress?: number;
  errorMessage?: string;
  lastUpdated: Date;
  assignedKart?: number;
  videoTimestamp?: string;
  memoryUsed: number;
  memoryTotal: number;
}

interface CameraCardProps {
  camera: CameraData;
  onKartAssign?: (cameraId: number, kartId: number) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera, onKartAssign }) => {
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
        return camera.downloadProgress !== undefined 
          ? `Descargando - ${camera.downloadProgress}%` 
          : 'Descargando video';
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

  const getStatusBadge = (status: CameraStatus) => {
    switch (status) {
      case 'downloading':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">Descargando</Badge>;
      case 'downloaded':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">Completado</Badge>;
      case 'recording':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Grabando</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">Error</Badge>;
      case 'idle':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">Inactivo</Badge>;
      default:
        return null;
    }
  };

  const handleKartAssignment = (kartId: string) => {
    if (onKartAssign) {
      onKartAssign(camera.id, parseInt(kartId));
    }
  };

  // Format memory display
  const formatMemory = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const memoryUsagePercentage = (camera.memoryUsed / camera.memoryTotal) * 100;
  const memoryColor = memoryUsagePercentage > 90 ? "text-error" : memoryUsagePercentage > 75 ? "text-warning" : "text-success";

  return (
    <Card className="overflow-hidden flex flex-col h-full border-gray-200 shadow-sm">
      <div className="relative p-4 bg-gray-100 flex flex-col items-center justify-center aspect-video">
        <div className="absolute top-2 left-2">
          {getStatusBadge(camera.status)}
        </div>
        
        <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white">
          ID: {camera.name}
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <Camera className="h-16 w-16 text-blue-600 mb-2" />
          <div className="text-center">
            <div className="font-bold text-blue-800 text-base">RunCam 6</div>
            <div className="text-sm text-gray-600">Cámara de Acción</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {camera.isCharging ? (
              <BatteryCharging className={cn("h-6 w-6", getBatteryColor(camera.batteryLevel))} />
            ) : (
              <Battery className={cn("h-6 w-6", getBatteryColor(camera.batteryLevel))} />
            )}
            <span className={cn("text-base font-medium", getBatteryColor(camera.batteryLevel))}>
              {camera.batteryLevel}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {getStatusIcon(camera.status)}
            <span className="text-base text-gray-600">{getStatusText(camera.status)}</span>
          </div>
        </div>
        
        {camera.status === 'downloading' && camera.downloadProgress !== undefined && (
          <div className="mt-2">
            <Progress value={camera.downloadProgress} className="h-3" />
          </div>
        )}

        <div className="mt-2 flex items-center gap-2 text-base">
          <HardDrive className={`h-5 w-5 ${memoryColor}`} />
          <span className={`${memoryColor} font-medium`}>
            {formatMemory(camera.memoryUsed)}/{formatMemory(camera.memoryTotal)}
          </span>
        </div>

        <div className="mt-1">
          <Progress value={memoryUsagePercentage} className={`h-2 ${memoryUsagePercentage > 90 ? 'bg-red-200' : memoryUsagePercentage > 75 ? 'bg-amber-200' : 'bg-green-200'}`} />
        </div>

        <div className="mt-3">
          <label className="block text-base font-medium text-gray-700 mb-2">Asignar a Kart:</label>
          <Select 
            onValueChange={handleKartAssignment} 
            value={camera.assignedKart?.toString() || ""}
          >
            <SelectTrigger className="w-full h-11 text-base">
              <SelectValue placeholder="Seleccionar Kart" />
            </SelectTrigger>
            <SelectContent className="select-content">
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i+1} value={(i+1).toString()}>
                  Kart {i+1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {camera.errorMessage && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-sm text-error flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {camera.errorMessage}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
