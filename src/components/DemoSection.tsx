'use client';

import { PhoneMockup } from './ui/PhoneMockup';

const screenInfo = {
  scan: {
    label: '01 — Room Scanning',
    headline: 'Maps your space in seconds',
    points: [
      'ARKit builds a precise 3D mesh of your room',
      'LiDAR users get sub-millimeter surface accuracy',
      'Automatically detects the best workspace surface',
      'Blue overlay shows confirmed assembly area',
    ],
  },
  detect: {
    label: '02 — Part Detection',
    headline: 'AI identifies every component',
    points: [
      'Vision AI recognises parts in real-time',
      'Works even if parts are partially obscured',
      'Confidence scores prevent false positives',
      'Supports 200+ part types across 50+ brands',
    ],
  },
  guide: {
    label: '03 — AR Guidance',
    headline: 'Step-by-step with your hands free',
    points: [
      'Glowing AR spheres mark every attachment point',
      'Directional arrows show orientation clearly',
      'Voice reads each instruction aloud automatically',
      'Tap "Repeat" or say it — the app hears you',
    ],
  },
};

export function DemoSection() {
  return (
    <section id="demo" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a18] to-[#050510]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-violet-400 text-sm font-bold tracking-widest uppercase mb-4">
            Live Demo
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
            See Assembli{' '}
            <span className="gradient-text">in action</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Click each tab to explore the three phases of an assembly session.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Phone mockup with tabs built in */}
          <div className="flex justify-center">
            <PhoneMockup autoPlay={false} />
          </div>

          {/* Right: Feature descriptions */}
          <div className="space-y-6 pt-4">
            {Object.entries(screenInfo).map(([key, info]) => (
              <div key={key} className="glass rounded-2xl p-6 border border-white/8 hover:border-violet-500/30 transition-all group">
                <p className="text-violet-400 text-xs font-bold tracking-widest uppercase mb-2">{info.label}</p>
                <h3 className="text-white text-xl font-bold mb-4 group-hover:text-violet-200 transition-colors">{info.headline}</h3>
                <ul className="space-y-2">
                  {info.points.map(p => (
                    <li key={p} className="flex items-start gap-3 text-slate-400 text-sm">
                      <svg className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
