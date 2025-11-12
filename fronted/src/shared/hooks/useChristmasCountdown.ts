import { useState, useEffect } from 'react';

interface CountdownTime {
  name: string;
  value: number;
}

export const useChristmasCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime[]>([
    { name: "Días", value: 0 },
    { name: "Horas", value: 0 },
    { name: "Minutos", value: 0 },
    { name: "Segundos", value: 0 },
  ]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Fecha objetivo: 25 de diciembre a las 00:00:00
      let christmasDate = new Date(currentYear, 11, 25, 0, 0, 0);

      // Si ya pasó Navidad este año, calcular para el próximo año
      if (now > christmasDate) {
        christmasDate = new Date(currentYear + 1, 11, 25, 0, 0, 0);
      }

      const difference = christmasDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft([
          { name: "Días", value: days },
          { name: "Horas", value: hours },
          { name: "Minutos", value: minutes },
          { name: "Segundos", value: seconds },
        ]);
      } else {
        // Si llegamos a Navidad, mostrar ceros
        setTimeLeft([
          { name: "Días", value: 0 },
          { name: "Horas", value: 0 },
          { name: "Minutos", value: 0 },
          { name: "Segundos", value: 0 },
        ]);
      }
    };

    // Calcular inmediatamente
    calculateTimeLeft();

    // Actualizar cada segundo
    const interval = setInterval(calculateTimeLeft, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};
