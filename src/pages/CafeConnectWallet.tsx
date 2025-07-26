import { Coffee, Shield, Heart, Gift, Users, Search, Activity, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CafeConnectWallet() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Video state management
    const [isMuted, setIsMuted] = useState(true);

    // Video control functions
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    // Handle video click - toggle mute only
    const handleVideoClick = () => {
        toggleMute();
    };    // Auto-play video when component mounts and ensure it continues playing
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(console.error);

            // Ensure video continues playing if it ever stops
            const handlePause = () => {
                if (video.paused) {
                    video.play().catch(console.error);
                }
            };

            video.addEventListener('pause', handlePause);
            return () => {
                video.removeEventListener('pause', handlePause);
            };
        }
    }, []);

    // Counter animation hook
    const useCounter = (end: number, duration: number = 2000, suffix: string = '') => {
        const [count, setCount] = useState(0);
        const [isVisible, setIsVisible] = useState(false);
        const countRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        let startTime: number;
                        const animate = (currentTime: number) => {
                            if (!startTime) startTime = currentTime;
                            const progress = Math.min((currentTime - startTime) / duration, 1);

                            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                            setCount(Math.floor(easeOutQuart * end));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };
                        requestAnimationFrame(animate);
                    }
                },
                { threshold: 0.5 }
            );

            if (countRef.current) {
                observer.observe(countRef.current);
            }

            return () => observer.disconnect();
        }, [end, duration, isVisible]);

        return { count, countRef, suffix };
    };

    // Counter Card Component
    const CounterCard = ({ end, suffix = '', color, label, prefix = '', display }: {
        end: number;
        suffix?: string;
        color: string;
        label: string;
        prefix?: string;
        display?: string;
    }) => {
        const counter = useCounter(end, 2500);

        return (
            <div className="space-y-4">
                <div ref={counter.countRef} className={`text-6xl lg:text-7xl xl:text-8xl font-bold ${color}`}>
                    {display || `${prefix}${counter.count % 1 === 0 ? counter.count : counter.count.toFixed(1)}${suffix}`}
                </div>
                <div className="text-gray-300">{label}</div>
            </div>
        );
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Lightning particle system
        const particles: Array<{
            x: number;
            y: number;
            speedX: number;
            speedY: number;
            size: number;
            alpha: number;
        }> = [];

        // Create lightning particles
        const createParticles = () => {
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    alpha: Math.random() * 0.5 + 0.1,
                });
            }
        };

        // Lightning particle animation
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(163, 255, 18, ${p.alpha})`;
                ctx.fill();

                // Add glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(163, 255, 18, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;

                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap particles around edges
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                if (p.y < 0) p.y = canvas.height;
            }

            requestAnimationFrame(animateParticles);
        };

        createParticles();
        const animate = animateParticles;

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Particle Animation Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ opacity: 0.6 }}
            />

            {/* Scan Line Effect */}
            <div className="scanline fixed inset-0 pointer-events-none z-10"></div>

            {/* Main Content */}
            <div className="relative z-20">

                {/* Custom CSS for lightning scan line animation */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .scanline {
                        background: linear-gradient(
                            transparent,
                            transparent 48%,
                            rgba(163, 255, 18, 0.4) 49%,
                            rgba(163, 255, 18, 0.9) 50%,
                            rgba(163, 255, 18, 0.4) 51%,
                            transparent 52%,
                            transparent
                        );
                        animation: scanline 4s linear infinite;
                    }

                    @keyframes scanline {
                        0% { transform: translateY(-100vh); }
                        100% { transform: translateY(100vh); }
                    }

                    .phone-float {
                        animation: phoneFloat 6s ease-in-out infinite;
                    }

                    .phone-float-delayed {
                        animation: phoneFloat 6s ease-in-out infinite;
                        animation-delay: -3s;
                    }

                    @keyframes phoneFloat {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(1deg); }
                    }

                    /* Typewriter animations */
                    .typewriter-1 {
                        overflow: hidden;
                        border-right: 2px solid #39ff14;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-1 3s steps(25, end) 2s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-2 {
                        overflow: hidden;
                        border-right: 2px solid #00f5ff;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-2 2.5s steps(22, end) 3.5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-3 {
                        overflow: hidden;
                        border-right: 2px solid #999;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-3 2s steps(20, end) 5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-4 {
                        overflow: hidden;
                        border-right: 2px solid #ff4444;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-4 2.5s steps(20, end) 2.5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-5 {
                        overflow: hidden;
                        border-right: 2px solid #39ff14;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-5 3s steps(26, end) 4s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-6 {
                        overflow: hidden;
                        border-right: 2px solid #00f5ff;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-6 2s steps(18, end) 5.5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-7 {
                        overflow: hidden;
                        border-right: 2px solid #00d4ff;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-7 3s steps(28, end) 2s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-8 {
                        overflow: hidden;
                        border-right: 2px solid #39ff14;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-8 2.5s steps(24, end) 3.5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    .typewriter-9 {
                        overflow: hidden;
                        border-right: 2px solid #ff6b35;
                        white-space: nowrap;
                        margin: 0 auto;
                        animation: typing-9 2s steps(20, end) 5s infinite,
                                   blink-caret 0.75s step-end infinite;
                    }

                    @keyframes typing-1 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-2 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-3 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-4 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-5 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-6 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-7 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-8 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes typing-9 {
                        from { width: 0; }
                        to { width: 100%; }
                    }

                    @keyframes blink-caret {
                        from, to { border-color: transparent; }
                        50% { border-color: inherit; }
                    }

                    .counter-animation {
                        animation: countUp 3s ease-out forwards;
                    }

                    @keyframes countUp {
                        0% { 
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .coin {
                        font-size: 200px;
                        width: 0.1em;
                        height: 1em;
                        background: linear-gradient(#ffffff, #f0f0f0);
                        margin: auto;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        animation: rotate_4001510 7s infinite linear;
                        transform-style: preserve-3d;
                    }

                    .coin .side, .coin:before, .coin:after {
                        content: "";
                        position: absolute;
                        width: 1em;
                        height: 1em;
                        overflow: hidden;
                        border-radius: 50%;
                        right: -0.4em;
                        text-align: center;
                        line-height: 1;
                        transform: rotateY(-90deg);
                        -moz-backface-visibility: hidden;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .coin .tails, .coin:after {
                        left: -0.4em;
                        transform: rotateY(90deg);
                    }

                    .coin:before, .coin:after {
                        background: linear-gradient(#ffffff, #f0f0f0);
                        backface-visibility: hidden;
                        transform: rotateY(90deg);
                    }

                    .coin:after {
                        transform: rotateY(-90deg);
                    }

                    @keyframes rotate_4001510 {
                        100% {
                            transform: rotateY(360deg);
                        }
                    }

                    .svg_back {
                        transform: scaleX(-1);
                    }

                    .coin-face {
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e5e7eb;
                    }
                    
                    /* Frosty glass button style without glow */
                    .glass-play-btn {
                        backdrop-filter: blur(8px);
                        background: rgba(255, 255, 255, 0.15);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        transition: all 0.3s ease;
                    }
                    
                    .glass-play-btn:hover {
                        transform: scale(1.05);
                        background: rgba(255, 255, 255, 0.2);
                    }
                `
                }} />
                {/*                                                    <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 hover:from-blue-400 hover:via-cyan-300 hover:to-teal-300 shadow-blue-500/30 hover:shadow-blue-500/50">
                                                <Star className="w-3 h-3 text-white drop-shadow-lg relative z-10" />
                                            </div>               <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-400 hover:from-purple-400 hover:via-indigo-300 hover:to-blue-300 shadow-purple-500/30 hover:shadow-purple-500/50">
                                                <Gift className="w-3 h-3 text-white drop-shadow-lg relative z-10" />
                                            </div>ection */}
                <section id="hero" className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 fade-in-up">
                            <div className="text-cyber-blue text-sm font-medium tracking-wide uppercase">
                                EMOTIONALLY INTELLIGENT DATING
                            </div>
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                                CaféConnect: The Future of <span className="text-cyber-green">Safe Dating</span>
                            </h1>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                                The world's first emotionally intelligent dating wallet. Load money via Venmo, Apple Pay, CashApp — no crypto required. Track dates, build trust, stay safe.
                            </p>
                            <div className="flex space-x-4">
                                <Link
                                    to="/wallet"
                                    className="bg-gradient-to-r from-cyber-blue to-blue-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 font-medium transform shadow-lg hover:shadow-xl"
                                >
                                    🚀 Access Live Wallet
                                </Link>
                                <button className="bg-transparent border-2 border-cyber-blue text-cyber-blue px-8 py-3 rounded-full hover:bg-cyber-blue hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 font-medium transform">
                                    Learn More
                                </button>
                            </div>
                        </div>                    {/* Right Content - Phone Mockups */}
                        <div className="relative flex justify-center lg:justify-start">
                            {/* First Phone */}
                            <div className="relative z-10 w-64 h-[500px] rounded-[2.5rem] border-2 p-2 phone-float hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                                style={{
                                    background: 'linear-gradient(163deg, #00ff75 0%, #3700ff 100%)',
                                    borderColor: 'rgba(0, 255, 117, 0.5)',
                                    boxShadow: '0px 0px 30px 1px rgba(0, 255, 117, 0.30)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(0, 255, 117, 0.50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(0, 255, 117, 0.30)';
                                }}>
                                <div className="w-full h-full bg-black rounded-[2rem] p-4 overflow-hidden shadow-inner">
                                    {/* Phone Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">CaféConnect - Dating Wallet</div>
                                        <div className="flex space-x-1">
                                            <div className="w-3 h-3 bg-gray-600 rounded"></div>
                                            <div className="w-3 h-3 bg-gray-600 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Portfolio Value */}
                                    <div className="bg-gradient-to-br from-cyber-blue/10 to-cyber-green/10 border border-cyber-blue/20 rounded-xl p-4 mb-3 hover:bg-cyber-blue/20 transition-colors duration-300">
                                        <div className="text-xs text-gray-400 mb-2 font-medium">Dating Wallet Balance</div>
                                        <div className="text-2xl font-bold text-white mb-3">$2,150.00</div>

                                        {/* Payment Options */}
                                        <div className="flex space-x-3 justify-center">
                                            <div className="flex items-center justify-center w-8 h-6 bg-blue-600 rounded text-xs font-bold text-white">V</div>
                                            <div className="flex items-center justify-center w-8 h-6 bg-black rounded border border-white">
                                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                                            </div>
                                            <div className="flex items-center justify-center w-8 h-6 bg-green-600 rounded text-xs font-bold text-white">$</div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="mb-12">
                                        <div className="text-sm text-gray-300 mb-3 font-medium">Spending Log</div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 hover:from-pink-400 hover:via-orange-300 hover:to-yellow-300 shadow-pink-500/30 hover:shadow-pink-500/50">
                                                        <Coffee className="w-3 h-3 text-white drop-shadow-lg relative z-10" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white font-medium">Coffee Chat - Happy</div>
                                                        <div className="text-xs text-gray-400">9:30 AM</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-cyber-green font-bold">$20</div>
                                            </div>

                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 via-purple-400 to-indigo-400 hover:from-blue-400 hover:via-purple-300 hover:to-indigo-300 shadow-blue-500/30 hover:shadow-blue-500/50">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white font-medium">Bookstore Date - Calm</div>
                                                        <div className="text-xs text-gray-400">8:12 AM</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-cyber-green font-bold">$55</div>
                                            </div>

                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-red-500 via-pink-400 to-rose-400 hover:from-red-400 hover:via-pink-300 hover:to-rose-300 shadow-red-500/30 hover:shadow-red-500/50">
                                                        <Heart className="w-3 h-3 text-white drop-shadow-lg relative z-10" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white font-medium">Dinner - In Love</div>
                                                        <div className="text-xs text-gray-400">Yesterday</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-cyber-green font-bold">$120</div>
                                            </div>

                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 hover:bg-gray-800/50 transition-colors duration-200">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-purple-500 via-violet-400 to-fuchsia-400 hover:from-purple-400 hover:via-violet-300 hover:to-fuchsia-300 shadow-purple-500/30 hover:shadow-purple-500/50">
                                                        <Gift className="w-3 h-3 text-white drop-shadow-lg relative z-10" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white font-medium">Gift - Hopeful</div>
                                                        <div className="text-xs text-gray-400">Yesterday</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-cyber-green font-bold">$35</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loyalty & Trust Points */}
                                    <div className="mb-8">
                                        <div className="text-sm text-gray-300 mb-2 font-medium">Loyalty & Trust Points</div>
                                        <div className="bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border border-cyber-green/20 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-bold text-white">80</span>
                                                <span className="text-xs text-gray-400">/ 100</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full" style={{ width: '80%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Navigation */}
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyber-blue/25">
                                            <div className="text-black text-xl font-bold">+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Phone */}
                            <div className="absolute top-16 -right-8 w-64 h-[500px] rounded-[2.5rem] border-2 p-2 shadow-2xl phone-float-delayed hover:scale-105 transition-all duration-300 transform rotate-12"
                                style={{
                                    background: 'linear-gradient(163deg, #3700ff 0%, #ff00ff 100%)',
                                    borderColor: 'rgba(255, 0, 255, 0.5)',
                                    boxShadow: '0px 0px 30px 1px rgba(255, 0, 255, 0.30)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(255, 0, 255, 0.50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(255, 0, 255, 0.30)';
                                }}>
                                <div className="w-full h-full bg-black rounded-[2rem] p-4 overflow-hidden shadow-inner">
                                    {/* Phone Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">CaféConnect</div>
                                        <button className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold">EMERGENCY</button>
                                    </div>

                                    {/* Wallet Safety Title */}
                                    <div className="text-lg font-bold text-white mb-4 text-center">Wallet Safety</div>

                                    {/* Map Section */}
                                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600 rounded-xl p-3 mb-4">
                                        <div className="text-xs text-gray-400 mb-2">Location Status</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-green-400">Safe area</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-red-400">Unsafe area</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Ledger */}
                                    <div className="mb-4">
                                        <div className="text-xs text-gray-400 mb-2 font-medium">Date Ledger</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                                    <span className="text-xs text-white">Emily - 45 min ago</span>
                                                </div>
                                                <div className="w-8 h-4 bg-cyber-green rounded-full relative">
                                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-0.5"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                                    <span className="text-xs text-white">Alex - Apr 18</span>
                                                </div>
                                                <div className="w-8 h-4 bg-cyber-green rounded-full relative">
                                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-0.5"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                                    <span className="text-xs text-white">Rachel - Apr 12</span>
                                                </div>
                                                <div className="w-8 h-4 bg-cyber-green rounded-full relative">
                                                    <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-0.5"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Security Sections */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-white font-medium">Consent ledger sync</span>
                                            </div>
                                            <span className="text-xs text-blue-400 font-bold">Active</span>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-white font-medium">Ghost Transaction Guard</span>
                                            </div>
                                            <span className="text-xs text-red-400 font-bold">Alerts detected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Typing Animations */}
                            <div className="absolute top-[32rem] -left-12 right-0 grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                                {/* First Phone Typing */}
                                <div className="text-center">
                                    <div className="space-y-2">
                                        <div className="text-cyber-green font-mono text-sm typewriter-1">
                                            {'>'}Loading wallet balance...
                                        </div>
                                        <div className="text-cyber-blue font-mono text-sm typewriter-2">
                                            {'>'}Trust points: +15 earned
                                        </div>
                                        <div className="text-gray-400 font-mono text-sm typewriter-3">
                                            {'>'}Payment methods synced
                                        </div>
                                    </div>
                                    {/* Phone Label */}
                                    <div className="mt-4 text-center">
                                        <div className="text-white font-semibold text-base">Dating Wallet</div>
                                        <div className="text-gray-400 text-sm">Financial tracking & spending</div>
                                    </div>
                                </div>

                                {/* Second Phone Typing */}
                                <div className="text-center ml-48 mt-16">
                                    <div className="space-y-2">
                                        <div className="text-red-400 font-mono text-sm typewriter-4">
                                            {'>'}Emergency mode ready
                                        </div>
                                        <div className="text-cyber-green font-mono text-sm typewriter-5">
                                            {'>'}Location verified: Safe area
                                        </div>
                                        <div className="text-cyber-blue font-mono text-sm typewriter-6">
                                            {'>'}Consent ledger active
                                        </div>
                                    </div>
                                    {/* Phone Label */}
                                    <div className="mt-4 text-center">
                                        <div className="text-white font-semibold text-base">Safety Dashboard</div>
                                        <div className="text-gray-400 text-sm">Security & emergency features</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Second Section */}
                <section id="features" className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content - Phone and Card */}
                        <div className="relative flex justify-center lg:justify-start fade-in-up">
                            {/* Phone */}
                            <div className="relative z-10 w-64 h-[500px] rounded-[2.5rem] border-2 p-2 phone-float hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl -mt-56"
                                style={{
                                    background: 'linear-gradient(163deg, #ff6b35 0%, #f7931e 100%)',
                                    borderColor: 'rgba(255, 107, 53, 0.5)',
                                    boxShadow: '0px 0px 30px 1px rgba(255, 107, 53, 0.30)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(255, 107, 53, 0.50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(255, 107, 53, 0.30)';
                                }}>
                                <div className="w-full h-full bg-black rounded-[2rem] p-4 shadow-inner">
                                    {/* Phone Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">CaféConnect</div>
                                        <div className="flex space-x-1">
                                            <div className="w-3 h-3 bg-gray-600 rounded"></div>
                                            <div className="w-3 h-3 bg-gray-600 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="text-lg font-bold text-white mb-6 text-center">Dating Goals Tracker</div>

                                    {/* Progress Bars Section */}
                                    <div className="mb-6">
                                        <div className="text-sm text-gray-300 mb-4 font-medium">Your Progress</div>

                                        {/* Emotional Goals */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-white font-medium">Emotional Goals</span>
                                                <span className="text-xs text-orange-400 font-bold">50%</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: '50%' }}></div>
                                            </div>
                                        </div>

                                        {/* Financial Goals */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-white font-medium">Financial Goals</span>
                                                <span className="text-xs text-cyber-green font-bold">70%</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full" style={{ width: '70%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wellness Reminders */}
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-300 mb-3 font-medium">Wellness Reminders</div>

                                        <div className="space-y-3">
                                            <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/10 border border-orange-500/20 rounded-lg p-3">
                                                <div className="flex items-start space-x-2">
                                                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                                                        <Heart className="w-2 h-2 text-white" />
                                                    </div>
                                                    <div className="text-xs text-white leading-relaxed">
                                                        Communicate your feelings openly
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border border-cyber-green/20 rounded-lg p-3">
                                                <div className="flex items-start space-x-2">
                                                    <div className="w-4 h-4 bg-cyber-green rounded-full flex items-center justify-center mt-0.5">
                                                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-xs text-white leading-relaxed">
                                                        Reach out for financial advice when needed
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="absolute bottom-4 left-6 right-6">
                                        <button className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 hover:from-orange-400 hover:via-orange-300 hover:to-yellow-300 text-white py-1 px-3 rounded text-xs font-medium shadow-md hover:shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer transition-all duration-300 hover:scale-102 relative overflow-hidden">
                                            <span className="relative z-10 font-bold">Update Goals</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Person's Face */}
                            <div className="absolute -bottom-8 -right-8 w-80 h-48 flex items-center justify-center hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                                    alt="HeartChain User Profile"
                                    className="w-48 h-48 rounded-full object-cover border-4 border-cyber-blue shadow-lg hover:border-cyber-green transition-colors duration-300"
                                />
                            </div>                        {/* Green Circle Background */}
                            <div className="absolute -bottom-16 -right-16 w-96 h-96 border-4 border-cyber-blue rounded-full opacity-20 hover:opacity-30 transition-opacity duration-300"></div>

                            {/* Top Circle - Couple's Partner with Background */}
                            <div className="absolute -top-16 -right-16 w-96 h-96 border-4 border-cyber-green rounded-full opacity-20 hover:opacity-30 transition-opacity duration-300"></div>
                            <div className="absolute -top-8 -right-8 w-80 h-48 flex items-center justify-center hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
                                    alt="Partner Profile"
                                    className="w-48 h-48 rounded-full object-cover border-4 border-cyber-green shadow-lg hover:border-cyber-blue transition-colors duration-300"
                                />
                            </div>

                            {/* Typing Animations */}
                            <div className="absolute top-[19rem] left-0 w-64">
                                {/* Second Section Phone Typing */}
                                <div className="text-left">
                                    <div className="space-y-2">
                                        <div className="text-cyber-blue font-mono text-sm typewriter-4">
                                            {'>'}Scanning profile authenticity...
                                        </div>
                                        <div className="text-cyber-green font-mono text-sm typewriter-5">
                                            {'>'}Safety score: 95% verified
                                        </div>
                                        <div className="text-accent-orange font-mono text-sm typewriter-6">
                                            {'>'}Trust level: High
                                        </div>
                                    </div>
                                    {/* Phone Label */}
                                    <div className="mt-4 text-center">
                                        <div className="text-white font-semibold text-base">Safety Scanner</div>
                                        <div className="text-gray-400 text-sm">Profile verification & trust</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-8 fade-in-up">
                            <div className="space-y-6">
                                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                    Safety meets <span className="text-cyber-green">Romance</span>
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                                    Load funds via Venmo, Apple Pay, CashApp. Track dates with ledger transparency. Build trust through verified activities and respect points.
                                </p>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Safety Features Card */}
                                <div className="space-y-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-cyber-blue rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/80 group-hover:scale-110 transition-all duration-300">
                                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyber-blue transition-colors duration-300">Emergency Safety</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        Triple-tap panic alerts, live location sharing, and geofenced spending confirmations for ultimate dating safety.
                                    </p>
                                </div>

                                {/* Trust Building Card */}
                                <div className="space-y-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-cyber-green rounded-lg flex items-center justify-center group-hover:bg-cyber-green/80 group-hover:scale-110 transition-all duration-300">
                                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyber-green transition-colors duration-300">Trust & Respect</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        Earn respect points, build TrustStack reputation, and create transparent dating experiences with consent logging.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* OSINT Café Services Section */}
                <section className="py-12 px-4 bg-dark-bg">
                    <div className="container mx-auto">
                        {/* Main Container Box */}
                        <div className="bg-dark-panel border border-cyber-blue/30 rounded-lg p-6 shadow-lg">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                                {/* Left side - Content */}
                                <div>
                                    <h2 className="text-3xl font-cyber font-bold mb-4 leading-tight bg-gradient-to-r from-cyber-blue via-cyber-green to-accent-orange bg-clip-text text-transparent">
                                        OSINT Café Safety
                                    </h2>

                                    <p className="text-gray-400 text-base mb-4 leading-relaxed">
                                        Advanced AI protection for safer relationships. Verify profiles and detect scams.
                                    </p>

                                    {/* Category Buttons */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col p-5 bg-dark-panel/50 rounded-xl border-2 border-cyber-blue/30 cursor-pointer hover:bg-cyber-blue/10 hover:border-cyber-blue/70 transition-all duration-300 group shadow-lg shadow-cyber-blue/10 hover:shadow-cyber-blue/20">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="w-7 h-7 text-red-400 group-hover:text-red-300">
                                                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 1l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 1z" />
                                                    </svg>
                                                </div>
                                                <span className="text-white text-xl font-bold group-hover:text-cyber-blue tracking-wide">Romance Scam Detection</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 ml-11">
                                                <p className="text-gray-300 text-sm font-medium">• AI-powered analysis</p>
                                                <p className="text-gray-300 text-sm font-medium">• Financial warnings</p>
                                                <p className="text-gray-300 text-sm font-medium">• Profile verification</p>
                                                <p className="text-gray-300 text-sm font-medium">• Emergency alerts</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col p-5 bg-dark-panel/30 rounded-xl border-2 border-cyber-green/30 cursor-pointer hover:bg-cyber-green/5 hover:border-cyber-green/50 transition-all duration-300 group shadow-lg shadow-cyber-green/5 hover:shadow-cyber-green/15">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="w-7 h-7 text-cyber-green">
                                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </div>
                                                <span className="text-white text-xl font-bold group-hover:text-cyber-green tracking-wide">Profile Verification</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 ml-11">
                                                <p className="text-gray-300 text-sm font-medium">• Blockchain identity</p>
                                                <p className="text-gray-300 text-sm font-medium">• Social media check</p>
                                                <p className="text-gray-300 text-sm font-medium">• Photo authenticity</p>
                                                <p className="text-gray-300 text-sm font-medium">• Trust scoring</p>
                                            </div>
                                        </div>

                                        {/* Bitcoin Dashboard CTA Button - Centered */}
                                        <div className="pt-4 flex justify-center">
                                            <Link
                                                to="/wallet"
                                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75 transition-all duration-300 hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                                                    boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                                }}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                                <span>Go to Bitcoin Dashboard</span>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - AI Assistant Demo */}
                                <div className="relative">
                                    {/* AI Assistant Container */}
                                    <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-cyber-blue/10 to-cyber-green/10 border border-cyber-blue/30">
                                        <div className="aspect-video relative">
                                            {/* AI Assistant Video */}
                                            <video
                                                ref={videoRef}
                                                className="w-full h-full rounded-lg object-cover cursor-pointer"
                                                autoPlay
                                                muted={isMuted}
                                                loop
                                                playsInline
                                                preload="auto"
                                                onClick={handleVideoClick}
                                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23161616'/%3E%3Ctext x='200' y='112' text-anchor='middle' fill='%2300f5ff' font-family='monospace' font-size='16'%3EAI Assistant%3C/text%3E%3C/svg%3E"
                                            >
                                                <source
                                                    src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/Mama-OSINT-Cafe%CC%81.mp4"
                                                    type="video/mp4"
                                                />
                                                {/* Fallback for browsers that don't support video */}
                                                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-dark-panel">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-cyber-blue to-cyber-green rounded-full mb-4 flex items-center justify-center animate-pulse-slow">
                                                        <svg className="w-8 h-8 text-dark-bg" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,7C10.34,7 9,8.34 9,10C9,11.66 10.34,13 12,13C13.66,13 15,11.66 15,10C15,8.34 13.66,7 12,7Z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-white text-lg font-semibold mb-2 text-center">Dating Safety AI</h3>
                                                    <p className="text-gray-300 text-sm text-center mb-3">Protect yourself from romance scams</p>
                                                    <div className="px-4 py-2 bg-cyber-blue text-dark-bg font-semibold rounded-lg hover:bg-cyber-blue/80 transition-colors text-sm">
                                                        Start Chat
                                                    </div>
                                                </div>
                                            </video>

                                            {/* Frosty Glass Play Button Overlay - Only Visible When Muted */}
                                            {isMuted && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 glass-play-btn">
                                                        <Play className="w-8 h-8 text-white/90 ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subtle Video Status Indicator */}
                                            <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                                                <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></div>
                                                <span className="text-white/90 text-xs font-medium">
                                                    {isMuted ? 'Muted' : 'Sound On'}
                                                </span>
                                            </div>

                                            {/* Simple Audio Status - Bottom Right */}
                                            <div className="absolute bottom-3 right-3 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                                                    {isMuted ?
                                                        <VolumeX className="w-4 h-4 text-white/70" /> :
                                                        <Volume2 className="w-4 h-4 text-white/70" />
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Overlay */}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></div>
                                                    <span className="text-white text-xs font-medium">AI Ready</span>
                                                </div>
                                                <div className="text-xs text-gray-300">Dating Safety Mode</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fourth Section - CaféConnect Features */}
                <section className="container mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content - Phone and Card */}
                        <div className="relative flex justify-center lg:justify-start fade-in-up">
                            {/* Phone */}
                            <div className="relative z-10 w-64 h-[580px] rounded-[2.5rem] border-2 p-2 phone-float hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                                style={{
                                    background: 'linear-gradient(163deg, #00d4ff 0%, #0099cc 100%)',
                                    borderColor: 'rgba(0, 212, 255, 0.5)',
                                    boxShadow: '0px 0px 30px 1px rgba(0, 212, 255, 0.30)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(0, 212, 255, 0.50)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 0px 30px 1px rgba(0, 212, 255, 0.30)';
                                }}>
                                <div className="w-full h-full bg-black rounded-[2rem] p-3 shadow-inner overflow-hidden">
                                    {/* Phone Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">CaféConnect</div>
                                        <div className="w-3 h-3 bg-gray-600 rounded flex items-center justify-center">
                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="text-lg font-bold text-white mb-5 text-center">Shared Budget Vaults</div>

                                    {/* Progress Indicators Section */}
                                    <div className="mb-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Dates Progress */}
                                            <div className="text-center">
                                                <div className="relative w-16 h-16 mx-auto mb-3">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-gray-700" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                        <path className="text-cyber-blue" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-cyber-blue" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-white font-bold">$230</div>
                                                <div className="text-xs text-gray-400">Dates</div>
                                            </div>

                                            {/* Trips Progress */}
                                            <div className="text-center">
                                                <div className="relative w-16 h-16 mx-auto mb-3">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-gray-700" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                        <path className="text-cyan-400" stroke="currentColor" strokeWidth="3" strokeDasharray="60, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-white font-bold">720</div>
                                                <div className="text-xs text-gray-400">Trips</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verified Inner Circle */}
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-300 mb-2 font-medium">Verified Inner Circle</div>
                                        <div className="bg-gradient-to-br from-cyber-blue/10 to-cyan-400/10 border border-cyber-blue/20 rounded-lg p-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex -space-x-2">
                                                    <div className="w-7 h-7 rounded-full border-2 border-cyber-blue bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                                                    <div className="w-7 h-7 rounded-full border-2 border-cyan-400 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">J</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-white font-medium">Ann & Jake</div>
                                                    <div className="text-xs text-gray-400">Trusted friends and family</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pre-Date Purchase Consent */}
                                    <div className="mb-6">
                                        <div className="text-sm text-gray-300 mb-2 font-medium">Pre-Date Purchase Consent</div>
                                        <div className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 border border-cyan-400/20 rounded-lg p-3 mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                                                        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm text-white font-bold">$120</div>
                                                    <div className="text-xs text-gray-400">for dinner tonight</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Safety Features */}
                                        <div className="mb-4">
                                            <div className="text-xs text-gray-400 mb-1">Safety Features Active</div>
                                            <div className="flex items-center justify-between bg-gradient-to-br from-cyber-green/5 to-cyber-blue/5 border border-cyber-green/20 rounded-lg p-2 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-cyber-green rounded-full flex items-center justify-center">
                                                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-white">Location Tracking</span>
                                                </div>
                                                <div className="w-1 h-1 bg-cyber-green rounded-full animate-pulse"></div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button className="flex-1 bg-cyber-green hover:bg-cyber-green/80 text-black py-2 px-3 rounded text-sm font-bold transition-colors duration-200">
                                                Approve
                                            </button>
                                            <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200">
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Circle - Main User with Background */}
                            <div className="absolute -bottom-16 -right-16 w-96 h-96 border-4 border-cyber-green rounded-full opacity-20 hover:opacity-30 transition-opacity duration-300"></div>
                            <div className="absolute -bottom-8 -right-8 w-80 h-48 flex items-center justify-center hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
                                    alt="CaféConnect User Profile"
                                    className="w-48 h-48 rounded-full object-cover border-4 border-cyber-green shadow-lg hover:border-cyber-blue transition-colors duration-300"
                                />
                            </div>

                            {/* Top Circle - Couple's Partner with Background */}
                            <div className="absolute -top-16 -right-16 w-96 h-96 border-4 border-cyber-blue rounded-full opacity-20 hover:opacity-30 transition-opacity duration-300"></div>
                            <div className="absolute -top-8 -right-8 w-80 h-48 flex items-center justify-center hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                                    alt="Partner Profile"
                                    className="w-48 h-48 rounded-full object-cover border-4 border-cyber-blue shadow-lg hover:border-cyber-green transition-colors duration-300"
                                />
                            </div>

                            {/* Typing Animations */}
                            <div className="absolute top-[39rem] left-0 w-64">
                                {/* Fourth Section Phone Typing */}
                                <div className="text-left">
                                    <div className="space-y-2">
                                        <div className="text-cyber-blue font-mono text-sm typewriter-7">
                                            {'>'}Loading wallet balance...
                                        </div>
                                        <div className="text-cyber-green font-mono text-sm typewriter-8">
                                            {'>'}Trust points: +15 earned
                                        </div>
                                        <div className="text-accent-orange font-mono text-sm typewriter-9">
                                            {'>'}Payment methods synced
                                        </div>
                                    </div>
                                    {/* Phone Label */}
                                    <div className="mt-4 text-center">
                                        <div className="text-white font-semibold text-base">Dating Wallet</div>
                                        <div className="text-gray-400 text-sm">Financial tracking & spending</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-8 fade-in-up">
                            <div className="space-y-6">
                                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                    The world's first emotionally intelligent <span className="text-cyber-green">dating wallet</span>
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                                    CaféConnect revolutionizes dating by combining financial security with emotional intelligence. Our platform helps users navigate the complex intersection of romance and finance.
                                </p>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Smart Dashboard Card */}
                                <div className="space-y-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-cyber-blue rounded-lg flex items-center justify-center group-hover:bg-cyber-blue/80 group-hover:scale-110 transition-all duration-300">
                                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyber-blue transition-colors duration-300">Smart Dashboard</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        Integrated wallet balance with fiat on-ramp options and emotion-tagged spending logs for better financial awareness.
                                    </p>
                                </div>

                                {/* Advanced Safety Card */}
                                <div className="space-y-4 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-accent-orange rounded-lg flex items-center justify-center group-hover:bg-accent-orange/80 group-hover:scale-110 transition-all duration-300">
                                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.66,7 15,8.34 15,10C15,11.66 13.66,13 12,13C10.34,13 9,11.66 9,10C9,8.34 10.34,7 12,7Z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-accent-orange transition-colors duration-300">Advanced Safety</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        Emergency tap button, geofenced spending confirmations, and consent verification system for ultimate protection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Third Section */}
                <section id="members" className="container mx-auto px-6 py-16 lg:py-24 text-center">
                    <div className="max-w-4xl mx-auto space-y-6 fade-in-up">
                        <div className="text-cyber-blue text-sm font-medium tracking-wide uppercase">
                            CAFÉCONNECT WALLET
                        </div>
                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                            Smart financial management<br />for <span className="text-cyber-green">modern dating</span>
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                            Experience the future of dating finance with CaféConnect's emotionally intelligent wallet. Track spending, build trust, and stay safe with advanced blockchain-powered financial tools designed for relationships.
                        </p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="container mx-auto px-6 py-8 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <CounterCard end={2.3} suffix="B+" color="text-cyber-blue" label="Romance Scam Losses Prevented" prefix="$" />
                        <CounterCard end={100} suffix="%" color="text-cyber-green" label="ICP Blockchain Verified" />
                        <CounterCard end={24} suffix="/7" color="text-orange-400" label="AI Protection Hours" />
                    </div>
                </section>

                {/* How to Use Your Results */}
                <section className="container mx-auto px-6 py-8 lg:py-12">
                    {/* Rotating Bitcoin Coin Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative flex justify-center items-center py-4 mb-6"
                    >
                        <div className="relative w-48 h-48">
                            <div className="coin">
                                <div className="side heads">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-4 coin-face">
                                        <img
                                            src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/ICP-DFINITY.ico"
                                            alt="Affinity Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="side tails">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-4 coin-face">
                                        <img
                                            src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/ICP-DFINITY.ico"
                                            alt="Affinity Logo"
                                            className="w-full h-full object-contain transform scale-x-[-1]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ICP Powers the Future Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-gradient-to-r from-dark-panel/60 to-dark-panel/40 rounded-3xl p-10 border border-cyber-green/20 shadow-2xl shadow-black/50 mb-16"
                    >
                        <h3 className="text-4xl font-bold text-white mb-12 text-center">
                            <span>Why ICP Powers the Future of Safe Dating</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center group">
                                <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/30 group-hover:border-red-500/60 transition-all duration-300 shadow-xl shadow-red-500/20 group-hover:shadow-2xl group-hover:shadow-red-500/30">
                                    <Shield className="w-12 h-12 text-red-400 group-hover:text-red-300 transition-colors" />
                                </div>
                                <h4 className="font-bold text-red-400 mb-4 text-xl">Unbreakable Security</h4>
                                <p className="text-gray-300 leading-relaxed">ICP's revolutionary blockchain ensures your dating profile can never be hacked, faked, or compromised - ultimate protection against catfish</p>
                            </div>

                            <div className="text-center group">
                                <div className="w-24 h-24 bg-gradient-to-r from-cyber-green/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyber-green/30 group-hover:border-cyber-green/60 transition-all duration-300 shadow-xl shadow-cyber-green/20 group-hover:shadow-2xl group-hover:shadow-cyber-green/30">
                                    <Users className="w-12 h-12 text-cyber-green group-hover:text-green-300 transition-colors" />
                                </div>
                                <h4 className="font-bold text-cyber-green mb-4 text-xl">Lightning Fast Matches</h4>
                                <p className="text-gray-300 leading-relaxed">ICP's web-speed blockchain delivers instant verification and matching - no waiting 10 minutes for Bitcoin confirmations on your love life</p>
                            </div>

                            <div className="text-center group">
                                <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyber-blue/30 group-hover:border-cyber-blue/60 transition-all duration-300 shadow-xl shadow-cyber-blue/20 group-hover:shadow-2xl group-hover:shadow-cyber-blue/30">
                                    <Search className="w-12 h-12 text-cyber-blue group-hover:text-blue-300 transition-colors" />
                                </div>
                                <h4 className="font-bold text-cyber-blue mb-4 text-xl">Zero Gas Fees Forever</h4>
                                <p className="text-gray-300 leading-relaxed">Unlike Ethereum's $50+ fees, ICP's reverse gas model means dating verification costs nothing - love shouldn't be expensive</p>
                            </div>

                            <div className="text-center group">
                                <div className="w-24 h-24 bg-gradient-to-r from-accent-orange/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent-orange/30 group-hover:border-accent-orange/60 transition-all duration-300 shadow-xl shadow-accent-orange/20 group-hover:shadow-2xl group-hover:shadow-accent-orange/30">
                                    <Activity className="w-12 h-12 text-accent-orange group-hover:text-orange-300 transition-colors" />
                                </div>
                                <h4 className="font-bold text-accent-orange mb-4 text-xl">100% Decentralized</h4>
                                <p className="text-gray-300 leading-relaxed">No big tech can censor your love life - ICP runs on sovereign nodes worldwide, making HeartChain.cafe truly unstoppable</p>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}