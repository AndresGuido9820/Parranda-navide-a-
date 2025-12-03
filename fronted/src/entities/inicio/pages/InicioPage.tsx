import { CalendarDays, Gift, Music, UtensilsCrossed } from 'lucide-react';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { Countdown, SectionCard } from '../components';

const SECTIONS = [
  {
    title: 'Novenas',
    icon: CalendarDays,
    description: 'Oraciones diarias para rezar en familia junto al pesebre.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-0xLMnrUvyYzhwXkMY1BHjZjFcuNEqno_U_FD9OGxI6BcwvTRhqmXaEXS3BFDUX0hjfWD-xaDvRIaHzgzZwyILgR1a7-jHp8ZTypdbXw95CCDBu4su8I3h4JGDP4Gswvn4kksFLkKi7pC8xQpHTtiEdYK0-kwMealyadvEkvq_ekC_6GMAGp_VUdRZZwH9K1qGQVcHM48Lmy4QS96xcl-YnrUq1aEFyJur6O1_1RuoanNZX0fRReNBXSMj0hjSMrzDgCFLW3sePp',
    path: '/novenas',
  },
  {
    title: 'Recetas',
    icon: UtensilsCrossed,
    description: 'Los mejores platos típicos para tu cena de Nochebuena.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDd83bOdv6cP5VN-eLhvaAV7gy__lYJPEfha3vg-gNdtyw79RdgTF9Tdzpy5bWlRnqBBTkgIlkxygNPsOzHkihtdml4VnhWbhWIRwR13sPq0y80FuzDwRKenXE2JdhAd59QBWNHvi2P3BgE7u0tLC5V07dw82rf680GCTRakEvPt_Haa9EZMFLxATZFEsFdOXOlHYG8P1TWN-4osX04Bnv62MQTv5ieVqLlhab-pJKo8PH9DJUyJ8triVAEr4tN9LNkDlvBN3iu7vev',
    path: '/recetas',
  },
  {
    title: 'Música',
    icon: Music,
    description: 'Playlists de villancicos clásicos y música parrandera.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtxgwbLy__qqi59cr8vb_cxg8L5cjs178wLa8Ocm476tL6MXeYBOzmBIsmpBLoHRusHhrA4e-A3EtCC7DHdE0ry_GzZ4W7bl8tySWgNgGmqbSWAdSVxMwrP1bAVstKsXzC7R2JPOzMQoGSvOyF7XBbS9O-iceqnV_gpnYBgALZ_ahWmcb32uydFGl2us9TC8gyrPZ9b0ZY6MAjRsbtCM9eEDloPzdlpCwmkwhzQpfcGjXlXOqYAqOer7-JhNFY2bYDAyJle5aRn4d9',
    path: '/musica',
  },
  {
    title: 'Dinámicas',
    icon: Gift,
    description: 'Juegos y actividades divertidas para compartir alegría.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuXPLsGmDOrd211BxLWcV84dxn-VMxxRY_Snuz0ix2l0FlO_zkldruk6V2cqIsbWWeYltHh6-dImZiggAAgnNcm3iIvOMmkqydwLNkxemtuCFlUG4rxRUpaSYmWSljTIPgiFoMEsB_Kc-UZYj932iY07GTiVr3DZ_LOzjiGi_iHgRZdTgTjgjqBv2-yl5gKcExysgrL4z5zY5oKG2PwzeeYglLtQoiOlfb5dGvmhmBd5sg2fq1o1x8_6-uQyMU1eqoZIvb3V3PYv1L',
    path: '/dinamicas',
  },
];

export const InicioPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-8 pb-16 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-3 tracking-tight text-white drop-shadow-xl">
              ¡Feliz Navidad!
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Disfruta de la magia de la temporada.
            </p>
          </div>

          {/* Countdown */}
          <div className="w-full animate-fade-in-up delay-100">
            <Countdown />
          </div>

          {/* Section cards */}
          <div className="flex flex-col gap-6 w-full max-w-3xl animate-fade-in-up delay-200">
            {SECTIONS.map((section) => (
              <SectionCard
                key={section.path}
                title={section.title}
                icon={section.icon}
                description={section.description}
                image={section.image}
                path={section.path}
              />
            ))}
          </div>
        </div>
    </MainLayout>
  );
};
