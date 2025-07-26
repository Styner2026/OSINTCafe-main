import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, Search, Home, ExternalLink, Github, Globe, ChevronDown, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dating-safety', label: 'Dating Safety', icon: Shield },
        { path: '/cafe-connect-wallet', label: 'CaféConnect Wallet', icon: Wallet },
        { path: '/threat-intel', label: 'Threat Intel', icon: Search },
    ];

    const externalLinks = [
        {
            label: 'API Status',
            url: '/api-status',
            icon: Monitor,
            description: 'View API connection status',
            isInternal: true
        },
        {
            label: 'Website',
            url: 'https://www.styner.dev/',
            icon: Globe,
            description: 'Personal portfolio & projects'
        },
        {
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/styner-stiner/',
            icon: ExternalLink,
            description: 'Professional profile'
        },
        {
            label: 'Twitter',
            url: 'https://x.com/StynerDev',
            icon: ExternalLink,
            description: 'Latest updates & thoughts'
        },
        {
            label: 'Main GitHub',
            url: 'https://github.com/Styner2023',
            icon: Github,
            description: 'Main development account'
        },
        {
            label: 'OSINT Café Project',
            url: 'https://github.com/Styner2026/OSINTCafe-main',
            icon: Github,
            description: 'This project repository'
        }
    ];

    return (
        <nav className="bg-dark-panel border-b border-cyber-blue/30 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center h-16 relative">
                    {/* Logo */}
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="absolute left-0 flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-dark-bg" />
                        </div>
                        <span className="font-cyber text-xl font-bold">
                            <span className="text-white">OSINT</span>{' '}
                            <span className="text-cyber-green">Café</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                                    className="relative px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-cyber-blue/20 cyber-border rounded-lg"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className="relative flex items-center space-x-2">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-blue' : 'text-gray-400'}`} />
                                        <span className={`text-sm font-medium ${isActive ? 'text-cyber-blue' : 'text-gray-300 hover:text-white'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Connect Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                                className="relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-blue hover:from-cyber-green/80 hover:to-cyber-blue/80 focus:outline-none shadow-lg hover:shadow-xl hover:shadow-cyber-green/30 hover:scale-105"
                            >
                                <ExternalLink className="w-4 h-4 text-black" />
                                <span className="text-sm font-medium text-black">Connect</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 text-black ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-64 bg-dark-panel border border-cyber-blue/30 rounded-lg shadow-2xl shadow-black/50 backdrop-blur-sm z-50"
                                >
                                    <div className="p-2">
                                        {externalLinks.map((link, index) => {
                                            const Icon = link.icon;

                                            if (link.isInternal) {
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={link.url}
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            window.scrollTo({ top: 0, behavior: 'auto' });
                                                        }}
                                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cyber-blue/10 hover:border-cyber-blue/30 transition-all duration-300 group"
                                                    >
                                                        <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 rounded-lg flex items-center justify-center group-hover:from-cyber-blue/30 group-hover:to-cyber-green/30 transition-all duration-300">
                                                            <Icon className="w-4 h-4 text-cyber-blue group-hover:text-cyber-green" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-white font-medium group-hover:text-cyber-blue transition-colors duration-300">
                                                                {link.label}
                                                            </div>
                                                            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                                {link.description}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cyber-blue/10 hover:border-cyber-blue/30 transition-all duration-300 group"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue/20 to-cyber-green/20 rounded-lg flex items-center justify-center group-hover:from-cyber-blue/30 group-hover:to-cyber-green/30 transition-all duration-300">
                                                        <Icon className="w-4 h-4 text-cyber-blue group-hover:text-cyber-green" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-medium group-hover:text-cyber-blue transition-colors duration-300">
                                                            {link.label}
                                                        </div>
                                                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                            {link.description}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-cyber-blue opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden absolute right-0">
                        <button
                            className="p-2 rounded-lg cyber-border"
                            aria-label="Open mobile menu"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                <div className="w-full h-0.5 bg-cyber-blue"></div>
                                <div className="w-full h-0.5 bg-cyber-blue"></div>
                                <div className="w-full h-0.5 bg-cyber-blue"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
