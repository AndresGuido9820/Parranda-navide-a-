import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { MainLayout } from "../../../shared/layouts/MainLayout";

export const EditAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado inicial con mock data
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "Lucía Rodríguez",
    email: user?.email || "lucia.rodriguez@example.com",
    phone: "+57 300 123 4567",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.full_name
  )}&background=random&size=200`;

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan si se están cambiando
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Mock: Simular guardado
    console.log("Guardando cambios:", formData);
    alert("Cambios guardados exitosamente");
    navigate("/my-account");
  };

  const handleCancel = () => {
    navigate("/my-account");
  };

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
                d="M15 12H3m0 0l3-3m-3 3l3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5.5V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-white">Editar Perfil</h1>
              <p className="text-red-200 text-sm mt-1">
                Actualiza tu información personal y preferencias.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="bg-red-900/30 rounded-xl p-6 border border-red-800/40">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profileImage || avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-red-400/40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                      <path
                        d="M5 19a7 7 0 0114 0"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
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
                className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
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
                  className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-white font-medium mb-2">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-900/50 hover:bg-red-900/70 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};
