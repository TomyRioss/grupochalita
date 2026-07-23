export interface WeddingItem {
  id: string
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  price: number
  unitLabel: string | null
  subcategory: string | null
}

export interface WeddingCategory {
  id: string
  slug: string
  name: string
  icon: string | null
  items: WeddingItem[]
}

export function getCategoryBySlug(
  categories: WeddingCategory[],
  slug: string
): WeddingCategory | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getSubcategories(category: WeddingCategory): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of category.items) {
    if (item.subcategory && !seen.has(item.subcategory)) {
      seen.add(item.subcategory)
      result.push(item.subcategory)
    }
  }
  return result
}

type ProductForCatalog = {
  id: string
  slug: string
  name: string
  description: string | null
  mainImage: string | null
  subcategory: { name: string } | null
}

type CategoryForCatalog = {
  id: string
  slug: string
  name: string
  icon: string | null
  products: ProductForCatalog[]
}

export function toWeddingCategory(category: CategoryForCatalog): WeddingCategory {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    icon: category.icon,
    items: category.products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      imageUrl: p.mainImage,
      price: 0,
      unitLabel: null,
      subcategory: p.subcategory?.name ?? null,
    })),
  }
}
