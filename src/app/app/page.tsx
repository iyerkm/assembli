'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  observation: string;
  onTrack: boolean;
  guidance: string;
  tip: string | null;
  warning: string | null;
  step: { step: number; instruction: string };
  totalSteps: number;
}

interface LogEntry {
  ts: string;
  level: 'info' | 'warn' | 'error' | 'action';
  msg: string;
}

const TOTAL_STEPS = 7;
const PRODUCT = 'IKEA-style 5-Drawer Dresser';

const STEPS = [
  { step: 1, short: 'Base Panel',   instruction: 'Place the base panel flat on the floor with pre-drilled holes facing up.' },
  { step: 2, short: 'Dowels',       instruction: 'Insert two wooden dowels into the holes on the left edge of the base panel.' },
  { step: 3, short: 'Side Panel A', instruction: 'Align Side Panel A over the left dowels and press down firmly until it clicks.' },
  { step: 4, short: 'Side Panel B', instruction: 'Insert dowels on the right side, then press Side Panel B down onto them.' },
  { step: 5, short: 'Top Panel',    instruction: 'Lower the top panel onto both sides and tighten the cam locks with a coin.' },
  { step: 6, short: 'Back Panel',   instruction: 'Slide the back panel into the grooves along both sides and the base.' },
  { step: 7, short: 'Drawers',      instruction: 'Install each drawer by aligning the runners and sliding in until it clicks.' },
];

// ─── Pre-scripted demo responses (investor-grade, realistic) ─────────────────

const DEMO_RESPONSES: AnalysisResult[] = [
  {
    observation: 'Large flat panel positioned on hardwood floor with pre-drilled holes clearly visible along both edges.',
    onTrack: true,
    guidance: 'Perfect — the base panel is flat with holes facing up. You\'re set up exactly right for the next step!',
    tip: 'Check that the pre-drilled holes are facing upward and none are blocked by debris before proceeding.',
    warning: null,
    step: STEPS[0],
    totalSteps: 7,
  },
  {
    observation: 'Two wooden dowels detected, one partially inserted into the left-edge hole, the second ready in hand.',
    onTrack: true,
    guidance: 'Great progress! Push the second dowel in until it sits flush — it should feel snug, not loose.',
    tip: 'Dowels should slide in smoothly. If they resist, check the angle — they should be perfectly perpendicular.',
    warning: null,
    step: STEPS[1],
    totalSteps: 7,
  },
  {
    observation: 'Side Panel A being held above the base, dowel holes appear slightly misaligned with the left-edge dowels.',
    onTrack: false,
    guidance: 'Shift Panel A about 2 cm to the left so the holes line up directly over the dowels, then press down firmly.',
    tip: 'Look for the small alignment arrows embossed near the holes — they show you the correct orientation.',
    warning: 'Dowel holes appear slightly offset. Forcing the panel down could split the wood — align first.',
    step: STEPS[2],
    totalSteps: 7,
  },
  {
    observation: 'Side Panel A locked in place on the left. Two new dowels visible on the right edge ready for Panel B.',
    onTrack: true,
    guidance: 'Excellent! Both right-edge dowels look well-positioned. Lower Panel B straight down and press until you hear the click.',
    tip: 'Press along the full top edge of Panel B simultaneously — applying pressure at just one point can cause a tilt.',
    warning: null,
    step: STEPS[3],
    totalSteps: 7,
  },
  {
    observation: 'Both side panels standing upright. Top panel resting in place but cam locks appear unturned on the right side.',
    onTrack: true,
    guidance: 'Almost there! Use a coin to turn the right-side cam lock 90° clockwise until it stops — you\'ll feel it bite in.',
    tip: 'Tighten cams alternately (left, right, left) rather than fully tightening one side first to keep the panel level.',
    warning: 'Right cam lock appears unturned. The top panel will be unstable until both locks are tightened.',
    step: STEPS[4],
    totalSteps: 7,
  },
  {
    observation: 'Back panel visible, top edge inserted into the groove. Bottom edge not yet seated into the base groove.',
    onTrack: true,
    guidance: 'You\'re close — tilt the bottom edge inward and slide it down into the base groove, then press the full panel flat.',
    tip: 'Start from one corner and work across in a smooth sweep — this prevents the panel from bowing in the middle.',
    warning: null,
    step: STEPS[5],
    totalSteps: 7,
  },
  {
    observation: 'First drawer partially inserted, runner on the left side appears fully engaged, right runner not yet aligned.',
    onTrack: true,
    guidance: 'Lift the drawer slightly to the right to engage the right runner, then slide it all the way in until it clicks.',
    tip: 'All drawers are identical — each one should click in twice (once at half-open, once fully closed).',
    warning: null,
    step: STEPS[6],
    totalSteps: 7,
  },
];

// ─── Step illustrations (CSS art shown during demo scanning) ─────────────────

const STEP_ICONS = ['🪵', '🔩', '🪜', '🪜', '🔝', '🔲', '🗄️'];
const STEP_COLORS = [
  'from-amber-900/40 to-amber-800/20',
  'from-slate-700/40 to-slate-600/20',
  'from-blue-900/40 to-blue-800/20',
  'from-blue-900/40 to-indigo-800/20',
  'from-violet-900/40 to-violet-800/20',
  'from-slate-800/40 to-slate-700/20',
  'from-green-900/40 to-green-800/20',
];

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function AssembliApp() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase]               = useState<'intro' | 'camera' | 'assembling' | 'complete'>('intro');
  const [demoMode, setDemoMode]         = useState(false);
  const [demoScanning, setDemoScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stepIndex, setStepIndex]       = useState(0);
  const [analysis, setAnalysis]         = useState<AnalysisResult | null>(null);
  const [loading, setLoading]           = useState(false);
  const [cameraError, setCameraError]   = useState('');
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [lastCapture, setLastCapture]   = useState<string | null>(null);
  const [showDebug, setShowDebug]       = useState(false);
  const [logs, setLogs]                 = useState<LogEntry[]>([]);
  const logsRef                         = useRef<LogEntry[]>([]);
  const autoAdvanceRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Logger ─────────────────────────────────────────────────────────────────

  const log = useCallback((level: LogEntry['level'], msg: string) => {
    const entry: LogEntry = { ts: new Date().toISOString().slice(11, 23), level, msg };
    console[level === 'action' ? 'log' : level](`[assembli][${level}] ${msg}`);
    logsRef.current = [...logsRef.current.slice(-199), entry];
    setLogs([...logsRef.current]);
  }, []);

  // ── Voice ──────────────────────────────────────────────────────────────────

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) { log('warn', 'SpeechSynthesis not available'); return; }
    log('info', `Speaking: "${text.slice(0, 60)}…"`);
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92; utter.pitch = 1.05; utter.volume = 1.0;
    utter.onstart = () => { setIsSpeaking(true); };
    utter.onend   = () => { setIsSpeaking(false); };
    utter.onerror = (e) => { setIsSpeaking(false); log('error', `Speech error: ${e.error}`); };
    window.speechSynthesis.speak(utter);
  }, [log]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // ── Demo Mode ──────────────────────────────────────────────────────────────

  const runDemoStep = useCallback((idx: number) => {
    log('action', `Demo: scanning step ${idx + 1}`);
    setDemoScanning(true);
    setLoading(true);

    // Simulate AR scanning delay (1.8s)
    setTimeout(() => {
      setDemoScanning(false);
      const result = DEMO_RESPONSES[idx];
      setAnalysis(result);
      setLoading(false);
      setPhase('assembling');
      log('info', `Demo: step ${idx + 1} analysis shown — onTrack=${result.onTrack}`);

      const msg = result.warning
        ? `Watch out — ${result.warning} ${result.guidance}`
        : result.guidance;
      speak(msg);
    }, 1800);
  }, [log, speak]);

  const startDemo = useCallback(() => {
    log('action', 'Starting investor demo mode');
    setDemoMode(true);
    setStepIndex(0);
    setAnalysis(null);
    setCompletedSteps(new Set());
    setPhase('assembling');
    speak('Welcome to Assembli. Watch how AI guides you through furniture assembly step by step.');
    setTimeout(() => runDemoStep(0), 2200);
  }, [log, speak, runDemoStep]);

  const demoNextStep = useCallback((currentIdx: number) => {
    log('action', `Demo next step from ${currentIdx + 1}`);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setCompletedSteps(prev => new Set([...prev, currentIdx]));
    const next = currentIdx + 1;
    if (next >= TOTAL_STEPS) {
      setPhase('complete');
      speak('Assembly complete in just a few minutes with AI guidance. Your furniture is ready.');
      log('info', 'Demo complete');
    } else {
      setStepIndex(next);
      setAnalysis(null);
      runDemoStep(next);
    }
  }, [log, speak, runDemoStep]);

  const demoPrevStep = useCallback((currentIdx: number) => {
    if (currentIdx === 0) return;
    log('action', `Demo prev step from ${currentIdx + 1}`);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    const prev = currentIdx - 1;
    setCompletedSteps(s => { const n = new Set(s); n.delete(prev); return n; });
    setStepIndex(prev);
    setAnalysis(null);
    runDemoStep(prev);
  }, [log, runDemoStep]);

  // ── Camera ─────────────────────────────────────────────────────────────────

  const attachStream = useCallback(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    if (video.srcObject !== stream) {
      log('info', 'Attaching stream to video element');
      video.srcObject = stream;
    }
    video.play().then(() => {
      log('info', `Video playing — ${video.videoWidth}×${video.videoHeight}`);
    }).catch(e => log('error', `video.play() failed: ${e}`));
  }, [log]);

  const startCamera = useCallback(async () => {
    log('action', 'User tapped Enable Camera');
    setCameraError('');
    try {
      log('info', 'Requesting getUserMedia (environment)');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      const tracks = stream.getVideoTracks();
      log('info', `Camera granted — label: "${tracks[0]?.label}" settings: ${JSON.stringify(tracks[0]?.getSettings())}`);
      streamRef.current = stream;
      setCameraActive(true);
      setPhase('camera');
      attachStream();
      speak('Camera ready. Point at your workspace and tap Scan.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log('error', `getUserMedia failed: ${msg}`);
      setCameraError(`Camera error: ${msg}`);
    }
  }, [log, attachStream, speak]);

  const stopCamera = useCallback(() => {
    log('info', 'Stopping camera');
    streamRef.current?.getTracks().forEach(t => { t.stop(); });
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, [log]);

  useEffect(() => {
    if (cameraActive && streamRef.current) {
      log('info', 'Phase effect — re-attaching stream');
      attachStream();
    }
  }, [phase, cameraActive, attachStream, log]);

  useEffect(() => () => {
    stopCamera(); stopSpeaking();
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
  }, [stopCamera, stopSpeaking]);

  // ── Capture + Analyze (real mode) ─────────────────────────────────────────

  const captureAndAnalyze = useCallback(async () => {
    if (demoMode) { runDemoStep(stepIndex); return; }
    log('action', `Scan — step ${stepIndex + 1} cameraActive=${cameraActive}`);
    setLoading(true);
    let base64: string | null = null;

    if (cameraActive && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      log('info', `Video state: readyState=${video.readyState} ${video.videoWidth}×${video.videoHeight} paused=${video.paused}`);
      if (video.readyState < 2) {
        log('warn', 'Video not ready, waiting 500ms…');
        await new Promise(r => setTimeout(r, 500));
        log('info', `After wait: readyState=${video.readyState} ${video.videoWidth}×${video.videoHeight}`);
      }
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = canvasRef.current!;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          base64 = dataUrl.split(',')[1];
          setLastCapture(dataUrl);
          log('info', `Frame captured: ${canvas.width}×${canvas.height} base64len=${base64.length}`);
        } else {
          log('error', 'Failed to get canvas 2d context');
        }
      } else {
        log('warn', `Video dimensions zero — sending no image`);
      }
    } else {
      log('info', 'No camera — text-only request');
    }

    try {
      log('info', `POST /api/analyze stepIndex=${stepIndex} hasImage=${!!base64}`);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg', stepIndex, productName: PRODUCT }),
      });
      log('info', `API response: ${res.status}`);
      if (!res.ok) { const t = await res.text(); log('error', `API error: ${t}`); throw new Error(t); }
      const data: AnalysisResult = await res.json();
      log('info', `Analysis OK onTrack=${data.onTrack} — "${data.guidance?.slice(0, 60)}"`);
      setAnalysis(data);
      setPhase('assembling');
      speak(data.warning ? `${data.warning} ${data.guidance}` : data.guidance);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      log('error', `Analysis failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [demoMode, stepIndex, cameraActive, log, speak, runDemoStep]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const nextStep = useCallback(() => {
    if (demoMode) { demoNextStep(stepIndex); return; }
    log('action', `Next step from ${stepIndex + 1}`);
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    if (stepIndex + 1 >= TOTAL_STEPS) {
      setPhase('complete'); stopCamera();
      speak('Assembly complete! Fantastic work.');
    } else {
      setStepIndex(i => i + 1);
    }
  }, [demoMode, stepIndex, demoNextStep, log, stopCamera, speak]);

  const prevStep = useCallback(() => {
    if (demoMode) { demoPrevStep(stepIndex); return; }
    if (stepIndex > 0) {
      log('action', `Prev step from ${stepIndex + 1}`);
      setCompletedSteps(prev => { const s = new Set(prev); s.delete(stepIndex - 1); return s; });
      setStepIndex(i => i - 1);
    }
  }, [demoMode, stepIndex, demoPrevStep, log]);

  useEffect(() => {
    if (!demoMode && phase === 'assembling') {
      log('info', `Step changed to ${stepIndex + 1} — auto-analyzing`);
      captureAndAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const reset = useCallback(() => {
    log('action', 'Reset app');
    setPhase('intro'); setDemoMode(false); setStepIndex(0);
    setAnalysis(null); setCompletedSteps(new Set()); setLastCapture(null);
    setDemoScanning(false);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    stopCamera(); stopSpeaking();
  }, [log, stopCamera, stopSpeaking]);

  const startWithoutCamera = useCallback(() => {
    log('action', 'Start text-only mode');
    setPhase('assembling');
    captureAndAnalyze();
  }, [log, captureAndAnalyze]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-[#050510] flex flex-col overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} className="hidden" playsInline muted autoPlay
        onLoadedMetadata={() => log('info', `Video metadata: ${videoRef.current?.videoWidth}×${videoRef.current?.videoHeight}`)}
        onPlay={() => log('info', 'Video onPlay fired')}
        onError={(e) => log('error', `Video error: ${JSON.stringify(e)}`)} />

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-5 overflow-y-auto py-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-900/50 glow-violet">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white mb-2">Assembli</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered assembly assistant. Point your camera at furniture parts — AI analyses each step and guides you through with voice.
            </p>
          </div>

          {/* DEMO MODE — highlighted for investor */}
          <div className="w-full max-w-sm">
            <button onClick={startDemo}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-violet-900/50 active:scale-95 transition-transform ring-2 ring-violet-400/30">
              <span className="text-xl">▶</span>
              Run Full Demo
              <span className="ml-1 text-xs font-normal opacity-70 bg-white/10 px-2 py-0.5 rounded-full">investor mode</span>
            </button>
            <p className="text-slate-600 text-xs mt-2 text-center">No camera or furniture needed · full AI flow · voice on</p>
          </div>

          <div className="w-full max-w-sm h-px bg-white/5" />

          <div className="w-full max-w-sm space-y-3">
            <p className="text-slate-600 text-xs text-center uppercase tracking-wider">Or use real camera</p>
            <button onClick={startCamera}
              className="w-full py-3.5 rounded-2xl glass border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Enable Camera + Start
            </button>
            <button onClick={startWithoutCamera}
              className="w-full py-3 rounded-2xl glass border border-white/5 text-slate-500 font-medium text-sm active:scale-95 transition-transform">
              Text-Only Mode (no camera)
            </button>
          </div>

          {cameraError && (
            <div className="w-full max-w-sm p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {cameraError}
            </div>
          )}

          <a href="/" className="text-slate-700 text-xs hover:text-slate-500 transition-colors">← Back to Assembli</a>
        </div>
      )}

      {/* ── CAMERA + ASSEMBLING ── */}
      {(phase === 'camera' || phase === 'assembling') && (
        <div className="flex flex-col h-full">

          {/* Demo banner */}
          {demoMode && (
            <div className="bg-violet-600/20 border-b border-violet-500/30 px-4 py-2 flex items-center justify-between flex-shrink-0" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-300 text-xs font-bold tracking-wider">DEMO MODE</span>
              </div>
              <button onClick={reset} className="text-violet-400 text-xs hover:text-violet-200">Exit</button>
            </div>
          )}

          {/* Step progress bar */}
          <div className={`bg-[#0d0d1a] px-4 pb-3 border-b border-white/5 flex-shrink-0 ${demoMode ? 'pt-3' : 'pt-12'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs">Step {stepIndex + 1} / {TOTAL_STEPS}</span>
              <span className="text-violet-400 text-xs font-semibold">{STEPS[stepIndex]?.short}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${(stepIndex / TOTAL_STEPS) * 100}%` }} />
            </div>
            <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1">
              {STEPS.map((_, i) => (
                <div key={i} className={`flex-shrink-0 h-2 rounded-full transition-all duration-300 ${
                  completedSteps.has(i) ? 'bg-green-400 w-2' : i === stepIndex ? 'bg-violet-400 w-6' : 'bg-white/15 w-2'
                }`} />
              ))}
            </div>
          </div>

          {/* Viewport: demo illustration or live camera */}
          <div className="relative flex-1 overflow-hidden bg-black min-h-0">
            {demoMode ? (
              <DemoViewfinder
                stepIndex={stepIndex}
                scanning={demoScanning}
                loading={loading}
              />
            ) : (
              <CameraViewfinder
                videoRef={videoRef}
                cameraActive={cameraActive}
                lastCapture={lastCapture}
                loading={loading}
              />
            )}

            {/* Status pill */}
            <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur rounded-full border border-violet-500/30">
                <div className={`w-2 h-2 rounded-full ${
                  loading || demoScanning ? 'bg-yellow-400 animate-pulse' :
                  analysis?.onTrack ? 'bg-green-400' : analysis ? 'bg-orange-400' : 'bg-slate-500'
                }`} />
                <span className="text-xs font-bold text-white tracking-wide">
                  {loading || demoScanning ? 'SCANNING…' : analysis?.onTrack ? 'ON TRACK ✓' : analysis ? 'CHECK GUIDANCE' : 'READY'}
                </span>
              </div>
            </div>

            {/* Shutter button — real camera only */}
            {cameraActive && !demoMode && (
              <button onClick={captureAndAnalyze} disabled={loading}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white/80 bg-white/20 backdrop-blur flex items-center justify-center disabled:opacity-50 active:scale-90 transition-transform">
                {loading ? <Spinner size="lg" /> : <div className="w-11 h-11 rounded-full bg-white/40" />}
              </button>
            )}
          </div>

          {/* AI Guidance card */}
          <div className="bg-[#0d0d1a] border-t border-white/5 overflow-y-auto flex-shrink-0" style={{ maxHeight: '50vh' }}>
            {(loading || demoScanning) && !analysis && (
              <div className="p-6 flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-slate-400 text-sm">
                  {demoMode ? 'AI scanning your workspace…' : 'Analysing with Claude AI…'}
                </p>
              </div>
            )}

            {phase === 'camera' && !loading && !demoMode && (
              <div className="p-4">
                <p className="text-slate-400 text-sm text-center mb-3">
                  Point at your workspace, then tap <strong className="text-white">Scan</strong>
                </p>
                <button onClick={captureAndAnalyze}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  📡 Scan & Analyse
                </button>
              </div>
            )}

            {analysis && !demoScanning && (
              <div className="p-4 space-y-3">
                <div className="glass rounded-2xl p-4 border border-violet-500/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{analysis.onTrack ? '✅' : '👀'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-snug">{analysis.guidance}</p>
                      {analysis.observation && analysis.observation !== 'No image provided' && (
                        <p className="text-slate-500 text-xs mt-1.5 italic">AI sees: {analysis.observation}</p>
                      )}
                    </div>
                  </div>
                </div>

                {analysis.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <span className="text-lg">⚠️</span>
                    <p className="text-orange-300 text-xs leading-relaxed">{analysis.warning}</p>
                  </div>
                )}
                {analysis.tip && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                    <span className="text-lg">💡</span>
                    <p className="text-yellow-300/80 text-xs leading-relaxed">{analysis.tip}</p>
                  </div>
                )}
                <div className="p-3 rounded-xl bg-white/3 border border-white/6">
                  <p className="text-slate-600 text-xs uppercase tracking-wide font-bold mb-1">Current step</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{STEPS[stepIndex]?.instruction}</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="px-4 pb-8 pt-1 flex gap-3">
              <button onClick={prevStep} disabled={stepIndex === 0}
                className="flex-shrink-0 p-3.5 glass rounded-xl border border-white/10 text-slate-400 disabled:opacity-30 active:scale-95 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button onClick={() => speak(analysis?.guidance ?? STEPS[stepIndex]?.instruction ?? '')}
                disabled={isSpeaking || (!analysis && !demoMode)}
                className="flex-shrink-0 p-3.5 glass rounded-xl border border-orange-500/20 text-orange-400 active:scale-95 transition-transform disabled:opacity-40">
                {isSpeaking ? (
                  <div className="flex items-end gap-0.5 h-5 w-5">
                    {[3,5,4,5,3].map((h,i) => (
                      <div key={i} className="w-0.5 bg-orange-400 rounded-full animate-pulse" style={{height: h*2, animationDelay: `${i*0.1}s`}} />
                    ))}
                  </div>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
                  </svg>
                )}
              </button>

              {!demoMode && cameraActive && (
                <button onClick={captureAndAnalyze} disabled={loading}
                  className="flex-shrink-0 p-3.5 glass rounded-xl border border-cyan-500/20 text-cyan-400 active:scale-95 transition-transform disabled:opacity-50">
                  {loading ? <Spinner /> : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              )}

              <button onClick={nextStep} disabled={loading || demoScanning}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-violet-900/30 disabled:opacity-60">
                {stepIndex + 1 >= TOTAL_STEPS ? '🏁 Finish' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPLETE ── */}
      {phase === 'complete' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
          <div className="text-7xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🎉</div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Assembly Complete!</h2>
            <p className="text-slate-400">
              {demoMode ? 'Full dresser assembled with AI vision guidance in under 3 minutes.' : 'Built with AI guidance. Nicely done.'}
            </p>
          </div>

          {demoMode && (
            <div className="w-full max-w-sm glass rounded-2xl p-4 border border-violet-500/20 text-left space-y-2">
              <p className="text-violet-400 text-xs font-bold uppercase tracking-wider">What Assembli did</p>
              {[
                '📸 Detected furniture parts via computer vision',
                '🎯 Identified misalignment in Step 3 before damage',
                '⚠️ Caught an unfastened cam lock in Step 5',
                '🔊 Provided real-time voice guidance throughout',
                '✅ Tracked progress across all 7 steps',
              ].map((item, i) => (
                <p key={i} className="text-slate-300 text-xs">{item}</p>
              ))}
            </div>
          )}

          <div className="glass rounded-2xl p-4 border border-green-500/20 w-full max-w-sm text-left">
            <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">Steps completed</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-300 text-xs">{s.short}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            {demoMode && (
              <button onClick={startDemo}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 active:scale-95 transition-transform">
                ▶ Run Demo Again
              </button>
            )}
            <button onClick={reset}
              className="w-full py-3.5 rounded-2xl glass border border-white/10 text-slate-300 font-semibold text-sm active:scale-95 transition-transform">
              {demoMode ? 'Back to Start' : 'Start Over'}
            </button>
            <a href="/"
              className="block w-full py-3.5 rounded-2xl glass border border-white/5 text-slate-500 font-medium text-sm text-center">
              ← Back to Assembli
            </a>
          </div>
        </div>
      )}

      {/* ── DEBUG PANEL ── */}
      <button onClick={() => setShowDebug(v => !v)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-800/90 border border-white/10 text-slate-400 flex items-center justify-center text-sm shadow-lg">
        {showDebug ? '✕' : '⚙'}
      </button>

      {showDebug && (
        <div className="fixed inset-x-0 bottom-16 z-50 mx-3 max-h-64 bg-black/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 flex-shrink-0">
            <span className="text-xs font-mono text-slate-400">Debug ({logs.length})</span>
            <button onClick={() => setLogs([])} className="text-xs text-slate-600 hover:text-slate-400">Clear</button>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-0.5">
            {logs.length === 0 && <p className="text-slate-700 text-xs font-mono p-2">No logs yet</p>}
            {[...logs].reverse().map((l, i) => (
              <div key={i} className={`flex gap-2 text-xs font-mono leading-snug ${
                l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-yellow-400' :
                l.level === 'action' ? 'text-cyan-400' : 'text-slate-500'
              }`}>
                <span className="text-slate-700 flex-shrink-0">{l.ts}</span>
                <span className="break-all">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Demo Viewfinder — animated illustration per step ──────────────────────────

function DemoViewfinder({ stepIndex, scanning, loading }: { stepIndex: number; scanning: boolean; loading: boolean }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${STEP_COLORS[stepIndex]} transition-all duration-700`}>
      {/* Step illustration */}
      <div className="flex flex-col items-center gap-4">
        <div className={`text-8xl transition-all duration-500 ${scanning ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}
          style={{ filter: scanning ? 'blur(1px)' : 'none' }}>
          {STEP_ICONS[stepIndex]}
        </div>
        <div className="text-center">
          <p className="text-white/60 text-xs font-mono tracking-widest uppercase">Step {stepIndex + 1}</p>
          <p className="text-white/80 text-sm font-semibold mt-1">{STEPS[stepIndex]?.short}</p>
        </div>
      </div>

      {/* AR scan overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute inset-8 rounded-2xl">
          {[
            'top-0 left-0 border-t-2 border-l-2',
            'top-0 right-0 border-t-2 border-r-2',
            'bottom-0 left-0 border-b-2 border-l-2',
            'bottom-0 right-0 border-b-2 border-r-2',
          ].map((cls, i) => (
            <div key={i} className={`absolute ${cls} border-cyan-400/70 w-6 h-6 rounded-sm`}
              style={{ [i < 2 ? 'top' : 'bottom']: 0, [i % 2 === 0 ? 'left' : 'right']: 0 }} />
          ))}
        </div>

        {/* Scan line when analysing */}
        {(scanning || loading) && <div className="scan-line" />}

        {/* Bounding box "detection" — shown when not scanning */}
        {!scanning && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-cyan-400/50 rounded-lg"
              style={{ boxShadow: '0 0 20px rgba(34,211,238,0.15) inset' }}>
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-400 text-xs font-mono">DETECTED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CameraViewfinder ──────────────────────────────────────────────────────────

function CameraViewfinder({ videoRef, cameraActive, lastCapture, loading }: {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraActive: boolean;
  lastCapture: string | null;
  loading: boolean;
}) {
  const displayRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const src = videoRef.current;
    const dst = displayRef.current;
    if (!src || !dst || !cameraActive) return;
    const stream = src.srcObject as MediaStream | null;
    if (stream && dst.srcObject !== stream) {
      dst.srcObject = stream;
      dst.play().catch(() => {});
    }
  }, [cameraActive, videoRef]);

  if (!cameraActive && lastCapture) {
    return <img src={lastCapture} alt="Last capture" className="absolute inset-0 w-full h-full object-cover opacity-70" />;
  }
  if (!cameraActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center dot-grid">
        <div className="text-center"><div className="text-5xl mb-3">📦</div>
          <p className="text-slate-500 text-sm">No camera · AI guidance from step text</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <video ref={displayRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay />
      <div className="absolute inset-0 pointer-events-none">
        {loading && <div className="scan-line" />}
        <div className="absolute inset-6 border border-cyan-400/20 rounded-2xl">
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-5 h-5 border-cyan-400/60`}
              style={{ borderTopWidth: i < 2 ? 2 : 0, borderBottomWidth: i >= 2 ? 2 : 0, borderLeftWidth: i%2===0 ? 2 : 0, borderRightWidth: i%2===1 ? 2 : 0 }} />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const s = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <svg className={`${s} animate-spin text-white`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
