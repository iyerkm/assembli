'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Which iPhones are supported?',
    a: 'Assembli works on iPhone 12 and newer running iOS 17+. For the best experience — especially the instant spatial mapping — we recommend iPhone 12 Pro or newer with LiDAR. The app still works on non-LiDAR iPhones, just with slightly slower room scanning.',
  },
  {
    q: 'Does it work offline?',
    a: 'The Pro and Teams plans include offline mode, which caches your furniture guides locally. The Starter and Builder plans require an internet connection for the initial load of assembly guides. AR processing and voice instructions always run on-device — no latency from the cloud.',
  },
  {
    q: 'How many furniture products are supported at launch?',
    a: "We're launching with 50 of the most popular IKEA products (BILLY, KALLAX, HEMNES, MALM, PAX and more), plus major pieces from Wayfair and MADE. We're adding 10-20 new products per week. Builder and Pro users can request specific products and we prioritise those.",
  },
  {
    q: 'Is my camera footage stored or shared?',
    a: 'Never. All vision processing happens entirely on your device. No camera frames are sent to our servers. We collect only anonymous analytics (steps completed, errors caught) to improve the product. You can opt out of analytics in Settings.',
  },
  {
    q: "What's the difference between Builder and Pro?",
    a: 'Builder covers unlimited furniture assembly — everything you need for home. Pro adds home repair workflows (mounting TV brackets, installing sinks, replacing fixtures), tool recognition, LiDAR measurement assistance, and offline mode. If you assemble furniture professionally, start with Builder. If you do repairs too, go Pro.',
  },
  {
    q: 'When is the app launching?',
    a: "We're targeting an App Store launch in Q3 2025. Join the waitlist to get early access before public launch, a 3-month discount on any paid plan, and a say in which furniture products we prioritise first.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-blue-400 text-sm font-bold tracking-widest uppercase mb-4">FAQ</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className={`glass rounded-2xl border transition-all ${
                open === i ? 'border-violet-500/30' : 'border-white/6 hover:border-white/12'
              }`}>
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className={`font-semibold text-sm transition-colors ${open === i ? 'text-white' : 'text-slate-300'}`}>
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-violet-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
