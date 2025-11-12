import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { MainLayout } from '../../../shared/layouts/MainLayout';

export const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - usando datos del usuario autenticado y complementando con mock
  const userProfile = {
    full_name: user?.full_name || "Lucía Rodríguez",
    alias: user?.alias || "@luciarodriguez",
    email: user?.email || "lucia.rodriguez@example.com",
    phone: "+57 300 123 4567",
    memberSince: "Diciembre 2024",
    favoriteRecipes: 12,
    contributions: 8,
    badges: ["El que más cookea", "Experto Cocinero", "Presencial", "Ayudante"],
    participationLevel: 75,
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userProfile.full_name
  )}&background=random&size=200`;

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header Card */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={avatarUrl}
                alt={userProfile.full_name}
                className="w-32 h-32 rounded-full border-4 border-red-300/30"
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userProfile.full_name}
                </h1>
                <p className="text-red-200 text-lg mb-4">{userProfile.alias}</p>
                <button
                  onClick={() => navigate("/my-account/edit")}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Mis Favoritos</h2>
              <button className="text-red-300 hover:text-red-200 text-sm font-medium">
                Ver Más →
              </button>
            </div>
            <div className="text-red-200 text-center py-2">
              {userProfile.favoriteRecipes} recetas guardadas
            </div>
          </div>

          {/* Contributions Section */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Mis Aportes</h2>
              <button className="text-red-300 hover:text-red-200 text-sm font-medium">
                Ver Más →
              </button>
            </div>
            <div className="text-red-200 text-center py-2">
              {userProfile.contributions} contribuciones realizadas
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Tu Progreso</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Nivel de Participación</span>
                <span className="text-red-300 font-bold">{userProfile.participationLevel}%</span>
              </div>
              <div className="w-full bg-red-900/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all"
                  style={{ width: `${userProfile.participationLevel}%` }}
                />
              </div>
              <p className="text-red-200 text-sm mt-2">¡Ya completaste {userProfile.participationLevel}%!</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Logros</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-red-800/40 text-red-200 px-4 py-2 rounded-full text-sm border border-red-700/50"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
