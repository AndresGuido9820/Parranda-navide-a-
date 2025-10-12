const beneficios = [
  'Guarda tu progreso en las novenas',
  'Comparte recetas y fotos',
  'Crea dinámicas y sorteos familiares',
]

export const Bienvenida = () => {
  return (
    <section className="bienvenida">
      <h3>Bienvenido</h3>
      <h1>Celebra la temporada</h1>
      <p>
        Ingresa tu cuenta para acceder a recetas, novenas y dinámicas navideñas. Comparte momentos,
        listas y música con tu familia y amigos.
      </p>
      <ul className="lista-beneficios">
        {beneficios.map((beneficio) => (
          <li key={beneficio}>{beneficio}</li>
        ))}
      </ul>
    </section>
  )
}
