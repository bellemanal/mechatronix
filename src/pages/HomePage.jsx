import HeroSection from '@/components/common/HeroSection'
import StatsBar from '@/components/common/StatsBar'
import TrendingSection from '@/components/common/TrendingSection'
import FeaturesSection from '@/components/common/FeaturesSection'
import HowItWorksSection from '@/components/common/HowItWorksSection'
import CTASection from '@/components/common/CTASection'

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <StatsBar />
      <TrendingSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  )
}
