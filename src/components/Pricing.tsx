'use client';

import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    desc: 'Perfect for trying it out',
    badge: null,
    features: [
      '3 furniture assemblies per month',
      'Basic AR step overlays',
      'Voice instructions',
      '10 supported products',
      'Community support',
    ],
    missing: ['Unlimited assemblies', 'Home repair workflows', 'Offline mode', 'Priority support'],
    cta: 'Start Free',
    ctaHref: '#waitlist',
    highlight: false,
  },
  {
    name: 'Builder',
    monthly: 7.99,
    yearly: 6.67,
    desc: 'For the regular DIY-er',
    badge: 'Most Popular',
    features: [
      'Unlimited furniture assemblies',
      'Full AR guidance with attachment points',
      'Hands-free voice control',
      '50+ supported products',
      'Assembly history',
      'Early access to new products',
      'Email support',
    ],
    missing: ['Home repair workflows', 'Offline mode', 'Priority support'],
    cta: 'Join Waitlist',
    ctaHref: '#waitlist',
    highlight: true,
  },
  {
    name: 'Pro',
    monthly: 14.99,
    yearly: 12.49,
    desc: 'Professionals & power users',
    badge: null,
    features: [
      'Everything in Builder',
      'Home repair workflows',
      'Tool recognition',
      'Measurement assistant (LiDAR)',
      'Offline mode',
      '200+ products supported',
      'Priority support',
      'Early beta features',
    ],
    missing: [],
    cta: 'Join Waitlist',
    ctaHref: '#waitlist',
    highlight: false,
  },
  {
    name: 'Teams',
    monthly: 49,
    yearly: 40.83,
    desc: 'Gig workers & businesses',
    badge: null,
    features: [
      'Up to 5 team members',
      'Everything in Pro',
      'Work order integration',
      'Team progress dashboard',
      'Custom product library',
      'API access',
      'Dedicated account manager',
      'SLA support',
    ],
    missing: [],
    cta: 'Contact Us',
    ctaHref: '#waitlist',
    highlight: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0d0d1a] to-[#050510]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-violet-400 text-sm font-bold tracking-widest uppercase mb-4">Pricing</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
            Simple,{' '}
            <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Start free. Upgrade when you&apos;re ready.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-2xl p-1.5">
            <button onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!yearly ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${yearly ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
              Yearly
              <span className="text-xs font-bold text-green-400 bg-green-400/15 px-2 py-0.5 rounded-full">-17%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => (
            <div key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'border border-violet-500/50 bg-gradient-to-b from-violet-950/60 to-[#0d0d1a] shadow-xl shadow-violet-900/30 glow-violet'
                  : 'glass border border-white/8'
              }`}>

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-xs mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-white text-4xl font-black">
                    {plan.monthly === 0 ? 'Free' : `$${yearly ? plan.yearly.toFixed(2) : plan.monthly}`}
                  </span>
                  {plan.monthly > 0 && (
                    <span className="text-slate-500 text-sm mb-1">/mo</span>
                  )}
                </div>
                {yearly && plan.monthly > 0 && (
                  <p className="text-green-400 text-xs mt-1">billed ${(plan.yearly * 12).toFixed(0)}/year</p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-slate-300 text-xs">
                    <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-slate-600 text-xs line-through">
                    <svg className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href={plan.ctaHref}
                className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 shadow-lg'
                    : 'glass border border-white/10 text-white hover:bg-white/8'
                }`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          All prices in USD · Cancel anytime · 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
