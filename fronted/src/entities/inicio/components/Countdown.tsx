import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Christmas countdown component.
 */
export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const christmas = new Date(now.getFullYear(), 11, 25);

      if (now.getMonth() === 11 && now.getDate() > 25) {
        christmas.setFullYear(christmas.getFullYear() + 1);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <div className="relative group w-full max-w-3xl mx-auto mb-16">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-800 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />

      <div className="relative bg-red-950/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 md:p-10 text-center shadow-2xl">
        <h2 className="text-red-100 font-medium mb-8 flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
          Cuenta Regresiva para Navidad
        </h2>

        <div className="flex flex-col items-center mb-8">
          <span className="text-8xl md:text-9xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tighter">
            {timeLeft.days}
          </span>
          <span className="text-red-400 font-semibold text-lg uppercase tracking-wider mt-2">
            Días restantes
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
          {timeUnits.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs text-gray-400 uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

