import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../entities/auth";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  showUserInfo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showUserInfo = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleLogoClick = () => {
    navigate("/inicio");
  };

  const navItems = [
    { label: "Inicio", path: "/inicio" },
    { label: "Novenas", path: "/novenas" },
    { label: "Recetas", path: "/recetas" },
    { label: "Música", path: "/musica" },
    { label: "Dinámicas navideñas", path: "/dinamicas" },
  ];

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.full_name || "U"
  )}&background=random`;

  return (
    <header className="bg-red-900/30 backdrop-blur-sm border-b border-red-800/50 z-50 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <span className="text-2xl">🎄</span>
            <h1 className="text-xl font-bold text-white">Navidad Mágica</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-white hover:text-red-300 transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Info */}
          {showUserInfo && true && (
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 17H9m7-1V9a4 4 0 10-8 0v7l-2 2h12l-2-2z" stroke="#e9dede" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 19a2 2 0 004 0" stroke="#e9dede" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
              <UserMenu
                user={user}
                onLogout={handleLogout}
                avatarUrl={avatarUrl}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
