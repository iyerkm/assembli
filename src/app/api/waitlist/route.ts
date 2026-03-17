import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.csv');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(WAITLIST_FILE)) fs.writeFileSync(WAITLIST_FILE, 'email,name,plan,timestamp\n');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name = '', plan = 'builder' } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    ensureDataDir();

    // Check for duplicate
    const existing = fs.readFileSync(WAITLIST_FILE, 'utf-8');
    if (existing.includes(email)) {
      return NextResponse.json({ message: "You're already on the list! We'll be in touch soon." }, { status: 200 });
    }

    const row = `${email},${name.replace(/,/g, '')},${plan},${new Date().toISOString()}\n`;
    fs.appendFileSync(WAITLIST_FILE, row);

    // Read current count
    const count = existing.split('\n').filter(l => l.includes('@')).length + 1;

    return NextResponse.json({
      message: `You're #${count} on the waitlist! We'll reach out when Assembli launches.`,
      count,
    });
  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    ensureDataDir();
    const content = fs.readFileSync(WAITLIST_FILE, 'utf-8');
    const count = content.split('\n').filter(l => l.includes('@')).length;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
