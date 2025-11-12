import React from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  participants: string;
  age: string;
}

interface ActivityCardProps {
  activity: Activity;
  onTryActivity: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onTryActivity,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-colors">
      <div className="relative h-64 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">{activity.title}</h3>
        <p className="text-white/70 text-sm mb-4">{activity.description}</p>
        
        <div className="flex items-center gap-4 mb-6 text-white/60 text-sm">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">groups</span>
            <span>{activity.participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">child_care</span>
            <span>{activity.age} años</span>
          </div>
        </div>
        
        <button
          onClick={onTryActivity}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined">play_arrow</span>
          Probar dinámica
        </button>
      </div>
    </div>
  );
};
