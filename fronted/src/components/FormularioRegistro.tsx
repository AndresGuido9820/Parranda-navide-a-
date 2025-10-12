type Props = {
  onCambiarAPestanaIngresar: () => void
}

export const FormularioRegistro = ({ onCambiarAPestanaIngresar }: Props) => {
  return (
    <form className="registro-formulario">
      <div className="registro-campo">
        <label className="registro-etiqueta" htmlFor="nombre">
          Nombre
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <div className="registro-campo">
        <label className="registro-etiqueta" htmlFor="apellido">
          Apellido
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="apellido"
            name="apellido"
            type="text"
            placeholder="Tu apellido"
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <div className="registro-campo registro-campo-completo">
        <label className="registro-etiqueta" htmlFor="correo">
          Correo
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="correo"
            name="correo"
            type="email"
            placeholder="tucorreo@dominio.com"
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <div className="registro-campo">
        <label className="registro-etiqueta" htmlFor="contrasena">
          Contraseña
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            placeholder="Min. 8 caracteres"
            minLength={8}
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <div className="registro-campo">
        <label className="registro-etiqueta" htmlFor="confirmar">
          Confirmar
        </label>
        <div className="registro-campo-contenedor">
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            placeholder="Repite la contraseña"
            minLength={8}
            required
            className="registro-entrada"
          />
        </div>
      </div>

      <label className="registro-condiciones">
        <input type="checkbox" name="terminos" required />
        <span>
          Acepto los <a href="#">Términos</a> y la <a href="#">Política de privacidad</a>.
        </span>
      </label>

      <button type="submit" className="registro-boton-envio">
        Crear cuenta
      </button>

      <p className="registro-pregunta">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onCambiarAPestanaIngresar}>
          Ingresar
        </button>
      </p>
    </form>
  )
}
