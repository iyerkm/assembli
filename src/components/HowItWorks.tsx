const steps = [
  {
    num: '01',
    icon: '📡',
    title: 'Scan your workspace',
    desc: 'Open the app and slowly pan your iPhone around your assembly area. ARKit builds a live 3D map in seconds — LiDAR users get instant precision.',
    detail: 'Detects floor, tables, and any horizontal surface automatically.',
  },
  {
    num: '02',
    icon: '🧩',
    title: 'Lay out your parts',
    desc: "Unbox and spread your furniture parts on the floor. Point the camera — Vision AI identifies and labels every component, even partial views.",
    detail: 'Works with pieces still in their plastic wrapping.',
  },
  {
    num: '03',
    icon: '✨',
    title: 'Follow the AR guide',
    desc: 'Glowing overlays appear directly on your furniture showing exactly where each piece connects. Voice instructions keep your hands free to work.',
    detail: 'Tap "Next Step" or just say it — the app hears you.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0d0d1a] to-[#050510]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-bold tracking-widest uppercase mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
            From box to built in{' '}
            <span className="gradient-text">three steps</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-violet-600/30 via-cyan-600/30 to-violet-600/30" />

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center lg:items-center">
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full border border-violet-500/30 flex items-center justify-center glass">
                  <span className="text-4xl">{s.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-black">{s.num}</span>
                </div>
              </div>

              <h3 className="text-white text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">{s.desc}</p>
              <p className="text-violet-400/70 text-xs italic">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a href="#demo"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch the interactive demo →
          </a>
        </div>
      </div>
    </section>
  );
}
