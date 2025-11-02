'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FullFormWizard } from '@/components/FullFormWizard';
import { PartialFormModal } from '@/components/PartialFormModal';

export default function HomePage() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/logos.png');
  const [footerLogoSrc, setFooterLogoSrc] = useState('/images/logos.png');

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-full relative"
          style={{
            background: 'linear-gradient(180deg, #840029 0%, #BA4F21 50%, #FCB116 100%)',
          }}>

      <div
        className="relative min-h-[350px] sm:min-h-[450px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero.png)',
        }}
      >
        {/* Dark Blue Navy Overlay */}
        <div 
          className="absolute inset-0 bg-black opacity-60" 
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 sm:py-16">
          {/* MSU Logo - Top Left */}
          <div className="mb-8 sm:mb-16">
            <Image
              src={logoSrc}
              alt="Midwestern State University"
              width={200}
              height={80}
              className="w-[140px] sm:w-[180px] md:w-[200px] h-auto object-contain"
              priority
            />
          </div>

          {/* Request Button - Top Right */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-8">
            <div
              className="group bg-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg border-2 border-[#840029] transition-all duration-200 hover:shadow-2xl hover:scale-[1.04] cursor-pointer"
            >
              <span className="text-[#840029] font-semibold text-xs sm:text-sm md:text-base tracking-wide group-hover:text-black transition-colors">
                <span className="hidden sm:inline">Request Information Form</span>
                <span className="sm:hidden">Request Info</span>
              </span>
            </div>
          </div>

          {/* Centered Heading */}
          <div className="text-center mt-6 sm:mt-10 flex flex-col gap-2 sm:gap-4">
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 px-4"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '1px',
              }}
            >
              MIDWESTERN STATE UNIVERSITY
            </h1>
            
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-white px-4"
              style={{
                textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                letterSpacing: '0.5px',
              }}
            >
              TRANSFER ADVISING FORM
            </h2>
          </div>

          <div className="flex justify-center gap-4 sm:gap-10 flex-wrap mb-12 sm:mb-20 mt-6 sm:mt-10 px-4">
            <button
              onClick={() => {
                setShowPartialModal(true);
                setShowFullForm(false);
              }}
              className="w-full sm:w-auto min-w-[200px] sm:min-w-[280px] px-8 sm:px-16 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
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
              className="w-full sm:w-auto min-w-[200px] sm:min-w-[280px] px-8 sm:px-16 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
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
      <div className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div
            className="bg-white p-4 sm:p-6 rounded-md shadow-md flex flex-col gap-2"
            style={{
              border: '2px solid #f0f0f0',
              borderLeft: '6px solid #3b5998',
            }}
          >
            <p className="text-lg sm:text-2xl font-bold mb-2" style={{ color: '#3b5998' }}>
              Privacy Note:
            </p>
            <p className="text-base sm:text-xl leading-relaxed" style={{ color: '#5C5959' }}>
              Your information will be used only to process admission-related requests and to support your academic journey. 
              We will not share your data with third parties for any non-academic purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div
        className="min-h-[300px] sm:min-h-[500px] py-6 sm:py-10 relative px-4"
      >
        <div className="container mx-auto max-w-6xl">

          {/* Forms displayed below buttons */}
          <div className="mt-4 sm:mt-8">
            {showPartialModal && (
              <div className="bg-white w-full rounded-lg shadow-lg p-4 sm:p-6 md:p-8 border-2 border-dashed border-blue-400">
                <PartialFormModal
                  opened={true}
                  onClose={() => setShowPartialModal(false)}
                  onSuccess={() => setShowPartialModal(false)}
                />
              </div>
            )}

            {showFullForm && (
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
                <FullFormWizard onBack={() => setShowFullForm(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-4">
            <p className="text-white text-base sm:text-lg text-center leading-relaxed px-2">
              We evaluate your transfer eligibility, estimate the credit hours required for your chosen destination, 
              and highlight opportunities such as transfer merit scholarships and in-state tuition advantages available 
              to both international and domestic applicants.
            </p>
            <p className="text-xs sm:text-sm text-center leading-relaxed px-2" style={{ color: '#FCB116' }}>
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
      <div className="py-4 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-center">
            <Image
              src={footerLogoSrc}
              alt="Midwestern State University"
              width={200}
              height={50}
              className="w-[120px] sm:w-[150px] md:w-[200px] h-auto object-contain"
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
