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
      className="grid grid-cols-[36px_1fr] gap-3 items-center bg-[#140e0e] border border-white/8 rounded-xl p-3 text-[#efe4e4] cursor-pointer hover:bg-white/4 transition-colors mb-2"
    >
      <div className="w-9 h-9 rounded-lg grid place-items-center bg-[#201414] border border-white/8">
        {icon}
      </div>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-[#b8abab] text-sm mt-0.5">{subtitle}</div>
      </div>
    </a>
  );
};
