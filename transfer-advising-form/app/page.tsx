'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FullFormWizard } from '@/components/FullFormWizard';
import { PartialFormModal } from '@/components/PartialFormModal';

export default function HomePage() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(true);
  const [logoSrc, setLogoSrc] = useState('/images/logos.png');
  const [footerLogoSrc, setFooterLogoSrc] = useState('/images/logos.png');

  return (
    <>
      {/* Hero Section */}
      <div    className="min-h-full relative"
          style={{
            background: 'linear-gradient(180deg, #840029 0%, #BA4F21 50%, #FCB116 100%)',
          }}>

      <div
        className="relative min-h-[450px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero.png)',
        }}
      >
        {/* Dark Blue Navy Overlay */}
        <div 
          className="absolute inset-0 bg-black opacity-60" 
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-16">
          {/* MSU Logo - Top Left */}
          <div className="mb-16">
            <Image
              src={logoSrc}
              alt="Midwestern State University"
              width={200}
              height={80}
              className="w-[200px] h-[70px] object-contain"
              priority
              // onError={() => {
              //   setLogoSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='70'%3E%3Crect fill='%23840029' width='200' height='70'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='white' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EMSU%3C/text%3E%3C/svg%3E");
              // }}
            />

          </div>

          {/* Request Button - Top Right */}
<div className="absolute top-6 right-8">
  <div
    className="group bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-[#840029] transition-all duration-200 hover:shadow-2xl hover:scale-[1.04] cursor-pointer"
  >
    <span className="text-[#840029] font-semibold text-sm md:text-base tracking-wide group-hover:text-black transition-colors">
      Request Information Form
    </span>
  </div>
</div>


          {/* Centered Heading */}
          <div className="text-center mt-10 flex flex-col gap-4">
            <h1
              className="text-5xl font-bold text-white mb-4"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '2px',
              }}
            >
              MIDWESTERN STATE UNIVERSITY
            </h1>
            
            <h2
              className="text-3xl font-semibold text-white"
              style={{
                textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                letterSpacing: '1px',
              }}
            >
              TRANSFER ADVISING FORM
            </h2>
          </div>

          <div className="flex justify-center gap-10 flex-wrap mb-20 mt-10">
            <button
              onClick={() => {
                setShowPartialModal(true);
                setShowFullForm(false);
              }}
              className="min-w-[280px] px-16 py-5 text-xl font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                background: showPartialModal ? 'rgba(252, 177, 22, 1)' : 'rgba(252, 177, 22, 0.9)',
                color: '#840029',
                border: showPartialModal ? '3px solid #840029' : '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(252, 177, 22, 1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                if (!showPartialModal) {
                  e.currentTarget.style.background = 'rgba(252, 177, 22, 0.9)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }
              }}
            >
              Fill partial Form
            </button>

            <button
              onClick={() => {
                setShowFullForm(true);
                setShowPartialModal(false);
              }}
              className="min-w-[280px] px-16 py-5 text-xl font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                background: showFullForm ? 'rgba(252, 177, 22, 1)' : 'rgba(252, 177, 22, 0.9)',
                color: '#840029',
                border: showFullForm ? '3px solid #840029' : '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(252, 177, 22, 1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                if (!showFullForm) {
                  e.currentTarget.style.background = 'rgba(252, 177, 22, 0.9)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }
              }}
            >
              Fill full detail form
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Note */}



      {/* Form Section */}
      <div
        className="min-h-[500px] py-10 relative"
      >
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Forms displayed below buttons */}
          <div className="mt-8">
            {showPartialModal && (
              <div className="bg-white w-[100%] rounded-lg shadow-lg p-8 border-2 border-dashed border-blue-400">
                <PartialFormModal
                  opened={true}
                  onClose={() => setShowPartialModal(false)}
                  onSuccess={() => setShowPartialModal(false)}
                />
              </div>
            )}

            {showFullForm && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <FullFormWizard onBack={() => setShowFullForm(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-12" >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-4">
            <p className="text-white text-lg text-center leading-relaxed">
              We evaluate your transfer eligibility, estimate the credit hours required for your chosen destination, 
              and highlight opportunities such as transfer merit scholarships and in-state tuition advantages available 
              to both international and domestic applicants.
            </p>
            <p className="text-sm text-center leading-relaxed" style={{ color: '#FCB116' }}>
              If you&apos;d like to apply to a preferred university, you can explore programs and begin your application through our online portal{' '}
              <span className="font-bold underline cursor-pointer">
                www.abroadaxis.com
              </span>
              . For a quick eligibility check, please complete the short form below, and our team will contact you with personalized feedback. 
              You may also reach us directly at{' '}
              <span className="font-bold">
                admissions@abroadaxis.com
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* MSU Footer Logo */}
      <div className="py-4" >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-center">
            <Image
              src={footerLogoSrc}
              alt="Midwestern State University"
              width={200}
              height={50}
              className="w-[200px] h-[200px] object-contain"
              onError={() => {
                setFooterLogoSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='50'%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23FCB116' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EMIDWESTERN%3C/text%3E%3C/svg%3E");
              }}
            />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
