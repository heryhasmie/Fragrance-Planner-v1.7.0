import React, { useState } from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    if (isExiting) return;
    
    // Play sound effect at full volume
    const audio = document.getElementById('splash-audio') as HTMLAudioElement;
    if (audio) {
      audio.volume = 1.0;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }

    setIsExiting(true);
    setTimeout(() => {
      onStart();
    }, 1400); // Allow exit animations to finish
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 cursor-pointer overflow-hidden transition-all duration-[1200ms] ease-in-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      onClick={handleClick}
    >
      {/* Audio element preloaded for instant playback */}
      <audio id="splash-audio" src="https://docs.google.com/uc?export=download&id=1-tBsuGTfq0kVNlgnmJXxvN2k1HgkhfTO" preload="auto" />

      {/* Theme-based solid background */}
      <div className="absolute inset-0 z-0 bg-app-bg" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col w-full h-full max-w-7xl gap-6 sm:gap-8 justify-between py-4">

        {/* Top Floating Pill (Aesthetic Nav) */}
        <div className={`flex justify-between items-center w-full rounded-full border border-app-border bg-app-bg/40 backdrop-blur-2xl px-6 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? 'opacity-0 blur-xl scale-105 -translate-y-8 z-0' : 'opacity-100 blur-0 scale-100 translate-y-0 z-10 animate-in slide-in-from-top-12 duration-1000 delay-[100ms] fill-mode-both'
        }`}>
          <div className="flex items-center gap-8 text-app-text/90 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase">
            <span className="font-black text-app-text tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-app-accent animate-pulse" />
              FP<span className="opacity-50">®</span>
            </span>
            <span className="hidden sm:inline hover:text-app-accent transition-colors">V1.9</span>
            <span className="hidden md:inline hover:text-app-accent transition-colors">Fragrance Planner</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-app-text/50 text-[10px] tracking-[0.3em] uppercase">
              Global Platform
            </div>
            <div className="w-8 h-8 rounded-full border border-app-border flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-app-text" />
            </div>
          </div>
        </div>

        {/* Main Center Glass Card */}
        <div className={`relative flex flex-col lg:flex-row items-center lg:items-center justify-between w-full h-full lg:h-auto rounded-[2rem] sm:rounded-[3rem] border border-app-border bg-app-bg/40 backdrop-blur-[40px] p-8 sm:p-12 lg:p-20 gap-12 lg:gap-24 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] flex-grow ${
          isExiting ? 'opacity-0 blur-2xl scale-105 delay-[100ms] z-0' : 'opacity-100 blur-0 scale-100 z-10 animate-in slide-in-from-left-12 duration-1000 delay-[200ms] fill-mode-both'
        }`}>

          {/* Left: Glass Bottle Image/Icon Block */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto lg:mx-0 text-app-accent z-10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-app-bg/60 to-app-bg/0 rounded-[2rem] border border-app-border backdrop-blur-md shadow-2xl p-8 transform group-hover:scale-105 transition-transform duration-700 ease-out">
                {/* SVG Bottle customized for glass look */}
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]">
                  {/* Spray lines */}
                  <path d="M 58 17 L 68 12" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 60 21 L 70 21" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 58 25 L 68 31" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Nozzle top */}
                  <rect x="42" y="11" width="16" height="15" fill="currentColor" rx="1.5"/>
                  <circle cx="52" cy="16" r="2.5" className="fill-transparent" stroke="none" />

                  {/* Neck */}
                  <rect x="37" y="27" width="26" height="10" fill="currentColor" rx="1"/>
                  <rect x="48.5" y="37" width="3" height="8" fill="currentColor" stroke="none"/>

                  {/* Bottle body outline */}
                  <path d="M 18 43 C 18 39.5 21 37 24.5 37 L 75.5 37 C 79 37 82 39.5 82 43 L 82 92 C 82 95.5 79 98 75.5 98 L 24.5 98 C 21 98 18 95.5 18 92 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2.5" />

                  {/* Liquid (Sem-transparent) */}
                  <path d="M 28 55 L 72 55 L 72 87 C 72 89 70 91 68 91 L 32 91 C 30 91 28 89 28 87 Z" fill="currentColor" stroke="none" fillOpacity="0.8" />

                  {/* Tube inside */}
                  <rect x="48.5" y="43" width="3" height="42" className="fill-app-bg/50 mix-blend-overlay" stroke="none" />
                </svg>
              </div>

              {/* Reflection/Glow below bottle */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-app-accent/20 blur-2xl rounded-full opacity-50" />
            </div>

            {/* Spec / Details Block (Like the reference image) */}
            <div className="hidden lg:grid grid-cols-2 gap-x-4 gap-y-6 text-[10px] uppercase tracking-[0.2em] font-sans text-app-text/50 relative z-10 border-l border-app-border pl-6">
              <div>
                <span className="block text-app-text mb-1">Architecture</span>
                Version 1.9
              </div>
              <div>
                <span className="block text-app-text mb-1">Created By</span>
                Sengeh Fragrance
              </div>
              <div className="col-span-2">
                <span className="block text-app-text mb-1">Details</span>
                Professional Grade Formula System<br/>
                For Master Perfumers
              </div>
            </div>
          </div>

          {/* Right: Typography Identity */}
          <div className="flex flex-col justify-center flex-1 w-full text-app-text z-10 pt-4 lg:pt-0">
            {/* Title: FRAGRANCE */}
            <h1 className="text-[12vw] sm:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-black leading-[0.9] tracking-tight text-app-accent mb-0 drop-shadow-sm">
              FRAGRANCE
            </h1>

            {/* Subtitle: PLANNER */}
            <div className="text-[10vw] sm:text-6xl lg:text-[5.5rem] xl:text-[7rem] font-light leading-[0.9] tracking-[0.1em] text-app-text/90 mb-8 sm:mb-12">
              PLANNER
            </div>

            <div className="h-px bg-gradient-to-r from-app-border via-app-border/50 to-transparent w-full max-w-lg mb-8 sm:mb-12" />

            {/* FOR PERFUMER */}
            <div className="flex justify-between items-center w-full max-w-md text-app-accent font-bold text-sm sm:text-lg lg:text-xl uppercase tracking-[0.4em] sm:tracking-[0.6em]">
              <span>FOR</span>
              <span className="text-app-text/70">PERFUMER</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Pill (Call to action) */}
        <div className={`flex flex-col sm:flex-row justify-between items-center w-full rounded-full border border-app-border bg-app-bg/40 backdrop-blur-2xl px-4 py-3 sm:py-4 sm:px-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isExiting ? 'opacity-0 blur-xl scale-105 translate-y-8 delay-[200ms] z-0' : 'opacity-100 blur-0 scale-100 translate-y-0 z-10 animate-in slide-in-from-bottom-12 duration-1000 delay-[300ms] fill-mode-both'
        }`}>
          {/* Subtle branding/info left side */}
          <div className="hidden sm:flex items-center gap-4 pl-4">
             <div className="w-10 h-10 rounded-full border border-app-border flex items-center justify-center overflow-hidden relative text-app-accent bg-app-bg/50">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                 <path d="M10 2v4.5l-6.5 10A2 2 0 0 0 5 20h14a2 2 0 0 0 1.5-3.5L14 6.5V2"/>
                 <path d="M8.5 2h7"/>
                 <path d="M14 16H6.5"/>
               </svg>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-app-text/50 tracking-[0.2em] uppercase">Edition</span>
               <span className="text-xs text-app-text font-medium tracking-[0.2em] uppercase">For Creator</span>
             </div>
          </div>

          {/* Action button right side */}
          <div className="flex items-center gap-4 rounded-full bg-app-text hover:bg-app-text/90 transition-colors border border-transparent pl-6 pr-2 py-2 sm:py-2 group">
            <div className="flex gap-2 text-app-bg font-medium tracking-[0.2em] uppercase text-[10px] sm:text-xs">
              <span className="animate-pulse">Click</span>
              <span className="text-app-bg/80">anywhere</span>
              <span className="hidden sm:inline">to</span>
              <span className="hidden sm:inline text-app-bg/80">start</span>
            </div>
            <div className="ml-2 w-8 h-8 rounded-full bg-app-bg flex items-center justify-center text-app-text group-hover:scale-105 transition-transform">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
