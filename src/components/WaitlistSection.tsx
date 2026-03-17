'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('builder');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, plan }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { duration: 6000 });
        setDone(true);
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="waitlist" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] to-[#0d0d1a]" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet-600/12 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-violet-500/30 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-300 text-xs font-semibold">Early access now open — limited spots</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
          Be first to{' '}
          <span className="gradient-text">build smarter</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
          Join the waitlist and get{' '}
          <span className="text-white font-medium">3 months free</span> on any paid plan at launch, plus early access before the App Store release.
        </p>

        {done ? (
          <div className="glass rounded-3xl p-10 border border-green-500/30">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-white text-2xl font-black mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-400">We&apos;ll email you the moment early access opens. Keep your eyes on the inbox.</p>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              {[
                { label: 'Share on X', href: 'https://twitter.com/intent/tweet?text=Just%20joined%20the%20Assembli%20waitlist%20%E2%80%94%20AI%20AR%20furniture%20assembly%20for%20iPhone%20%F0%9F%94%A9%E2%80%A8', icon: '🐦' },
                { label: 'Share on LinkedIn', href: '#', icon: '💼' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10 text-slate-300 hover:text-white transition-colors">
                  <span>{s.icon}</span>{s.label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/10 text-left space-y-4">
            {/* Name */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">Your name</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">Email address *</label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>

            {/* Plan interest */}
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">I&apos;m interested in</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'starter', label: 'Starter', sub: 'Free' },
                  { id: 'builder', label: 'Builder', sub: '$7.99/mo' },
                  { id: 'pro', label: 'Pro', sub: '$14.99/mo' },
                  { id: 'teams', label: 'Teams', sub: '$49/mo' },
                ].map(p => (
                  <button key={p.id} type="button" onClick={() => setPlan(p.id)}
                    className={`px-3 py-2.5 rounded-xl border text-center transition-all ${
                      plan === p.id
                        ? 'border-violet-500 bg-violet-600/20 text-white'
                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                    }`}>
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-violet-900/40 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Joining…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Claim My Early Access Spot →
                </>
              )}
            </button>

            <p className="text-center text-slate-600 text-xs">
              No spam. Unsubscribe anytime. We&apos;ll only email you when it matters.
            </p>
          </form>
        )}

        {/* Social proof numbers */}
        <div className="mt-10 flex justify-center gap-10">
          {[
            { value: '2,400+', label: 'On the waitlist' },
            { value: 'Q3 2025', label: 'Target launch' },
            { value: '3 months', label: 'Free for early joiners' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-white font-black text-xl gradient-text">{s.value}</div>
              <div className="text-slate-600 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
