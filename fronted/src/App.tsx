import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EditAccountPage, MyAccountPage } from './entities/account'
import { AuthPage } from './entities/auth'
import { useAuth } from './entities/auth/hooks/useAuth'
import { DinamicasPage } from './entities/dinamicas'
import { NinoJesusPage } from './entities/dinamicas'
import { InicioPage } from './entities/inicio/pages/InicioPage'
import { MusicaPage } from './entities/musica/pages/MusicaPage'
import { NovenaDetailPage, NovenasPage } from './entities/novenas'
import { CreateRecipePage, RecetasPage, RecipeDetailPage } from './entities/recetas'
import { SoportePage } from './entities/soporte'
import { queryClient } from './shared/api/queryClient'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center bg-white p-8 rounded-lg shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando...</h2>
          <p className="text-gray-600">Iniciando Parranda Navideña</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/inicio"
          element={isAuthenticated ? <InicioPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/novenas"
          element={isAuthenticated ? <NovenasPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/novenas/:day"
          element={isAuthenticated ? <NovenaDetailPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/recetas"
          element={isAuthenticated ? <RecetasPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/recetas/create"
          element={isAuthenticated ? <CreateRecipePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/recetas/:id"
          element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/musica"
          element={isAuthenticated ? <MusicaPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dinamicas"
          element={isAuthenticated ? <DinamicasPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dinamicas/nino-jesus"
          element={isAuthenticated ? <NinoJesusPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/soporte"
          element={isAuthenticated ? <SoportePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/my-account"
          element={isAuthenticated ? <MyAccountPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/my-account/edit"
          element={isAuthenticated ? <EditAccountPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/inicio" : "/auth"} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}