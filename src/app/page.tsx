import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { RecentlyViewedSection } from '@/components/sections/RecentlyViewedSection'
import { SpecsSection } from '@/components/sections/SpecsSection'
import { SubscribeSection } from '@/components/sections/SubscribeSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ProductsSection />
        <SpecsSection />
        <TestimonialsSection />
        <RecentlyViewedSection />
        <SubscribeSection />
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
