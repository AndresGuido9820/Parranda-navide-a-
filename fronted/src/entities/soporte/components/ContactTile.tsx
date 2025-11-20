import React from 'react';

interface ContactTileProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}

export const ContactTile: React.FC<ContactTileProps> = ({ icon, title, subtitle, href }) => {
  return (
    <a
      href={href}
      className="grid grid-cols-[32px_1fr] sm:grid-cols-[36px_1fr] gap-2 sm:gap-3 items-center bg-[#140e0e] border border-white/8 rounded-xl p-2.5 sm:p-3 text-[#efe4e4] cursor-pointer hover:bg-white/4 transition-colors mb-2"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg grid place-items-center bg-[#201414] border border-white/8 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm sm:text-base">{title}</div>
        <div className="text-[#b8abab] text-xs sm:text-sm mt-0.5 break-words">{subtitle}</div>
      </div>
    </a>
  );
};
