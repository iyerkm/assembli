export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Assembli</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              AI-powered AR assembly guidance for iPhone. Stop fumbling with manuals — build anything with confidence.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-500 text-xs">Accepting waitlist sign-ups</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Demo', 'Roadmap', 'Changelog'].map(l => (
                <li key={l}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Press Kit', 'Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2025 Assembli. All rights reserved. Built with ARKit, RealityKit, and Vision.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 text-xs">Designed for</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 glass rounded-full border border-white/8">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-slate-400 text-xs font-medium">iOS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
