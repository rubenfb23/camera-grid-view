
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-3 px-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5" />
        <h1 className="text-lg font-medium">Monitor de Cámaras</h1>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
};

export default Header;
