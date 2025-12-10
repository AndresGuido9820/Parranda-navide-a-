import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  image: string;
  description: string;
  path: string;
}

/**
 * Section card component for navigation.
 */
export const SectionCard = ({
  title,
  icon: Icon,
  image,
  description,
  path,
}: SectionCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="relative group overflow-hidden rounded-2xl h-64 w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] border border-white/10 hover:border-red-500/30 shadow-xl hover:shadow-red-900/20"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex items-center justify-between">
        <div className="flex flex-col items-start max-w-[70%] z-10">
          <div className="bg-red-600/90 p-2.5 rounded-xl mb-4 backdrop-blur-sm group-hover:bg-red-500 transition-colors shadow-lg shadow-black/20">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md group-hover:text-red-100 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div className="bg-white/10 p-3 rounded-full group-hover:bg-red-600/80 transition-all duration-300 backdrop-blur-md border border-white/10 group-hover:border-red-500/50">
          <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

