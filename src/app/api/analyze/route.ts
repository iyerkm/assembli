import { NextRequest, NextResponse } from 'next/server';

const GEMINI_MODEL = 'gemini-2.0-flash';

const ASSEMBLY_STEPS = [
  { step: 1, instruction: 'Place the base panel flat on the floor with the pre-drilled holes facing up.' },
  { step: 2, instruction: 'Insert two wooden dowels into the holes on the left edge of the base panel.' },
  { step: 3, instruction: 'Align Side Panel A over the left dowels and press down firmly until it clicks.' },
  { step: 4, instruction: 'Insert dowels on the right side, then press Side Panel B down onto them.' },
  { step: 5, instruction: 'Lower the top panel onto both side panels and tighten the cam locks with a coin.' },
  { step: 6, instruction: 'Slide the back panel into the grooves along both sides and the base.' },
  { step: 7, instruction: 'Install each drawer by aligning the runners and sliding in until it clicks.' },
];

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const { imageBase64, mimeType, stepIndex, productName } = await req.json();

    const currentStep = ASSEMBLY_STEPS[stepIndex] ?? ASSEMBLY_STEPS[0];
    const totalSteps = ASSEMBLY_STEPS.length;

    const prompt = `You are an expert AR furniture assembly assistant helping someone assemble a ${productName ?? 'dresser'}.

Current progress: Step ${currentStep.step} of ${totalSteps}
Current instruction: "${currentStep.instruction}"

${imageBase64
  ? 'The user has taken a photo of their workspace. Analyse what you can see and provide targeted guidance.'
  : 'The user has not taken a photo yet. Provide guidance based on the current step instruction only.'}

Respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "observation": "one sentence describing what you see, or 'No image provided' if none",
  "onTrack": true or false,
  "guidance": "a single clear, friendly, encouraging sentence telling them exactly what to do next",
  "tip": "one practical tip for this step, or null",
  "warning": "a concern if something looks wrong, or null"
}`;

    const parts: object[] = [];
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: mimeType ?? 'image/jpeg', data: imageBase64 } });
    }
    parts.push({ text: prompt });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini ${res.status}: ${err.slice(0, 300)}`);
    }

    const data = await res.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ ...result, step: currentStep, totalSteps });
  } catch (err) {
    console.error('[analyze]', err);
    return NextResponse.json({ error: 'Analysis failed', details: String(err) }, { status: 500 });
  }
}
