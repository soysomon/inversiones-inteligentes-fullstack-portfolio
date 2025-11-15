import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/admin/Navbar';
import PropertyForm from '../../../components/admin/PropertyForm';

export default function CrearPropiedadPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/propiedades');
  };

  return (
    <div>
      <Navbar title="Nueva Propiedad" />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Propiedad</h2>
          <PropertyForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}