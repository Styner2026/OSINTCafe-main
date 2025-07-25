import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    onClick={scrollToTop}
                    className="relative p-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-110"
                    style={{
                        background: 'linear-gradient(135deg, #00f5ff 0%, #39ff14 100%)',
                        boxShadow: '0 4px 15px rgba(0, 245, 255, 0.4), 0 0 20px rgba(57, 255, 20, 0.3)',
                    }}
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    <ChevronUp
                        className="w-6 h-6 group-hover:animate-bounce"
                        style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            color: '#0a0a0a'
                        }}
                    />

                    {/* Cyber glow effect */}
                    <div
                        className="absolute inset-0 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        }}
                    />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTopButton;
