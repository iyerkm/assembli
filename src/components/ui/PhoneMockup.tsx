'use client';

import { useState, useEffect } from 'react';

type Screen = 'scan' | 'detect' | 'guide';

const screens: { id: Screen; label: string; icon: string }[] = [
  { id: 'scan',   label: 'Room Scan',      icon: '📡' },
  { id: 'detect', label: 'Part Detection', icon: '🔍' },
  { id: 'guide',  label: 'AR Guidance',    icon: '✨' },
];

export function PhoneMockup({ autoPlay = true }: { autoPlay?: boolean }) {
  const [active, setActive] = useState<Screen>('scan');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const order: Screen[] = ['scan', 'detect', 'guide'];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % order.length;
      setIsTransitioning(true);
      setTimeout(() => { setActive(order[i]); setIsTransitioning(false); }, 200);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Tab selector */}
      <div className="flex gap-1 p-1 glass rounded-2xl">
        {screens.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              active === s.id
                ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div className="relative animate-float">
        {/* Glow behind phone */}
        <div className="absolute inset-0 blur-3xl scale-75 opacity-50 bg-gradient-to-b from-violet-600 to-blue-600 rounded-full" />

        {/* Phone shell */}
        <div className="relative w-[260px] rounded-[3rem] bg-[#111] border-4 border-[#2a2a3a] shadow-2xl overflow-hidden"
          style={{ height: '520px' }}>

          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#111] rounded-b-2xl z-30" />

          {/* Status bar */}
          <div className="absolute top-1 left-6 right-6 flex justify-between items-center z-20 pt-1">
            <span className="text-[10px] text-white/60 font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end">
                {[3,4,5,4].map((h,i) => <div key={i} className="w-0.5 bg-white/50 rounded-sm" style={{height: h}} />)}
              </div>
              <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none"/>
              </svg>
              <div className="w-5 h-2.5 rounded-sm border border-white/30 flex items-center px-0.5">
                <div className="w-3/4 h-full bg-green-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {active === 'scan'   && <ScanScreen />}
            {active === 'detect' && <DetectScreen />}
            {active === 'guide'  && <GuideScreen />}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full z-30" />
        </div>
      </div>
    </div>
  );
}

// ── Screen 1: Room Scanning ───────────────────────────────────────────────────

function ScanScreen() {
  return (
    <div className="relative w-full h-full bg-[#0a0a14] overflow-hidden">
      {/* Camera-like background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1f] via-[#0a1020] to-[#050510]" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Mesh wireframe lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 260 520">
        <g stroke="rgba(34,211,238,0.6)" strokeWidth="0.8" fill="none">
          {[60,120,180,240,300,360,420].map(y =>
            <line key={y} x1="0" y1={y} x2="260" y2={y} />
          )}
          {[0,40,80,120,160,200,240].map(x =>
            <line key={x} x1={x} y1="0" x2={x+60} y2="520" />
          )}
        </g>
        {/* Detected plane highlight */}
        <polygon points="30,300 90,260 200,270 230,330 160,370 40,360"
          stroke="rgba(34,211,238,0.9)" strokeWidth="1.5" fill="rgba(34,211,238,0.08)" />
        {[{x:30,y:300},{x:90,y:260},{x:200,y:270},{x:230,y:330}].map((p,i) =>
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgba(34,211,238,0.8)" />
        )}
      </svg>

      {/* Top label */}
      <div className="absolute top-12 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-[10px] font-bold tracking-wider">SCANNING ROOM</span>
        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-24 left-5 right-5">
        <div className="flex justify-between text-[9px] text-slate-400 mb-1.5">
          <span>Environment Map</span><span>72%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[72%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        </div>
        <p className="text-[9px] text-slate-500 mt-2 text-center">Move camera slowly around workspace</p>
      </div>

      {/* Workspace detected badge */}
      <div className="absolute bottom-14 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/20 border border-green-500/40">
          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-[9px] text-green-400 font-semibold">Workspace Detected</span>
        </div>
      </div>
    </div>
  );
}

// ── Screen 2: Part Detection ──────────────────────────────────────────────────

function DetectScreen() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* "Camera" background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1408] to-[#0d0d1a]" />

      {/* Floor texture */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1a1205]/80 to-transparent" />

      {/* Detected part 1 — base panel */}
      <div className="absolute top-28 left-8 w-[100px] h-[30px]">
        <div className="w-full h-full border-2 border-violet-500 ar-box rounded-sm relative bg-violet-500/10">
          <div className="absolute -top-5 left-0 right-0 flex items-center justify-between">
            <span className="text-[8px] text-violet-400 font-bold bg-violet-900/80 px-1.5 py-0.5 rounded">Base Panel</span>
            <span className="text-[8px] text-green-400 font-bold">97%</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-1 rounded-full bg-violet-400" />
          </div>
        </div>
      </div>

      {/* Detected part 2 — side panel A */}
      <div className="absolute top-44 right-10 w-[28px] h-[80px]">
        <div className="w-full h-full border-2 border-blue-400 ar-box rounded-sm bg-blue-400/10 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[8px] text-blue-400 font-bold bg-blue-900/80 px-1.5 py-0.5 rounded">Side A</span>
          </div>
        </div>
      </div>

      {/* Detected part 3 — dowels */}
      <div className="absolute top-60 left-16 flex gap-2">
        {[0,1].map(i => (
          <div key={i} className="w-3 h-10 border-2 border-cyan-400 ar-box rounded-full bg-cyan-400/10" />
        ))}
        <span className="absolute -bottom-5 left-0 text-[8px] text-cyan-400 font-bold whitespace-nowrap">Dowels ×2</span>
      </div>

      {/* Top label */}
      <div className="absolute top-12 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-400 text-[10px] font-bold tracking-wider">AI DETECTION ACTIVE</span>
        </div>
      </div>

      {/* Parts summary */}
      <div className="absolute bottom-16 left-5 right-5 space-y-1.5">
        {[
          { name: 'Base Panel', ok: true },
          { name: 'Side Panel A', ok: true },
          { name: 'Dowels ×2', ok: true },
          { name: 'Side Panel B', ok: false },
        ].map(p => (
          <div key={p.name} className="flex items-center justify-between glass rounded-lg px-3 py-1.5">
            <span className="text-[9px] text-slate-300">{p.name}</span>
            {p.ok
              ? <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[8px] text-green-400">Found</span></div>
              : <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /><span className="text-[8px] text-slate-500">Searching…</span></div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: AR Guidance ─────────────────────────────────────────────────────

function GuideScreen() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Camera bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] to-[#080812]" />

      {/* Dresser outline (ghost of assembled furniture) */}
      <svg className="absolute left-1/2 top-20 -translate-x-1/2 opacity-20" width="140" height="160" viewBox="0 0 140 160" fill="none">
        <rect x="10" y="120" width="120" height="12" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" fill="rgba(167,139,250,0.05)" />
        <rect x="10" y="10" width="12" height="110" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" fill="rgba(167,139,250,0.05)" />
        <rect x="118" y="10" width="12" height="110" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" fill="rgba(167,139,250,0.05)" />
        <rect x="10" y="10" width="120" height="12" stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" fill="rgba(167,139,250,0.05)" />
        {[38, 66, 94].map(y => (
          <rect key={y} x="22" y={y} width="96" height="22" stroke="rgba(100,116,139,0.4)" strokeWidth="1" rx="1" fill="rgba(167,139,250,0.02)" />
        ))}
      </svg>

      {/* Attachment point glow sphere */}
      <div className="absolute top-36 left-[54px]">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 border-2 border-violet-400 animate-pulse-glow flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
          {/* Downward arrow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
            {[0,1,2].map(i => (
              <svg key={i} className="w-3 h-2 text-violet-400" style={{opacity: 1 - i*0.25}} fill="currentColor" viewBox="0 0 12 8">
                <path d="M6 8L0 0h12L6 8z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Step instruction card */}
      <div className="absolute bottom-20 left-4 right-4">
        <div className="glass rounded-2xl p-3 border border-violet-500/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600/30 border border-violet-500/40">
              <span className="text-[8px] text-violet-400 font-bold">STEP 3 / 7</span>
            </div>
            {/* Voice indicator */}
            <div className="ml-auto flex items-end gap-0.5 h-4">
              {[2,4,3,5,2,4].map((h,i) => (
                <div key={i} className="w-0.5 bg-violet-400 rounded-full animate-pulse"
                  style={{height: h*2, animationDelay: `${i*0.1}s`}} />
              ))}
            </div>
          </div>
          <p className="text-white text-[11px] font-medium leading-snug">
            Align Side Panel A over the left dowels and press down firmly until it clicks.
          </p>
          {/* Tip */}
          <p className="text-[9px] text-yellow-400/80 mt-1.5 flex items-center gap-1">
            <span>💡</span>Side Panel A has the label on the inside face.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-8 left-4 right-4 flex gap-2">
        <button className="flex-1 py-2 glass rounded-xl text-[9px] text-orange-400 font-semibold border border-orange-500/30 text-center">
          🔁 Repeat
        </button>
        <button className="flex-1 py-2 rounded-xl text-[9px] text-white font-semibold text-center bg-gradient-to-r from-violet-600 to-blue-600">
          Next Step →
        </button>
      </div>

      {/* Top label */}
      <div className="absolute top-12 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-400 text-[10px] font-bold tracking-wider">AR GUIDANCE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
