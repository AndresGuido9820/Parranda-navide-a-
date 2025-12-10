import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../shared/components/skeletons/Skeleton';
import { useProfile } from '../hooks/useProfile';
import { useNovenaProgress } from '../../novenas/hooks/useNovenaProgress';

export const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: novenaProgress } = useNovenaProgress();

  const userProfile = profile || user;
  
  const completedNovenas = novenaProgress?.completed_count ?? 0;
  const participationLevel = Math.round((completedNovenas / 9) * 100);

  // Helper to get avatar URL with cache busting based on updated_at
  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userProfile?.full_name || userProfile?.email || 'User'
      )}&background=dc2626&color=fff&size=200`;
    }
    // Add cache busting parameter using updated_at timestamp
    // This ensures the browser refreshes when the profile is updated
    const cacheBust = userProfile?.updated_at 
      ? new Date(userProfile.updated_at).getTime() 
      : Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${cacheBust}`;
  };

  const avatarUrl = getAvatarUrl(userProfile?.avatar_url);

  const memberSince = userProfile?.created_at 
    ? new Date(userProfile.created_at).toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Diciembre 2024';

  const badges = React.useMemo(() => {
    const result: string[] = [];
    if (completedNovenas >= 9) result.push('Novena Completa 🌟');
    if (completedNovenas >= 5) result.push('Devoto');
    if (completedNovenas >= 1) result.push('Iniciado');
    if (result.length === 0) result.push('Nuevo miembro');
    return result;
  }, [completedNovenas]);

  if (isLoadingProfile) {
    return (
      <MainLayout>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Profile Header Skeleton */}
            <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Skeleton variant="circular" width={128} height={128} />
                <div className="flex-1 text-center md:text-left space-y-3">
                  <Skeleton variant="text" height={36} width="60%" />
                  <Skeleton variant="text" height={24} width="40%" />
                  <Skeleton variant="rounded" height={44} width={140} />
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
                <Skeleton variant="text" height={24} width="50%" className="mb-4" />
                <Skeleton variant="text" height={20} width="70%" />
              </div>
              <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
                <Skeleton variant="text" height={24} width="50%" className="mb-4" />
                <Skeleton variant="text" height={20} width="70%" />
              </div>
            </div>

            {/* Progress Skeleton */}
            <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
              <Skeleton variant="text" height={24} width="40%" className="mb-6" />
              <Skeleton variant="rounded" height={12} className="mb-4" />
              <div className="flex gap-2">
                <Skeleton variant="rounded" height={32} width={100} />
                <Skeleton variant="rounded" height={32} width={80} />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile Header Card */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                key={userProfile?.updated_at || userProfile?.id}
                src={avatarUrl}
                alt={userProfile?.full_name || 'Profile'}
                className="w-32 h-32 rounded-full border-4 border-red-300/30 object-cover"
                onError={(e) => {
                  console.error("Error loading avatar image:", avatarUrl);
                  // Fallback to default avatar on error
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userProfile?.full_name || userProfile?.email || 'User'
                  )}&background=dc2626&color=fff&size=200`;
                }}
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userProfile?.full_name || 'Usuario'}
                </h1>
                <p className="text-red-200 text-lg mb-1">
                  {userProfile?.alias ? `@${userProfile.alias}` : userProfile?.email}
                </p>
                <p className="text-red-300/60 text-sm mb-4">
                  Miembro desde {memberSince}
                </p>
                <button
                  onClick={() => navigate("/my-account/edit")}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Novenas Progress */}
            <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Novenas</h2>
                <button 
                  onClick={() => navigate('/novenas')}
                  className="text-red-300 hover:text-red-200 text-sm font-medium"
                >
                  Ir a Novenas →
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl">🕯️</span>
                <div>
                  <p className="text-2xl font-bold text-white">{completedNovenas}/9</p>
                  <p className="text-red-200 text-sm">días completados</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información</h2>
              <div className="space-y-2">
                <p className="text-red-200 text-sm">
                  <span className="text-white font-medium">Email:</span> {userProfile?.email}
                </p>
                {userProfile?.phone && (
                  <p className="text-red-200 text-sm">
                    <span className="text-white font-medium">Teléfono:</span> {userProfile.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Tu Progreso</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Nivel de Participación</span>
                <span className="text-red-300 font-bold">{participationLevel}%</span>
              </div>
              <div className="w-full bg-red-900/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${participationLevel}%` }}
                />
              </div>
              <p className="text-red-200 text-sm mt-2">
                {participationLevel === 100 
                  ? '¡Felicidades! Completaste todas las novenas 🎄'
                  : `¡Sigue así! Te faltan ${9 - completedNovenas} días para completar la novena.`
                }
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-3">Logros</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
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
