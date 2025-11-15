import { Search } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch?: (searchParams: any) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Búsqueda Avanzada</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ciudad, sector..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Máximo
          </label>
          <input
            type="number"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="flex items-end">
          <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}