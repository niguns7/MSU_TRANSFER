'use client';

import Link from 'next/link';
import { useEffect, Suspense } from 'react';

export const dynamic = 'force-dynamic';

function SuccessContent() {
  // Track Lead conversion when success page loads for Transfer Advising Form
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="relative max-w-2xl w-full text-center p-10 rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #7B0E2F 0%, #A13A1F 35%, #F7B500 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}>
        {/* animated glowing circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 animate-pulse-slow" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(252,177,22,0.45), transparent 40%)' }} />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-20 animate-blob" style={{ background: 'radial-gradient(circle at 70% 70%, rgba(132,0,41,0.35), transparent 40%)' }} />

        <h1 className="text-4xl font-extrabold text-white mb-4">Transfer Advising Form Submitted!</h1>
        <p className="text-white/90 mb-6">Thank you for completing the full transfer advising form. A member of our team will review your information and reach out to you soon.</p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="inline-block bg-white text-msuRed font-semibold px-6 py-3 rounded-lg shadow hover:opacity-95 transition">Return Home</Link>
        </div>

        {/* confetti-ish check mark */}
        <div className="absolute -top-10 -right-10 w-32 h-32 flex items-center justify-center">
          <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-pop">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FCB116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root { --msu-red: #7B0E2F; --msu-gold: #FCB116; }
        .text-msuRed { color: var(--msu-red); }
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-20px, 10px) scale(1.05); }
          66% { transform: translate(20px, -10px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-pulse-slow { animation: pulse 4s infinite; }
        @keyframes pulse { 0%{ opacity: .2 } 50%{ opacity: .5 } 100%{ opacity: .2 } }
        .animate-pop { animation: pop .9s ease both; }
        @keyframes pop { 0%{ transform: scale(.6); opacity:0 } 60%{ transform: scale(1.05); opacity:1 } 100%{ transform: scale(1); opacity:1 } }
      `}</style>
    </main>
  );
}

export default function TransferAdvisingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
