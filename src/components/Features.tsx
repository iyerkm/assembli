const features = [
  {
    icon: '🔍',
    title: 'AI Part Detection',
    desc: 'Vision AI automatically identifies every component — panels, screws, dowels, cam locks — the moment you lay them out.',
    color: 'from-violet-600/20 to-violet-600/5',
    border: 'border-violet-500/20',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    icon: '🗺️',
    title: 'Spatial Room Mapping',
    desc: 'LiDAR and ARKit build a live 3D map of your workspace, so overlays stick precisely to real-world surfaces.',
    color: 'from-blue-600/20 to-blue-600/5',
    border: 'border-blue-500/20',
    glow: 'rgba(37,99,235,0.15)',
  },
  {
    icon: '🔊',
    title: 'Hands-Free Voice Guide',
    desc: 'Natural voice instructions let you keep both hands on the furniture — no tapping required to follow along.',
    color: 'from-cyan-600/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
    glow: 'rgba(8,145,178,0.15)',
  },
  {
    icon: '✅',
    title: 'Smart Step Tracking',
    desc: 'The assembly graph tracks exactly where you are. Skip ahead, go back, or pause — it always knows your place.',
    color: 'from-green-600/20 to-green-600/5',
    border: 'border-green-500/20',
    glow: 'rgba(22,163,74,0.15)',
  },
  {
    icon: '⚠️',
    title: 'Mistake Detection',
    desc: 'AI catches wrong orientations and incorrect part placements before you drive the cam lock in the wrong direction.',
    color: 'from-orange-600/20 to-orange-600/5',
    border: 'border-orange-500/20',
    glow: 'rgba(234,88,12,0.15)',
  },
  {
    icon: '📦',
    title: 'Growing Product Library',
    desc: 'IKEA, BILLY, KALLAX, HEMNES, Wayfair, West Elm and more. New furniture added weekly by our community.',
    color: 'from-pink-600/20 to-pink-600/5',
    border: 'border-pink-500/20',
    glow: 'rgba(219,39,119,0.15)',
  },
];

export function Features() {
  return (
    <section id="features" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-violet-400 text-sm font-bold tracking-widest uppercase mb-4">
            Why Assembli
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
            Everything you need to{' '}
            <span className="gradient-text">build with confidence</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six years of AR + ML research packed into an app your parents could use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} group hover:-translate-y-1 transition-all duration-300`}
              style={{ boxShadow: `0 0 0 1px ${f.glow}` }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
