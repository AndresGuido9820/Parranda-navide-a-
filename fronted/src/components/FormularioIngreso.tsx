type Props = {
  onCambiarAPestanaRegistro: () => void
}

export const FormularioIngreso = ({ onCambiarAPestanaRegistro }: Props) => {
  return (
    <form className="registro-formulario">
      <div className="registro-campo registro-campo-completo">
        <label className="registro-etiqueta" htmlFor="correo-ingreso">
          Correo
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="correo-ingreso"
            name="correo-ingreso"
            type="email"
            placeholder="tucorreo@dominio.com"
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <div className="registro-campo registro-campo-completo">
        <label className="registro-etiqueta" htmlFor="clave-ingreso">
          Contraseña
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="clave-ingreso"
            name="clave-ingreso"
            type="password"
            placeholder="Escribe tu contraseña"
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <button type="submit" className="registro-boton-envio">
        Ingresar
      </button>

      <p className="registro-pregunta">
        ¿Aún no tienes cuenta?{' '}
        <button type="button" onClick={onCambiarAPestanaRegistro}>
          Crear cuenta
        </button>
      </p>
    </form>
  )
}
