'use client';

import Link from 'next/link';
import { useEffect, Suspense } from 'react';

export const dynamic = 'force-dynamic';

function SuccessContent() {
  // Track Lead conversion when success page loads for Initial Form
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, rgba(123, 14, 47, 0.05) 0%, rgba(247, 181, 0, 0.1) 100%)',
    }}>
      <div className="relative max-w-3xl w-full text-center p-12 rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #7B0E2F 0%, #A13A1F 35%, #F7B500 100%)',
        boxShadow: '0 20px 60px rgba(123, 14, 47, 0.3)',
      }}>
        {/* Animated background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 animate-pulse-slow" 
             style={{ background: 'radial-gradient(circle at 30% 30%, rgba(252,177,22,0.5), transparent 50%)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20 animate-blob" 
             style={{ background: 'radial-gradient(circle at 70% 70%, rgba(132,0,41,0.4), transparent 50%)' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-10 animate-spin-slow" 
             style={{ 
               background: 'conic-gradient(from 0deg, transparent, rgba(252,177,22,0.3), transparent)',
               transform: 'translate(-50%, -50%)',
             }} />

        {/* Success icon with animation */}
        <div className="relative z-10 mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-full backdrop-blur-sm animate-pop mb-6">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="animate-check-draw">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
              <path 
                d="M8 12l3 3 5-5" 
                stroke="#FCB116" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="check-mark"
              />
            </svg>
          </div>
        </div>

        {/* Success message */}
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-4 animate-fade-in-up">
            🎉 Thank You!
          </h1>
          <h2 className="text-2xl font-semibold text-white/95 mb-6 animate-fade-in-up-delay-1">
            Your Transfer Advising Form Has Been Submitted
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
            We&apos;ve received your information successfully! 
            <strong className="text-yellow-300"> Check your email for a link to complete the full transfer form.</strong> Our admissions team will then review your complete application and provide personalized feedback about your transfer eligibility 
            and opportunities available to you at Midwestern State University.
          </p>

          {/* Info cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-10 animate-fade-in-up-delay-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-2">📧</div>
              <p className="text-white/90 text-sm font-medium">Check your email now</p>
              <p className="text-white/70 text-xs mt-1">Complete the full transfer form</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-2">📞</div>
              <p className="text-white/90 text-sm font-medium">We&apos;ll reach out</p>
              <p className="text-white/70 text-xs mt-1">Personalized guidance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-2">🎓</div>
              <p className="text-white/90 text-sm font-medium">Transfer ready</p>
              <p className="text-white/70 text-xs mt-1">Start your journey</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-white text-[#7B0E2F] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Return Home
            </Link>
            <a 
              href="https://www.abroadinst.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/40 hover:bg-white/30 hover:scale-105 transition-all duration-300"
            >
              Explore Programs
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Contact info */}
          <div className="mt-10 pt-8 border-t border-white/20 animate-fade-in-up-delay-5">
            <p className="text-white/80 text-sm">
              Questions? Contact us at <strong className="text-white">admissions@abroadinst.com</strong>
            </p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute top-4 right-4 w-20 h-20 border-4 border-white/40 rounded-full animate-ping-slow" />
          <div className="absolute top-8 right-8 w-12 h-12 border-4 border-[#FCB116] rounded-full" />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-20px, 15px) scale(1.1); }
          50% { transform: translate(20px, -15px) scale(0.9); }
          75% { transform: translate(-15px, -10px) scale(1.05); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes check-draw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-pop { animation: pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-up-delay-1 { animation: fade-in-up 0.8s ease-out 0.2s both; }
        .animate-fade-in-up-delay-2 { animation: fade-in-up 0.8s ease-out 0.4s both; }
        .animate-fade-in-up-delay-3 { animation: fade-in-up 0.8s ease-out 0.6s both; }
        .animate-fade-in-up-delay-4 { animation: fade-in-up 0.8s ease-out 0.8s both; }
        .animate-fade-in-up-delay-5 { animation: fade-in-up 0.8s ease-out 1s both; }
        
        .check-mark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: check-draw 0.6s ease-out 0.3s forwards;
        }
      `}</style>
    </main>
  );
}

export default function InitialFormSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
