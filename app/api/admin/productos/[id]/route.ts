import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body: {
    name?: string
    slug?: string
    description?: string | null
    categoryId?: string
    subcategoryId?: string | null
    active?: boolean
    featured?: boolean
    mainImage?: string | null
    images?: string[]
  } = await req.json()
  const { name, slug, description, categoryId, subcategoryId, active, featured, mainImage, images } = body

  if (slug) {
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing && existing.id !== id) return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 409 })
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      ...(subcategoryId !== undefined && { subcategoryId: subcategoryId || null }),
      ...(active !== undefined && { active }),
      ...(featured !== undefined && { featured }),
      ...(mainImage !== undefined && { mainImage: mainImage || null }),
      ...(Array.isArray(images) && { images }),
    },
    include: { category: { select: { id: true, name: true } }, subcategory: { select: { id: true, name: true } } },
  })
  return NextResponse.json(product)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
