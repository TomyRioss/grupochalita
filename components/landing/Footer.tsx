import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa'

const MAPS_URL = 'https://www.google.com/maps/search/Grupo%20Chalita/@20.74014623,-105.29225341,17z?hl=es'
const MAPS_EMBED_URL = 'https://www.google.com/maps?q=20.74014623,-105.29225341&z=16&output=embed'
const WHATSAPP_NUMBER = '523292965459'

const emails = [
  'ventas@grupochalitabahia.com',
  'kventas@grupochalitabahia.com',
  'cventas@grupochalitabahia.com',
  'Ventasoliver@grupochalitabahia.com',
]

const socials = [
  { icon: FaFacebook, href: 'https://www.facebook.com/GrupoChalitaOficial', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/grupochalitaoficial', label: 'Instagram' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@grupochalitabahioficial?_r=1&_t=ZS-97htZ3IM2Ne', label: 'TikTok' },
]

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface border-t border-border-brand/20">
      <div className="px-5 md:px-20 pt-16 md:pt-20 pb-8 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_0.9fr_1.2fr] gap-12 md:gap-8">
          {/* Brand + nav */}
          <div className="flex flex-col gap-8">
            <div className="font-display text-2xl text-text-brand tracking-widest uppercase">
              Grupo Chalita
            </div>
            <nav className="flex flex-col gap-3">
              <Link href="/catalogo" className="text-muted-brand hover:text-accent transition-colors text-sm w-fit">
                Catálogo
              </Link>
              <Link href="#servicios" className="text-muted-brand hover:text-accent transition-colors text-sm w-fit">
                Servicios
              </Link>
              <Link href="#contacto" className="text-muted-brand hover:text-accent transition-colors text-sm w-fit">
                Contacto
              </Link>
            </nav>
            <div className="flex gap-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-brand hover:text-accent transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Mapa */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir ubicación de Grupo Chalita en Google Maps"
            className="group relative block h-40 md:h-full min-h-[160px] rounded-lg overflow-hidden border border-border-brand/30 hover:border-accent/50 transition-colors"
          >
            <iframe
              src={MAPS_EMBED_URL}
              className="absolute inset-0 w-full h-full pointer-events-none grayscale-[60%] contrast-[1.1] brightness-[0.8] group-hover:grayscale-[30%] transition-all duration-300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Grupo Chalita"
            />
            <div className="absolute inset-0 bg-bg/20 group-hover:bg-bg/0 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-surface/90 text-xs text-text-brand">
              <FaMapMarkerAlt className="shrink-0 text-accent" size={12} />
              Ver ubicación en Google Maps
            </div>
          </a>

          {/* Horarios */}
          <div className="flex flex-col gap-4">
            <span className="text-accent text-xs tracking-widest uppercase">Horarios</span>
            <div className="flex items-start gap-3 text-sm text-muted-brand">
              <FaClock className="mt-0.5 shrink-0 text-accent2" size={14} />
              <div className="flex flex-col gap-1">
                <span>Lunes a viernes: 8:30 a 17:30</span>
                <span>Sábado: 8:30 a 13:30</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-brand hover:text-accent transition-colors w-fit"
            >
              <FaWhatsapp className="shrink-0 text-accent2" size={14} />
              +52 329 296 5459
            </a>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <span className="text-accent text-xs tracking-widest uppercase">Contacto</span>
            <div className="flex flex-col gap-2">
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-muted-brand hover:text-accent transition-colors"
                >
                  <FaEnvelope className="shrink-0 text-accent2" size={14} />
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border-brand/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-muted-brand text-xs text-center md:text-left">
              © {new Date().getFullYear()} Grupo Chalita. Todos los derechos reservados.
            </span>
            <span className="text-muted-brand/50 text-xs text-center md:text-left">
              Desarrollado por{' '}
              <a
                href="https://ttmweb-six.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-accent transition-colors"
              >
                TTM Agencia
              </a>
            </span>
          </div>
          <Link
            href="/admin/login"
            className="text-muted-brand/50 hover:text-accent transition-colors text-xs"
          >
            Acceso admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
