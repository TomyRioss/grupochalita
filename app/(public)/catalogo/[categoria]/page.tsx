export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryDetailClient from './CategoryDetailClient'
import CategoryTabsBar from '@/components/catalogo/CategoryTabsBar'
import WeddingCartPanel from '@/components/wedding/WeddingCartPanel'
import WeddingCartMobileTrigger from '@/components/wedding/WeddingCartMobileTrigger'
import { prisma } from '@/lib/prisma'
import { toWeddingCategory } from '@/lib/wedding-catalog-data'

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { active: true },
        orderBy: { order: 'asc' },
        include: { subcategory: { select: { name: true } } },
      },
    },
  })
  return categories.map(toWeddingCategory)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>
}): Promise<Metadata> {
  const { categoria } = await params
  const category = await prisma.category.findUnique({ where: { slug: categoria } })
  if (!category) return {}
  return {
    title: `${category.name} | Catálogo | Grupo Chalita`,
    description: `Productos de ${category.name} disponibles para tu evento.`,
  }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === categoria)

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#111009] px-4 md:px-20 pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-3 mb-10">
          <span className="text-[#D4AF6B] text-xs font-semibold tracking-[0.3em] uppercase">
            Catálogo
          </span>
          <h1 className="font-semibold text-3xl md:text-5xl text-[#F5EDD8] leading-tight">
            Elige los rubros para tu evento
          </h1>
          <p className="text-sm md:text-base text-[#7A6845]">
            Comenzá a añadir productos a tu evento: navegá los rubros de arriba y sumá lo que te guste a tu plan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <div className="mb-10">
              <CategoryTabsBar categories={categories} activeSlug={category.slug} />
            </div>
            <CategoryDetailClient category={category} />
          </div>

          <aside className="hidden lg:block h-fit sticky top-32">
            <div className="bg-[#1A1810] border border-[#2E2A18] rounded-xl p-6">
              <WeddingCartPanel />
            </div>
          </aside>
        </div>
      </div>
      <WeddingCartMobileTrigger />
    </main>
  )
}
