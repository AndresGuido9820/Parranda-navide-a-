import React from 'react';
import { Select, SelectItem } from '@heroui/react';

const categorias = [
  { key: 'all', label: 'Todas' },
  { key: 'bebidas', label: 'Bebidas' },
  { key: 'postres', label: 'Postres' },
  { key: 'platos', label: 'Platos principales' },
];

const ordenamiento = [
  { key: 'reciente', label: 'Más recientes' },
  { key: 'nombre', label: 'Por nombre' },
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
      <Select
        selectedKeys={selectedCategory ? [selectedCategory] : []}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          onCategoryChange(value || '');
        }}
        placeholder="Categorías"
        size="sm"
        className="min-w-[140px]"
        classNames={{
          trigger: 'bg-gray-500/30 hover:bg-gray-500/40 border-0 text-white',
          value: 'text-white text-sm font-medium',
          popoverContent: 'bg-gray-700',
          selectorIcon: 'hidden',
        }}
        listboxProps={{
          itemClasses: {
            base: 'text-white data-[hover=true]:bg-gray-600',
          },
        }}
      >
        {categorias.map((cat) => (
          <SelectItem key={cat.key} value={cat.key} textValue={cat.label}>
            {cat.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        selectedKeys={selectedOrder ? [selectedOrder] : []}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0] as string;
          onOrderChange(value || '');
        }}
        placeholder="Ordenar"
        size="sm"
        className="min-w-[140px]"
        classNames={{
          trigger: 'bg-gray-500/30 hover:bg-gray-500/40 border-0 text-white',
          value: 'text-white text-sm font-medium',
          popoverContent: 'bg-gray-700',
          selectorIcon: 'hidden',
        }}
        listboxProps={{
          itemClasses: {
            base: 'text-white data-[hover=true]:bg-gray-600',
          },
        }}
      >
        {ordenamiento.map((orden) => (
          <SelectItem key={orden.key} value={orden.key} textValue={orden.label}>
            {orden.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
