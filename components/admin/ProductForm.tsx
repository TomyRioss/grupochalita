'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductVariants from '@/components/admin/ProductVariants'

interface Variant {
  id: string
  name: string
  description: string | null
  images: string[]
  active: boolean
}

interface Subcategory {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  featured: boolean
  active: boolean
  mainImage: string | null
  images: string[]
  category: { id: string }
  subcategory: { id: string } | null
}

interface Props {
  categories: Category[]
  product?: Product
  variants?: Variant[]
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function uploadFiles(files: FileList): Promise<string[]> {
  const formData = new FormData()
  formData.append('folder', 'product-images')
  Array.from(files).forEach(f => formData.append('files', f))
  const res = await fetch('/api/upload', { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error subiendo imágenes')
  return data.urls as string[]
}

function Section({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_2px_16px_rgba(17,16,9,0.04)]">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
          {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-shadow'

export default function ProductForm({ categories, product, variants }: Props) {
  const router = useRouter()
  const isEdit = !!product
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    categoryId: product?.category.id ?? '',
    subcategoryId: product?.subcategory?.id ?? '',
    featured: product?.featured ?? false,
    active: product?.active ?? true,
  })
  const [mainImage, setMainImage] = useState<string | null>(product?.mainImage ?? null)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingMain(true)
    setError(null)
    try {
      const urls = await uploadFiles(files)
      setMainImage(urls[0] ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error subiendo imagen')
    } finally {
      setUploadingMain(false)
      e.target.value = ''
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingGallery(true)
    setError(null)
    try {
      const urls = await uploadFiles(files)
      setImages(prev => [...prev, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error subiendo imágenes')
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  function removeImage(url: string) {
    setImages(prev => prev.filter(u => u !== url))
  }

  const selectedCategory = categories.find(c => c.id === form.categoryId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const url = isEdit ? `/api/admin/productos/${product!.id}` : '/api/admin/productos'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = { ...form, slug: form.slug || slugify(form.name), mainImage, images }

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }

      router.push(isEdit ? '/admin/productos' : `/admin/productos/${data.id}/editar`)
      router.refresh()
    } catch {
      setError('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      <div className="flex flex-col gap-5 min-w-0">
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-500">{error}</div>
        )}

        <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Section
          title="Información básica"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h10" /></svg>}
        >
          <Field label="Nombre" required>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Copa Champagne Cristal"
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder={form.name ? slugify(form.name) : 'se genera automático'}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              className={inputClass}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Detalle visible en el catálogo"
            />
          </Field>
        </Section>

        <Section
          title="Categorización"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoría" required>
              <select
                required
                className={inputClass}
                value={form.categoryId}
                onChange={e => setForm(f => ({ ...f, categoryId: e.target.value, subcategoryId: '' }))}
              >
                <option value="">Seleccionar</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Subcategoría">
              <select
                className={inputClass}
                value={form.subcategoryId}
                onChange={e => setForm(f => ({ ...f, subcategoryId: e.target.value }))}
                disabled={!selectedCategory || selectedCategory.subcategories.length === 0}
              >
                <option value="">
                  {selectedCategory && selectedCategory.subcategories.length > 0 ? 'Sin subcategoría' : 'No disponible'}
                </option>
                {selectedCategory?.subcategories.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
            />
            Destacado en el catálogo
          </label>
        </Section>

        <Section
          title="Foto principal"
          hint="La que se muestra primero en el catálogo"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>}
        >
          {mainImage ? (
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-border group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setMainImage(null)}
                aria-label="Quitar foto principal"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-40 rounded-xl border border-dashed border-border bg-background text-muted-foreground hover:bg-muted cursor-pointer transition-colors gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-xs">{uploadingMain ? 'Subiendo...' : 'Subir foto'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} disabled={uploadingMain} />
            </label>
          )}
        </Section>

        <Section
          title="Galería"
          hint="Fotos adicionales del producto"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
        >
          <div className="flex flex-wrap gap-3">
            {images.map(url => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Quitar imagen"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center w-20 h-20 rounded-lg border border-dashed border-border bg-background text-muted-foreground hover:bg-muted cursor-pointer transition-colors">
              <span className="text-lg leading-none">+</span>
              <span className="text-[10px] mt-1">{uploadingGallery ? '...' : 'Subir'}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
            </label>
          </div>
        </Section>
        </form>

        {isEdit && (
          <Section
            title="Variaciones"
            hint="Color, talla, etc — cada una con su propia galería"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M9 12h6M12 9v6" /></svg>}
          >
            <ProductVariants productId={product!.id} variants={variants ?? []} />
          </Section>
        )}
      </div>

      {/* Sidebar: live preview + status + actions */}
      <div className="flex flex-col gap-4 self-start lg:sticky lg:top-6 w-full">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_2px_16px_rgba(17,16,9,0.04)]">
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
            {mainImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={mainImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-muted-foreground">Sin foto principal</span>
            )}
          </div>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-1">
              {selectedCategory?.name ?? 'Sin categoría'}
            </p>
            <p className="text-sm font-medium text-foreground truncate" style={{ fontFamily: 'Georgia, serif' }}>
              {form.name || 'Nombre del producto'}
            </p>
          </div>
        </div>

        {isEdit && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="flex items-center justify-between text-sm text-foreground cursor-pointer">
              <span>Producto activo</span>
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              {form.active ? 'Visible en el catálogo público' : 'Oculto del catálogo público'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button type="submit" form="product-form" disabled={loading} className="bg-primary text-primary-foreground w-full">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Link
            href="/admin/productos"
            className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-sm font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors w-full"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  )
}
