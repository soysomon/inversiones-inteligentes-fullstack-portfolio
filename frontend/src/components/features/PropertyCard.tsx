interface Property {
    id: string;
    code: string;
    title: string;
    location: string;
    price: { amount: number; currency: string; type: string };
    image: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
    featured: boolean;
    status: string;
    propertyType: string;
    city: string;
    sector: string;
    description: string;
    amenities: string[];
    images: string[];
  }
  
  interface PropertyCardProps {
    property: Property;
    viewMode: 'grid' | 'list';
  }
  
  export default function PropertyCard({ property, viewMode }: PropertyCardProps) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full h-48'}`}>
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-2">{property.location}</p>
          <p className="text-xl font-bold text-primary mb-2">
            {property.price.currency} {property.price.amount.toLocaleString()}
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>{property.bedrooms} hab</span>
            <span>{property.bathrooms} baños</span>
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    );
  }