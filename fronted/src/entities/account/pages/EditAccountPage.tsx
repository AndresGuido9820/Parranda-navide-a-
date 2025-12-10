import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/layouts/MainLayout";
import { Skeleton } from "../../../shared/components/skeletons/Skeleton";
import { useProfile, useUpdateProfile, useUploadAvatar } from "../hooks/useProfile";

export const EditAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [formData, setFormData] = useState({
    full_name: "",
    alias: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        alias: profile.alias || "",
        phone: profile.phone || "",
      });
      if (profile.avatar_url) {
        setProfileImage(profile.avatar_url);
      }
    }
  }, [profile]);

  const avatarUrl = profileImage || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.full_name || profile?.email || 'User'
    )}&background=dc2626&color=fff&size=200`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Upload avatar if changed
      if (imageFile) {
        await uploadAvatar.mutateAsync(imageFile);
      }

      // Update profile data
      await updateProfile.mutateAsync({
        full_name: formData.full_name || undefined,
        alias: formData.alias || undefined,
        phone: formData.phone || undefined,
      });

      navigate("/my-account");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al guardar los cambios. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-account");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-8">
              <Skeleton variant="text" height={36} width="40%" className="mb-6" />
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={80} height={80} />
                  <Skeleton variant="rounded" height={40} width={120} />
                </div>
                <Skeleton variant="rounded" height={50} />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton variant="rounded" height={50} />
                  <Skeleton variant="rounded" height={50} />
                </div>
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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="bg-red-950/40 backdrop-blur-md border border-red-800/50 rounded-2xl p-8">
            {/* Title with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-400"
              >
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h1 className="text-3xl font-bold text-white">Editar Perfil</h1>
                <p className="text-red-200 text-sm mt-1">
                  Actualiza tu información personal.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="bg-red-900/30 rounded-xl p-6 border border-red-800/40">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 border-red-400/40 object-cover"
                    />
                    {uploadAvatar.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">
                      Esta imagen se mostrará en tu perfil.
                    </p>
                    <label className="inline-block bg-red-800/60 hover:bg-red-800/80 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSaving}
                      />
                      Cambiar foto
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-white font-medium mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  disabled={isSaving}
                  className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all disabled:opacity-50"
                />
              </div>

              {/* Alias and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="alias" className="block text-white font-medium mb-2">
                    Alias (nombre de usuario)
                  </label>
                  <input
                    type="text"
                    id="alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                    placeholder="tu_alias"
                    disabled={isSaving}
                    className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 123 4567"
                    disabled={isSaving}
                    className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-3 text-white/60 cursor-not-allowed"
                />
                <p className="text-red-300/50 text-xs mt-1">
                  El correo electrónico no se puede cambiar.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-red-900/50 hover:bg-red-900/70 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
