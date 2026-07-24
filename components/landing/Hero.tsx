import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
          alt="Recepción de boda de lujo con candelabros de cristal y arreglos florales violeta"
          fill
          priority
          className="object-cover brightness-[0.7] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/70 to-bg" />
      </div>

      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
        <span className="text-xs text-accent tracking-[0.4em] uppercase mb-6 block">
          Exclusividad &amp; Romance
        </span>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-text-brand mb-8 leading-none tracking-tight">
          Grupo Chalita — Tu Evento, <br className="hidden md:block" /> Nuestra Obra Maestra
        </h1>
        <p className="text-base md:text-lg text-muted-brand mb-12 max-w-2xl mx-auto leading-relaxed">
          Transformamos sueños en realidades tangibles a través de un diseño meticuloso y una logística de precisión para eventos de clase mundial.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#contacto"
            className="bg-accent text-bg px-10 py-5 font-semibold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 rounded-full"
          >
            Comenzar a Armar tu Evento
          </a>
          <a
            href="#servicios"
            className="border border-accent/30 text-text-brand px-10 py-5 font-semibold text-xs uppercase tracking-widest hover:bg-accent/10 transition-all duration-300 rounded-full"
          >
            Explorar Galería
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-muted-brand" size={32} />
      </div>
    </section>
  )
}
