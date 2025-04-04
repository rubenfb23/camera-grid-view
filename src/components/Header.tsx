
import React from 'react';
import { Camera, Download } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-3 px-4 border-b border-gray-200 bg-white flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-blue-600" />
        <h1 className="text-lg font-medium">Monitor de Cámaras</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm">
          <Download className="h-4 w-4 text-blue-600" />
          <span className="text-gray-600">Videos descargados</span>
        </div>
        <div className="text-sm text-gray-500">
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
