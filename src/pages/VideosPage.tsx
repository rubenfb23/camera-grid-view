
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { downloadedVideos } from '@/components/CamerasGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const VideosPage = () => {
  const [filterKart, setFilterKart] = useState<string>("all");
  
  // Filtrar videos según el kart seleccionado
  const filteredVideos = filterKart === "all" 
    ? downloadedVideos 
    : downloadedVideos.filter(video => 
        video.assignedKart === parseInt(filterKart) || 
        (filterKart === "unassigned" && !video.assignedKart)
      );
  
  // Formatear la fecha/hora para mejor legibilidad
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <ScrollArea className="flex-grow">
        <main className="p-3 md:p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-800">Videos Descargados</h2>
              <p className="text-sm text-gray-500">Listado de videos descargados de las cámaras</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-10">
                <ArrowLeft className="h-4 w-4" /> 
                Volver a cámaras
              </Button>
            </Link>
          </div>
          
          <div className="mb-4 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Kart:</label>
            <Select onValueChange={setFilterKart} defaultValue="all">
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Todos los Karts" />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem value="all">Todos los Karts</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i+1} value={(i+1).toString()}>
                    Kart {i+1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Cámara</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Kart Asignado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.cameraName}</TableCell>
                      <TableCell>{video.fileName}</TableCell>
                      <TableCell>{formatTimestamp(video.timestamp)}</TableCell>
                      <TableCell>
                        {video.assignedKart ? `Kart ${video.assignedKart}` : 'Sin asignar'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      No hay videos descargados{filterKart !== "all" ? " para este kart" : ""}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default VideosPage;
