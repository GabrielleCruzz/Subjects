import { useEffect } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemStatementSection } from '@/components/landing/ProblemStatementSection'
import { SolutionSection } from '@/components/landing/SolutionSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { DifferentialsSection } from '@/components/landing/DifferentialsSection'
import { TargetAudienceSection } from '@/components/landing/TargetAudienceSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'

const Index = () => {
  useEffect(() => {
    document.title = 'Subjects - Home'
  }, [])

  return (
    <>
      <HeroSection />
      <ProblemStatementSection />
      <SolutionSection />
      <FeaturesSection />
      <DifferentialsSection />
      <TargetAudienceSection />
      <FinalCTASection />
    </>
  )
}

export default Index
