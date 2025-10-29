import React from 'react';

const categorias = [
  { key: 'all', label: 'Todas' },
  { key: 'bebidas', label: 'Bebidas' },
  { key: 'postres', label: 'Postres' },
  { key: 'platos', label: 'Platos principales' },
];

const ordenamiento = [
  { key: 'reciente', label: 'Más recientes' },
  { key: 'popular', label: 'Más populares' },
  { key: 'rating', label: 'Mejor calificadas' },
];

interface FilterSelectsProps {
  selectedCategory: string;
  selectedOrder: string;
  onCategoryChange: (value: string) => void;
  onOrderChange: (value: string) => void;
}

export const FilterSelects: React.FC<FilterSelectsProps> = ({
  selectedCategory,
  selectedOrder,
  onCategoryChange,
  onOrderChange,
}) => {
  return (
    <div className="flex gap-4 items-end">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-7 px-2 bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23374151\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '16px',
          paddingRight: '22px'
        }}
      >
        <option value="" className="text-gray-700">Categorías</option>
        {categorias.map((cat) => (
          <option key={cat.key} value={cat.key}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        value={selectedOrder}
        onChange={(e) => onOrderChange(e.target.value)}
        className="h-7 px-2 bg-transparent text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none"
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23374151\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '16px',
          paddingRight: '22px'
        }}
      >
        <option value="" className="text-gray-700">Ordenar</option>
        {ordenamiento.map((orden) => (
          <option key={orden.key} value={orden.key}>
            {orden.label}
          </option>
        ))}
      </select>
    </div>
  );
};
