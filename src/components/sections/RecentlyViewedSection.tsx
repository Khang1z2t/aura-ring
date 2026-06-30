const recentlyViewed = [] as const

export function RecentlyViewedSection() {
  if (recentlyViewed.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          Recently viewed
        </p>
      </div>
    </section>
  )
}
