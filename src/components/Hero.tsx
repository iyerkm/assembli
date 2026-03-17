'use client';

import { PhoneMockup } from './ui/PhoneMockup';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-100" />

      {/* Radial glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — Copy */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-violet-500/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-violet-400 text-xs font-semibold tracking-wide">Now accepting early access</span>
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Assemble{' '}
            <span className="gradient-text">anything</span>
            <br />in half the time.
          </h1>

          <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
            Point your iPhone at any furniture. AI identifies every part, tracks your progress, and guides you with{' '}
            <span className="text-white font-medium">AR overlays and real-time voice instructions</span>.
            No more frustrating manuals.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { value: '50+', label: 'Furniture Brands' },
              { value: '3 min', label: 'Avg Setup Time' },
              { value: '99%', label: 'Success Rate' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#050510] font-bold text-base hover:bg-slate-100 transition-all shadow-lg">
              <span className="text-lg">▶</span>
              Try the Live Demo
            </a>
            <a href="#waitlist"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-violet-900/50 glow-violet">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Get Early Access
            </a>
            <a href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-base hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See It In Action
            </a>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-slate-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Free to join · iOS 17+ · iPhone 12 Pro and newer recommended
          </p>
        </div>

        {/* Right — Phone mockup */}
        <div className="flex justify-center lg:justify-end">
          <PhoneMockup autoPlay={true} />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050510] to-transparent pointer-events-none" />
    </section>
  );
}
