import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { ContactTile } from '../components/ContactTile';
import { FAQItem } from '../components/FAQItem';

// SVG Icons
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 5.28 2 2 0 0 1 4.09 3h2a2 2 0 0 1 2 1.72c.12.9.31 1.78.58 2.63a2 2 0 0 1-.45 2.11L7.1 10.9a16 16 0 0 0 6 6l1.44-1.12a2 2 0 0 1 2.11-.45c.85.27 1.73.46 2.63.58A2 2 0 0 1 22 16.92Z" stroke="#efe4e4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#efe4e4" strokeWidth="1.6"/>
    <path d="M22 8l-10 6L2 8" stroke="#efe4e4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TimeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#d8cfcf" strokeWidth="1.6"/>
    <path d="M12 7v5l3 2" stroke="#d8cfcf" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l8 6v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9l8-6z" stroke="#f3d7d7" strokeWidth="1.6"/>
  </svg>
);

const faqData = [
  {
    id: 'p1',
    question: '¿Cómo agrego canciones a la cola?',
    answer: 'Abre la vista de reproducción, pulsa en ••• de la canción y elige <strong>Agregar a la cola</strong>. También puedes arrastrar y soltar en desktop.'
  },
  {
    id: 'p2',
    question: '¿Puedo usar la app sin internet?',
    answer: 'Sí. Activa el modo <strong>Offline</strong> en Ajustes para descargar listas y contenido esencial. Algunas funciones (búsqueda online) quedarán limitadas.'
  },
  {
    id: 'p3',
    question: '¿Cómo cambio entre tema claro y oscuro?',
    answer: 'Ve a <strong>Ajustes → Apariencia</strong> y selecciona el tema deseado. Si eliges "Automático", se sincroniza con la preferencia del sistema.'
  },
  {
    id: 'p4',
    question: '¿Cómo restablezco mi contraseña?',
    answer: 'En la pantalla de ingreso, selecciona <strong>¿Olvidaste tu contraseña?</strong> y sigue el enlace que te enviaremos al correo registrado.'
  },
  {
    id: 'p5',
    question: '¿Cómo elimino mi cuenta?',
    answer: 'Desde <strong>Perfil → Privacidad</strong> elige <em>Eliminar cuenta</em>. Te pediremos confirmación y tus datos serán desactivados antes de borrarse de forma permanente.'
  },
  {
    id: 'p6',
    question: 'La música no suena en segundo plano',
    answer: 'Asegúrate de permitir "reproducción en segundo plano" en Ajustes del sistema y desactiva optimizaciones de batería para la app.'
  },
  {
    id: 'p7',
    question: '¿Puedo compartir recetas y fotos?',
    answer: 'Sí, desde el botón <strong>Compartir</strong> en cada receta puedes publicar tus variaciones con fotos. Revisa las reglas de la comunidad antes de enviar.'
  },
  {
    id: 'p8',
    question: '¿Cómo reporto un problema?',
    answer: 'Usa <strong>Ayuda → Reportar</strong> para enviarnos logs y una descripción. Incluye capturas de pantalla si es posible.'
  }
];

export const SoportePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0b0b0b] bg-gradient-to-b from-[#0b0b0b] via-[#0b0b0b] to-[#0b0b0b]">
        <div className="w-full max-w-[1000px] mx-auto px-4 py-6 pb-24">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1.5 mt-3">
            <div
              className="w-7 h-7 rounded-lg grid place-items-center bg-[#1f1414] border border-red-500/22 cursor-pointer"
              onClick={() => navigate('/inicio')}
            >
              <HomeIcon />
            </div>
            <div>
              <h1 className="text-[36px] font-bold text-[#f3f3f3] m-0">Soporte</h1>
              <div className="text-[#b8abab] text-sm mt-0.5 mb-3.5">
                Contáctanos y revisa las preguntas frecuentes.
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-[320px_1fr] gap-6 mt-6">
            {/* Contact Card */}
            <aside className="bg-[#171111] border border-red-500/22 rounded-[16px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-4">
              <h3 className="text-lg font-bold text-[#f3f3f3] mb-3 mt-0.5">Contáctanos</h3>
              
              <ContactTile
                icon={<PhoneIcon />}
                title="Llamar"
                subtitle="+57 300 123 4567"
                href="tel:+573001234567"
              />

              <ContactTile
                icon={<EmailIcon />}
                title="Correo"
                subtitle="soporte@navidadmagica.app"
                href="mailto:soporte@navidadmagica.app"
              />

              <div className="grid grid-cols-[18px_1fr] gap-2.5 items-start text-[#b8abab] text-sm mt-3.5">
                <TimeIcon />
                <div>
                  Lun–Vie, 9:00–18:00 (UTC‑5)<br/>
                  <span className="text-[#b8abab] text-sm">
                    Tiempo de respuesta promedio: 1–4 horas hábiles.
                  </span>
                </div>
              </div>
            </aside>

            {/* FAQ Section */}
            <section className="bg-[#171111] border border-red-500/22 rounded-[16px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-2" aria-label="Preguntas frecuentes">
              {faqData.map((faq) => (
                <FAQItem key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};