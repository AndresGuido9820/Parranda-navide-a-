import { useAuthWithQueries } from './entities/auth/hooks/useAuthHook'
import { AuthPage, InicioPage } from './entities/auth'

export function App() {
  const { isAuthenticated, isLoading } = useAuthWithQueries()

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

  return isAuthenticated ? <InicioPage /> : <AuthPage />
}
