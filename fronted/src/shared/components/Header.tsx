import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../entities/auth";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  showUserInfo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showUserInfo = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleLogoClick = () => {
    navigate("/inicio");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
    <>
      <header className="bg-red-900/30 backdrop-blur-sm border-b border-red-800/50 z-50 relative">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Button - Left */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-red-800/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Logo - Hidden on mobile */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <span className="text-2xl">🎄</span>
              <h1 className="text-xl font-bold text-white">Navidad Mágica</h1>
            </div>

            {/* Desktop Navigation */}
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

            {/* Desktop User Info */}
            {showUserInfo && (
              <div className="hidden md:flex items-center gap-3">
                <UserMenu
                  user={user}
                  onLogout={handleLogout}
                  avatarUrl={avatarUrl}
                  onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />
              </div>
            )}

            {/* Mobile User Avatar - Right */}
            {showUserInfo && user && (
              <div className="md:hidden flex items-center gap-2">
                <img
                  src={avatarUrl}
                  alt={user.full_name || 'Usuario'}
                  className="w-9 h-9 rounded-full border-2 border-red-300/30"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[100] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-red-950/95 backdrop-blur-md z-[101] md:hidden shadow-2xl border-r border-red-800/50">
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-red-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎄</span>
                  <h2 className="text-lg font-bold text-white">Navidad Mágica</h2>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white p-2 hover:bg-red-800/50 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="block w-full text-left text-white hover:text-red-300 hover:bg-red-800/30 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* User Info Footer */}
              {showUserInfo && (
                <div className="border-t border-red-800/50 p-4 space-y-3">
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    avatarUrl={avatarUrl}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
