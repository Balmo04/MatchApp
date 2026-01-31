import React from 'react';
import { Sparkles, Camera, ShoppingBag, Wand2, ArrowRight, ExternalLink } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const steps = [
    {
      icon: Camera,
      title: 'Sube tu foto',
      description: 'Una foto de cuerpo completo con buena luz. Tu pose y estilo son la base del resultado.',
    },
    {
      icon: ShoppingBag,
      title: 'Elige piezas de lujo',
      description: 'Explora el catálogo y selecciona las prendas que quieres probarte virtualmente.',
    },
    {
      icon: Wand2,
      title: 'Recibe tu look',
      description: 'La IA genera una imagen realista con las prendas sobre tu figura, respetando pose e iluminación.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-[#F9F8F6] to-slate-50/80" />
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold tracking-widest text-slate-600 uppercase">Virtual Try-On</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-4 tracking-tight">MATCH</h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium tracking-wide max-w-md mx-auto mb-2">
            The Virtual Luxury Atelier
          </p>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-12">
            Prueba prendas de lujo sobre tu propia foto. Sube una imagen, elige piezas del catálogo y obtén en segundos una imagen generada por IA con el look que deseas.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all text-sm tracking-wide"
          >
            <span>ENTRAR AL ATELIER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Description & How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Cómo funciona</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            MATCH combina tu foto con prendas de nuestro catálogo usando inteligencia artificial. Mantenemos tu rostro, pelo, tono de piel y pose; solo cambiamos la ropa por las piezas que elijas, con iluminación y encaje naturales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-serif text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Listo para probar tu look</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Inicia sesión con tu correo para acceder al atelier y generar tu primera prueba virtual.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all text-sm tracking-wide"
          >
            <span>ENTRAR AL ATELIER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer - Contáctanos */}
      <footer className="border-t border-slate-200 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Contáctanos</h3>
              <p className="text-slate-600 text-sm max-w-md mb-4">
                ¿Preguntas, sugerencias o quieres colaborar? Estamos aquí para ayudarte.
              </p>
              <a
                href="https://www.linkedin.com/in/alejandro-sandoval742/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
            <div className="text-slate-400 text-xs">
              <p>MATCH — The Virtual Luxury Atelier</p>
              <p className="mt-1">© {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
