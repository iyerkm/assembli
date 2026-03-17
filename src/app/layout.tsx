import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Assembli — AI-Powered AR Assembly Assistant',
  description: 'Stop fumbling with instruction manuals. Point your iPhone at any furniture and let AI guide you step-by-step with AR overlays and voice instructions. Never get stuck again.',
  keywords: ['AR assembly', 'furniture assistant', 'ARKit', 'AI assistant', 'IKEA guide'],
  openGraph: {
    title: 'Assembli — AI-Powered AR Assembly Assistant',
    description: 'Point your iPhone at furniture and let AI guide you through assembly with augmented reality.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e1e3a',
              color: '#f8fafc',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
