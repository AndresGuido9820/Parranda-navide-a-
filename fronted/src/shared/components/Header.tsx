import React from "react";
import { useAuth } from "../../entities/auth/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

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

  return (
    <header className="bg-red-900/30 backdrop-blur-sm border-b border-red-800/50">
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

          {/* User Info & Logout */}
          {/* showUserInfo && user && */}
          {showUserInfo && true && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.full_name || "U"
                    )}&background=random`}
                    alt="User avatar"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <span className="text-white text-sm hidden lg:block">
                  {user?.full_name || user?.alias}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-white transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
