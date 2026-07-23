'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useWeddingCart } from '@/lib/contexts/WeddingCartContext'

const navItems = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Toldos', href: '/toldos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Locaciones', href: '#locaciones' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { items, open: openCart } = useWeddingCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-border-brand/30">
      <nav className="flex justify-between items-center px-5 md:px-20 py-6 max-w-[1440px] mx-auto">
        <Link href="/" className="font-display text-2xl tracking-widest text-text-brand uppercase">
          Grupo Chalita
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-brand hover:text-text-brand transition-colors duration-300 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/wedding-plan"
            className="hidden lg:block bg-accent text-bg px-6 py-2.5 font-semibold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 rounded-full"
          >
            Arma tu Boda
          </Link>
          <button
            onClick={openCart}
            className="relative hidden md:block text-text-brand p-2 hover:bg-white/5 transition-all duration-300 rounded-full"
            aria-label="Ver plan de boda"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-bg text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden text-text-brand p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-bg border-t border-border-brand/30 px-5 py-5 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2.5 text-muted-brand hover:text-text-brand transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
