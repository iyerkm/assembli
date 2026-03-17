const testimonials = [
  {
    quote: "I've assembled dozens of IKEA pieces and this is the first time I didn't have parts left over. The AR arrows make it impossible to get confused.",
    name: 'Sarah M.',
    role: 'Homeowner, London',
    avatar: 'SM',
    stars: 5,
    gradient: 'from-violet-600 to-blue-600',
  },
  {
    quote: "As a TaskRabbit worker I assemble furniture 5 days a week. Assembli cuts my time per job by at least 25 minutes. That's real money.",
    name: 'Marcus T.',
    role: 'Furniture Assembler, NYC',
    avatar: 'MT',
    stars: 5,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    quote: "The voice instructions are genuinely magical. My 70-year-old father assembled a bookshelf without calling me once. That's saying something.",
    name: 'James R.',
    role: 'Software Engineer, Toronto',
    avatar: 'JR',
    stars: 5,
    gradient: 'from-cyan-600 to-green-600',
  },
  {
    quote: "I rented a flat and needed to assemble 8 pieces in a weekend. Finished all of them by Sunday afternoon. The AI never let me make a mistake.",
    name: 'Priya K.',
    role: 'Graduate Student, Manchester',
    avatar: 'PK',
    stars: 5,
    gradient: 'from-pink-600 to-violet-600',
  },
  {
    quote: "The error detection saved me from stripping a cam lock completely on Step 6. It flagged the wrong orientation before I applied force. Brilliant.",
    name: 'Daniel F.',
    role: 'Interior Designer, Sydney',
    avatar: 'DF',
    stars: 5,
    gradient: 'from-orange-600 to-pink-600',
  },
  {
    quote: "I run a small interior fitout company. My guys finish jobs faster and clients stop calling with 'I think something is wrong' — because it isn't.",
    name: 'Anya B.',
    role: 'Fitout Company Owner, Dublin',
    avatar: 'AB',
    stars: 5,
    gradient: 'from-green-600 to-teal-600',
  },
];

export function Testimonials() {
  return (
    <section className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#080812] to-[#050510]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-green-400 text-sm font-bold tracking-widest uppercase mb-4">Testimonials</span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
            Loved by{' '}
            <span className="gradient-text">builders everywhere</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-slate-400 text-sm ml-2">4.9 / 5 from 420 beta users</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array(t.stars).fill(0).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
