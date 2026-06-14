import { Hero } from "@/components/landing/Hero";
import { StorySection } from "@/components/landing/StorySection";
import { TimeMachineShowcase } from "@/components/landing/TimeMachineShowcase";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StorySection />
      <TimeMachineShowcase />
      <CTASection />
    </main>
  );
}
