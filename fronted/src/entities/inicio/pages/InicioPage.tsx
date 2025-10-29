import { Card, CardBody } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';

const useChristmasCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const christmas = new Date(now.getFullYear(), 11, 25);
      
      if (now.getMonth() === 11 && now.getDate() > 25) {
        christmas.setFullYear(christmas.getFullYear() + 1);
      }

      const difference = christmas.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

export const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const countdown = useChristmasCountdown();

  const sections = [
    {
      icon: '🙏',
      title: 'Novenas',
      description: 'Reza las novenas navideñas',
      path: '/novenas',
      color: 'primary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-0xLMnrUvyYzhwXkMY1BHjZjFcuNEqno_U_FD9OGxI6BcwvTRhqmXaEXS3BFDUX0hjfWD-xaDvRIaHzgzZwyILgR1a7-jHp8ZTypdbXw95CCDBu4su8I3h4JGDP4Gswvn4kksFLkKi7pC8xQpHTtiEdYK0-kwMealyadvEkvq_ekC_6GMAGp_VUdRZZwH9K1qGQVcHM48Lmy4QS96xcl-YnrUq1aEFyJur6O1_1RuoanNZX0fRReNBXSMj0hjSMrzDgCFLW3sePp'
    },
    {
      icon: '🍽️',
      title: 'Recetas',
      description: 'Descubre recetas navideñas',
      path: '/recetas',
      color: 'secondary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd83bOdv6cP5VN-eLhvaAV7gy__lYJPEfha3vg-gNdtyw79RdgTF9Tdzpy5bWlRnqBBTkgIlkxygNPsOzHkihtdml4VnhWbhWIRwR13sPq0y80FuzDwRKenXE2JdhAd59QBWNHvi2P3BgE7u0tLC5V07dw82rf680GCTRakEvPt_Haa9EZMFLxATZFEsFdOXOlHYG8P1TWN-4osX04Bnv62MQTv5ieVqLlhab-pJKo8PH9DJUyJ8triVAEr4tN9LNkDlvBN3iu7vev'
    },
    {
      icon: '🎵',
      title: 'Música',
      description: 'Disfruta música navideña',
      path: '/musica',
      color: 'danger',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtxgwbLy__qqi59cr8vb_cxg8L5cjs178wLa8Ocm476tL6MXeYBOzmBIsmpBLoHRusHhrA4e-A3EtCC7DHdE0ry_GzZ4W7bl8tySWgNgGmqbSWAdSVxMwrP1bAVstKsXzC7R2JPOzMQoGSvOyF7XBbS9O-iceqnV_gpnYBgALZ_ahWmcb32uydFGl2us9TC8gyrPZ9b0ZY6MAjRsbtCM9eEDloPzdlpCwmkwhzQpfcGjXlXOqYAqOer7-JhNFY2bYDAyJle5aRn4d9'
    },
    {
      icon: '🎄',
      title: 'Dinámicas navideñas',
      description: 'Actividades para compartir',
      path: '/dinamicas',
      color: 'success',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuXPLsGmDOrd211BxLWcV84dxn-VMxxRY_Snuz0ix2l0FlO_zkldruk6V2cqIsbWWeYltHh6-dImZiggAAgnNcm3iIvOMmkqydwLNkxemtuCFlUG4rxRUpaSYmWSljTIPgiFoMEsB_Kc-UZYj932iY07GTiVr3DZ_LOzjiGi_iHgRZdTgTjgjqBv2-yl5gKcExysgrL4z5zY5oKG2PwzeeYglLtQoiOlfb5dGvmhmBd5sg2fq1o1x8_6-uQyMU1eqoZIvb3V3PYv1L'
    },
  ];

  // Mock data for "Continuar Novena"
  const currentNovenaDay = {
    day: 5,
    title: 'La llegada de los Reyes Magos',
    icon: '👑',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuXPLsGmDOrd211BxLWcV84dxn-VMxxRY_Snuz0ix2l0FlO_zkldruk6V2cqIsbWWeYltHh6-dImZiggAAgnNcm3iIvOMmkqydwLNkxemtuCFlUG4rxRUpaSYmWSljTIPgiFoMEsB_Kc-UZYj932iY07GTiVr3DZ_LOzjiGi_iHgRZdTgTjgjqBv2-yl5gKcExysgrL4z5zY5oKG2PwzeeYglLtQoiOlfb5dGvmhmBd5sg2fq1o1x8_6-uQyMU1eqoZIvb3V3PYv1L'
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-2">
              ¡Feliz Navidad!
            </h1>
            <p className="text-xl text-white/80">
              Disfruta de la magia de la temporada.
            </p>
          </div>

          {/* Christmas Countdown Card */}
          <Card 
            className="mb-8 bg-red-800/30 border-2 border-red-800 rounded-lg max-w-3xl mx-auto min-h-96"
            classNames={{
              base: '',
              body: 'border-rounded-lg'
            }}
          >
            <CardBody className="p-8 ">
              <h2 className="text-2xl font-bold text-red-100 mb-6">Cuenta Regresiva para Navidad</h2>
              
              <div className="text-center">
                <div className="text-7xl font-bold text-white mb-2">{countdown.days}</div>
                <div className="text-lg text-red-100 mb-8">Días restantes</div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{countdown.days.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-red-100">Días</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{countdown.hours.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-red-100">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{countdown.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-red-100">Minutos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{countdown.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-sm text-red-100">Segundos</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Main Sections - Vertical Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8 max-w-3xl mx-auto">
            {sections.map((section) => (
              <Card 
                key={section.path} 
                className="relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer rounded-lg border-none h-52"
                isPressable
                onPress={() => navigate(section.path)}
              >
                {section.image && (
                  <>
                    <div 
                      className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundImage: `url(${section.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </>
                )}
                <CardBody className="p-6 relative flex items-center h-full">
                  <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Continue Novena Card */}
          <Card 
            className="bg-red-800/30 dark:bg-red-800/40 rounded-xl cursor-pointer h-52 w-full" 
            isPressable 
            onPress={() => navigate('/novenas')}
            classNames={{
              base: 'shadow-lg border-2 border-red-800/30 max-w-3xl mx-auto'
            }}
          >
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-32 h-32 rounded-lg bg-center bg-cover"
                    style={{ backgroundImage: `url(${currentNovenaDay.image})` }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-xl mb-1">Continúa tu Novena</p>
                  <p className="text-sm text-white/70">
                    Día {currentNovenaDay.day}: {currentNovenaDay.title}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

