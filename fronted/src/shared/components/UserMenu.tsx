import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  user: {
    full_name?: string | null;
    alias?: string | null;
  } | null;
  onLogout: () => void;
  avatarUrl: string;
  onCloseMobileMenu?: () => void;
}

// SVG Icons
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 12H3m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5.5V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const SupportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12a8 8 0 1116 0v5a2 2 0 01-2 2h-4v-5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12h6v5H6a2 2 0 01-2-2v-3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M5 19a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const UserMenu: React.FC<UserMenuProps> = ({ onLogout, avatarUrl, onCloseMobileMenu }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    onCloseMobileMenu?.();
    onLogout();
  };

  const handleMenuAction = (action: string) => {
    setIsOpen(false);
    onCloseMobileMenu?.();
    if (action === 'support') {
      navigate('/soporte');
    } else if (action === 'profile') {
      navigate('/my-account');
    } else if (action === 'delete') {
      if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        alert('Eliminar cuenta - Próximamente');
      }
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full cursor-pointer border border-red-500/22"
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="userMenu"
      />

      {/* Menu dropdown - Portal */}
      {isOpen && (
        <div
          ref={menuRef}
          id="userMenu"
          role="menu"
          aria-label="Menú de usuario"
          className="fixed bottom-[52px] md:bottom-[-200px] right-[18px] w-[260px] bg-[#171111] border border-red-500/22 rounded-[16px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-2 z-[9999] transition-all opacity-100"
          style={{
            transition: 'opacity 0.18s ease, transform 0.18s ease'
          }}
        >
          {/* Salir */}
          <button
            onClick={handleLogout}
            className="grid grid-cols-[22px_1fr] items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-[#efe3e3] hover:bg-white/6 outline-none transition-colors"
            role="menuitem"
          >
            <span className="grid place-items-center">
              <LogoutIcon />
            </span>
            <span>Salir</span>
          </button>

          {/* Eliminar cuenta */}
          <button
            onClick={() => handleMenuAction('delete')}
            className="grid grid-cols-[22px_1fr] items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-[#e74a3b] hover:bg-[#ff6765]/10 outline-none transition-colors"
            role="menuitem"
          >
            <span className="grid place-items-center">
              <DeleteIcon />
            </span>
            <span>Eliminar cuenta</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-white/3 via-white/8 to-white/3 my-1" aria-hidden="true"></div>

          {/* Soporte */}
          <button
            onClick={() => handleMenuAction('support')}
            className="grid grid-cols-[22px_1fr] items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-[#efe3e3] hover:bg-white/6 outline-none transition-colors"
            role="menuitem"
          >
            <span className="grid place-items-center">
              <SupportIcon />
            </span>
            <span>Soporte</span>
          </button>

          {/* Perfil */}
          <button
            onClick={() => handleMenuAction('profile')}
            className="grid grid-cols-[22px_1fr] items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-[#efe3e3] hover:bg-white/6 outline-none transition-colors"
            role="menuitem"
          >
            <span className="grid place-items-center">
              <ProfileIcon />
            </span>
            <span>Perfil</span>
          </button>
        </div>
      )}
    </>
  );
};
