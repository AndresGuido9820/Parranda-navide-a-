import { useState } from 'react'
import { Bienvenida } from '../components/Bienvenida'
import { FormularioIngreso } from '../components/FormularioIngreso'
import { FormularioRegistro } from '../components/FormularioRegistro'

export const LoginPage = () => {
  const [pestanaActiva, setPestanaActiva] = useState<'ingresar' | 'registrarse'>('registrarse')

  return (
    <div className="aplicacion">
      <header className="cabecera">Navidad Mágica</header>
      <main className="contenido">
        <Bienvenida />

        <section className="registro">
          <header className="registro-pestanas" aria-label="Cambiar formulario">
            <button
              type="button"
              className={`registro-boton ${pestanaActiva === 'ingresar' ? 'registro-boton-activo' : 'registro-boton-inactivo'}`}
              onClick={() => setPestanaActiva('ingresar')}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={`registro-boton ${pestanaActiva === 'registrarse' ? 'registro-boton-activo' : 'registro-boton-inactivo'}`}
              onClick={() => setPestanaActiva('registrarse')}
            >
              Crear cuenta
            </button>
          </header>

          {pestanaActiva === 'registrarse' ? (
            <FormularioRegistro onCambiarAPestanaIngresar={() => setPestanaActiva('ingresar')} />
          ) : (
            <FormularioIngreso onCambiarAPestanaRegistro={() => setPestanaActiva('registrarse')} />
          )}
        </section>
      </main>
    </div>
  )
}
