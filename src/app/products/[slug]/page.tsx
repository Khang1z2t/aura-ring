import { getAllSlugs } from '@/data/products'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-0">
        <p className="text-sm text-muted-foreground">Product route scaffold</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{slug}</h1>
      </div>
    </main>
  )
}
