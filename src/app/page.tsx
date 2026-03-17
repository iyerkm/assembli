import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { DemoSection } from '@/components/DemoSection';
import { Pricing } from '@/components/Pricing';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { WaitlistSection } from '@/components/WaitlistSection';
import { Footer } from '@/components/Footer';

// Social proof bar between hero and features
function SocialProof() {
  const items = [
    { icon: '🏆', text: 'ARKit & Vision AI' },
    { icon: '⚡', text: 'On-device processing' },
    { icon: '🔒', text: 'Camera never leaves device' },
    { icon: '🌍', text: '50+ furniture brands' },
    { icon: '⭐', text: '4.9 stars in beta' },
    { icon: '📦', text: 'No in-app purchases' },
  ];

  return (
    <div className="relative py-5 border-y border-white/5 overflow-hidden">
      <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-lg">{item.icon}</span>
            <span className="text-slate-400 text-sm font-medium">{item.text}</span>
            <span className="text-slate-700 ml-8">·</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DemoSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <WaitlistSection />
      <Footer />
    </>
  );
}
