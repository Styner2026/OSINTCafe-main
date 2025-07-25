export default function HackathonBanner() {
  return (
    <div className="relative bg-gradient-to-r from-black via-gray-900 to-black py-8 md:py-12 lg:py-16 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,245,255,0.3),transparent_70%)] animate-pulse-fast"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(0,245,255,0.2),transparent_70%)] animate-pulse-fast [animation-delay:0.5s]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,245,255,0.1),transparent)] animate-pulse"></div>
      </div>

      {/* ULTRA FAST Scrolling Content - INFINITE SEAMLESS */}
      <div className="relative flex animate-scroll">
        <div className="flex whitespace-nowrap">
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-blue mx-4 md:mx-8 lg:mx-12 tracking-widest drop-shadow-2xl">
            🚀 OSINT CAFÉ
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">⚡</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-blue to-white mx-4 md:mx-8 lg:mx-12 tracking-widest">
            DFINITY ICP POWERED
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">🔥</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-blue mx-4 md:mx-8 lg:mx-12 tracking-widest">
            INVESTIGATE • VERIFY • WIN
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">💎</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-blue to-white mx-4 md:mx-8 lg:mx-12 tracking-widest">
            OSINT CAFÉ
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">🏆</span>
        </div>
        <div className="flex whitespace-nowrap">
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-blue mx-4 md:mx-8 lg:mx-12 tracking-widest drop-shadow-2xl">
            🚀 OSINT CAFÉ
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">⚡</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-blue to-white mx-4 md:mx-8 lg:mx-12 tracking-widest">
            DFINITY ICP POWERED
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">🔥</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-blue mx-4 md:mx-8 lg:mx-12 tracking-widest">
            INVESTIGATE • VERIFY • WIN
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">💎</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-blue to-white mx-4 md:mx-8 lg:mx-12 tracking-widest">
            OSINT CAFÉ
          </span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-black text-cyber-blue mx-2 md:mx-4 lg:mx-8 animate-pulse-fast">🏆</span>
        </div>
      </div>

      {/* Dynamic Glow Effects */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyber-blue via-cyber-blue to-cyber-blue opacity-80 animate-pulse-fast"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-60 animate-pulse"></div>

      {/* Enhanced Side Fades */}
      <div className="absolute top-0 left-0 w-20 md:w-32 lg:w-40 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-20 md:w-32 lg:w-40 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
    </div>
  );
}