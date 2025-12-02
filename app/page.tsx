"use client";

import { useState } from "react";
import Image from "next/image";
import { FullFormWizard } from "@/components/FullFormWizard";
import { PartialFormModal } from "@/components/PartialFormModal";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [showFullForm, setShowFullForm] = useState(false);
  const [showPartialModal, setShowPartialModal] = useState(true);
  const [logoSrc, setLogoSrc] = useState("/images/logos.png");
  const [footerLogoSrc, setFooterLogoSrc] = useState("/images/logos.png");

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/9779866590393"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Hero Section */}
      <div
        className="min-h-full relative"
        style={{
          background:
            "linear-gradient(180deg, #840029 0%, #BA4F21 50%, #FCB116 100%)",
        }}
      >
        <div
          className="relative min-h-[350px] sm:min-h-[450px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/hero.png)",
          }}
        >
          {/* Dark Blue Navy Overlay */}
          <div className="absolute inset-0 bg-black opacity-70" />

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

            {/* Centered Heading */}
            <div className="text-center mt-2 sm:mt-10 flex flex-col gap-2 sm:gap-4">
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 px-4"
                style={{
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  letterSpacing: "1px",
                }}
              >
                MIDWESTERN STATE UNIVERSITY
              </h1>

              <h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-white px-4"
                style={{
                  textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
                  letterSpacing: "0.5px",
                }}
              >
                International Transfer Advising Form
              </h2>
            </div>

            <div className="flex justify-center gap-4 sm:gap-10 flex-wrap mb-12 sm:mb-20 mt-6 sm:mt-10 px-4">
              {/* <div
                onClick={() => {
                  setShowPartialModal(true);
                  setShowFullForm(false);
                }}
                className="group bg-[#840029] opacity-70 backdrop-blur-md px-3 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg border-2 border-[#840029] transition-all duration-200 hover:shadow-2xl hover:scale-[1.04] cursor-pointer"
              >
                <span className="text-[#fff] font-semibold text-xs sm:text-sm md:text-lg tracking-wide group-hover:text-white transition-colors">
                  <span className="hidden sm:inline">
                    Request for information
                  </span>
                  <span className="sm:hidden">Request Info</span>
                </span>
              </div> */}

              {/* <div
                onClick={() => {
                  setShowFullForm(true);
                  setShowPartialModal(false);
                }}
                className="group bg-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg border-2 border-[#840029] transition-all duration-200 hover:shadow-2xl hover:scale-[1.04] cursor-pointer"
              >
                <span className="text-[#840029] font-semibold text-xs sm:text-sm md:text-lg tracking-wide group-hover:text-black transition-colors">
                  <span className="hidden sm:inline">
                    Transfer Advising Form
                  </span>
                  <span className="sm:hidden">Transfer Advising</span>
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-4"></div>

        {/* Form Section */}
        <div className="min-h-[300px] sm:min-h-[500px] py-3 sm:py-10 relative px-4">
          <p className="text-2xl text-center font-semibold text-white">
            Please provide your details as in I-20/passport.{" "}
          </p>
          <div className="container mx-auto max-w-6xl">
            {/* Forms displayed below buttons */}
            <div className="mt-4 sm:mt-8">
              {showPartialModal && (
                <div className="bg-white w-full rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
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
                We evaluate your transfer eligibility, estimate the credit hours
                required for your chosen destination, and highlight
                opportunities such as transfer merit scholarships and in-state
                tuition advantages available to both international and domestic
                applicants.
              </p>
              <p
                className="text-xs sm:text-sm text-center leading-relaxed px-2"
                style={{ color: "#FCB116" }}
              >
                If you&apos;d like to apply to a preferred university, you can
                explore programs and begin your application through our online
                portal{" "}
                <span className="font-bold underline cursor-pointer">
                  www.abroadaxis.com
                </span>
                . For a quick eligibility check, please complete the short form
                below, and our team will contact you with personalized feedback.
                You may also reach us directly at{" "}
                <span className="font-bold">admissions@abroadaxis.com</span>
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
                  setFooterLogoSrc(
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='50'%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23FCB116' font-weight='bold' text-anchor='middle' dominant-baseline='middle'%3EMIDWESTERN%3C/text%3E%3C/svg%3E"
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
