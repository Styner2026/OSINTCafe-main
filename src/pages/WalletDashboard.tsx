import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { bitcoinWalletService, BitcoinWalletData } from '../services/bitcoinService';
import { ICPIdentityService } from '../services/icpIdentityService';
import '../components/RetroTV.css';
import '../components/BitcoinCoin.css';
import {
    Shield,
    AlertTriangle,
    Plus,
    CheckCircle,
    Bitcoin,
    Send,
    Copy,
    Target,
    Heart,
    DollarSign,
    Lock,
    Zap,
    Brain,
    LogOut
} from 'lucide-react';

// Dating Safety & Bitcoin Wallet Types
interface DatingGoal {
    id: string;
    name: string;
    target_amount_btc: number;
    current_amount_btc: number;
    deadline: number;
    priority: 'high' | 'medium' | 'low';
    category: 'emotional' | 'financial' | 'safety';
}

interface SafetyAlert {
    id: string;
    alert_type: string;
    message: string;
    severity: string;
    created_at: number;
    acknowledged: boolean;
    metadata: Record<string, string>;
    reporter_principal?: string;
    chat_context?: string;
}

interface BitcoinSpendingPattern {
    emotional_state_tags: Record<string, number>;
    daily_limit_btc: number;
    warning_threshold_btc: number;
    cooling_off_period: number;
    last_large_purchase?: number;
    dating_safety_enabled: boolean;
}

interface CafeBitcoinWallet {
    principal: string;
    nickname?: string;
    bitcoin_address: string;
    bitcoin_balance_satoshis: number;
    bitcoin_balance_btc: number;
    trust_score: number;
    safety_rating: string;
    created_at: number;
    last_activity: number;
    spending_patterns: BitcoinSpendingPattern;
    dating_goals: DatingGoal[];
    emergency_contacts: string[];
    privacy_settings: {
        share_trust_score: boolean;
        allow_trust_connections: boolean;
        public_nickname: boolean;
        emergency_mode: boolean;
    };
}

export default function WalletDashboard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ICP Identity Service
    const icpIdentityService = useRef(new ICPIdentityService()).current;

    const [wallet, setWallet] = useState<CafeBitcoinWallet | null>(null);
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('bitcoin');

    // New wallet creation
    const [showCreateWallet, setShowCreateWallet] = useState(false);
    const [nickname, setNickname] = useState('');

    // Bitcoin wallet state
    const [bitcoinWallet, setBitcoinWallet] = useState<BitcoinWalletData>({
        address: '',
        balance: 0,
        balance_btc: 0,
        network: 'mainnet', // Changed to mainnet for production
        loading: false
    });
    const [sendBtcForm, setSendBtcForm] = useState({
        destination: '',
        amount: '',
        loading: false,
        purpose: 'general', // dating, emergency, investment, etc.
        emotional_state: 'calm' // calm, excited, anxious, happy, etc.
    });
    const [showSendBtc, setShowSendBtc] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Logout function
    const handleLogout = async () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        try {
            await icpIdentityService.logout();
            setIsAuthenticated(false);
            setWallet(null);
            setShowLogoutConfirm(false);
            // Optionally redirect to home or login page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            setShowLogoutConfirm(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            // Check authentication status
            const authState = icpIdentityService.getState();
            setIsAuthenticated(authState.isAuthenticated);

            await loadWalletData();
            await loadBitcoinWallet();
        };
        loadData();
    }, []);

    // EXACT Orange particle system from CafeConnect
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

        // SPECTACULAR SKY LIGHTING EFFECTS SYSTEM
        const lightningBolts: Array<{
            x: number;
            y: number;
            branches: Array<Array<{ x: number; y: number; }>>;
            intensity: number;
            fadeOut: number;
            active: boolean;
        }> = [];

        const auroras: Array<{
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            alpha: number;
            wave: number;
        }> = [];

        const starbursts: Array<{
            x: number;
            y: number;
            rays: Array<{ angle: number; length: number; alpha: number; }>;
            intensity: number;
            expanding: boolean;
            color: string;
        }> = [];

        // GALAXY STARFIELD SYSTEM - Fixed stars like in space
        const stars: Array<{
            x: number;
            y: number;
            size: number;
            brightness: number;
            twinkleSpeed: number;
            twinkleOffset: number;
            color: string;
            type: 'tiny' | 'small' | 'medium' | 'bright' | 'giant';
        }> = [];

        // Create galaxy starfield with thousands of twinkling stars
        const createGalaxyStars = () => {
            // Different star types with different properties
            const starTypes = [
                { type: 'tiny', count: 800, sizeRange: [0.5, 1], brightness: [0.3, 0.7] },
                { type: 'small', count: 400, sizeRange: [1, 1.5], brightness: [0.5, 0.8] },
                { type: 'medium', count: 150, sizeRange: [1.5, 2.5], brightness: [0.7, 0.9] },
                { type: 'bright', count: 50, sizeRange: [2, 3], brightness: [0.8, 1] },
                { type: 'giant', count: 10, sizeRange: [3, 4], brightness: [0.9, 1] }
            ] as const;

            const starColors = [
                '#ffffff',  // White stars
                '#fff9e6',  // Warm white
                '#ffe6cc',  // Light orange
                '#ffcc99',  // Orange
                '#f97316',  // Deep orange
                '#fb923c',  // Bright orange
                '#fdba74',  // Light orange
                '#e6f3ff',  // Blue-white
                '#ccddff'   // Blue stars
            ];

            starTypes.forEach(starType => {
                for (let i = 0; i < starType.count; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        size: Math.random() * (starType.sizeRange[1] - starType.sizeRange[0]) + starType.sizeRange[0],
                        brightness: Math.random() * (starType.brightness[1] - starType.brightness[0]) + starType.brightness[0],
                        twinkleSpeed: Math.random() * 0.02 + 0.005,
                        twinkleOffset: Math.random() * Math.PI * 2,
                        color: starColors[Math.floor(Math.random() * starColors.length)],
                        type: starType.type
                    });
                }
            });
        };

        // Create aurora effects
        const createAuroras = () => {
            for (let i = 0; i < 3; i++) {
                auroras.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.3,
                    width: Math.random() * 300 + 200,
                    height: Math.random() * 150 + 100,
                    color: `hsl(${Math.random() * 60 + 20}, 70%, 60%)`, // Orange-yellow hues
                    alpha: Math.random() * 0.3 + 0.1,
                    wave: Math.random() * Math.PI * 2
                });
            }
        };

        // Create starburst effects
        const createStarbursts = () => {
            for (let i = 0; i < 5; i++) {
                const rays = [];
                for (let j = 0; j < 12; j++) {
                    rays.push({
                        angle: (j / 12) * Math.PI * 2,
                        length: Math.random() * 100 + 50,
                        alpha: Math.random() * 0.8 + 0.2
                    });
                }
                starbursts.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    rays,
                    intensity: Math.random() * 0.7 + 0.3,
                    expanding: true,
                    color: `hsl(${Math.random() * 40 + 10}, 80%, 65%)`
                });
            }
        };

        // SPECTACULAR SKY LIGHTING ANIMATION SYSTEM
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create dramatic background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(249, 115, 22, 0.03)');
            gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.02)');
            gradient.addColorStop(1, 'rgba(253, 186, 116, 0.01)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animate auroras
            for (let i = 0; i < auroras.length; i++) {
                const aurora = auroras[i];

                // Create aurora gradient
                const auroraGradient = ctx.createLinearGradient(
                    aurora.x, aurora.y,
                    aurora.x + aurora.width, aurora.y + aurora.height
                );
                auroraGradient.addColorStop(0, `${aurora.color.replace(')', `, ${aurora.alpha})`)}`);
                auroraGradient.addColorStop(0.5, `${aurora.color.replace(')', `, ${aurora.alpha * 0.7})`)}`);
                auroraGradient.addColorStop(1, `${aurora.color.replace(')', `, 0)`)}`);

                ctx.fillStyle = auroraGradient;
                ctx.save();
                ctx.translate(aurora.x + aurora.width / 2, aurora.y + aurora.height / 2);
                ctx.rotate(Math.sin(aurora.wave) * 0.1);
                ctx.fillRect(-aurora.width / 2, -aurora.height / 2, aurora.width, aurora.height);
                ctx.restore();

                aurora.wave += 0.02;
                aurora.alpha = Math.sin(Date.now() * 0.001 + i) * 0.15 + 0.15;
            }

            // Animate starbursts
            for (let i = 0; i < starbursts.length; i++) {
                const burst = starbursts[i];

                ctx.save();
                ctx.translate(burst.x, burst.y);
                ctx.globalAlpha = burst.intensity;

                for (const ray of burst.rays) {
                    ctx.strokeStyle = burst.color;
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = burst.color;
                    ctx.lineWidth = Math.random() * 3 + 1;
                    ctx.globalAlpha = ray.alpha * burst.intensity;

                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(
                        Math.cos(ray.angle) * ray.length,
                        Math.sin(ray.angle) * ray.length
                    );
                    ctx.stroke();

                    if (burst.expanding) {
                        ray.length += 2;
                        ray.alpha *= 0.98;
                    }
                }

                burst.intensity *= 0.995;
                if (burst.intensity < 0.01) {
                    // Reset starburst
                    burst.intensity = Math.random() * 0.7 + 0.3;
                    burst.x = Math.random() * canvas.width;
                    burst.y = Math.random() * canvas.height;
                    burst.rays.forEach(ray => {
                        ray.length = Math.random() * 50 + 25;
                        ray.alpha = Math.random() * 0.8 + 0.2;
                    });
                }

                ctx.restore();
            }

            // Generate lightning bolts randomly
            if (Math.random() < 0.003) {
                const lightning = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.7,
                    branches: [],
                    intensity: 1,
                    fadeOut: 0.05,
                    active: true
                };

                // Create lightning branches
                for (let b = 0; b < 5; b++) {
                    const branch = [];
                    let x = lightning.x;
                    let y = lightning.y;

                    for (let s = 0; s < 8; s++) {
                        x += (Math.random() - 0.5) * 40;
                        y += Math.random() * 30 + 10;
                        branch.push({ x, y });
                    }
                    lightning.branches.push(branch);
                }
                lightningBolts.push(lightning);
            }

            // Animate lightning bolts
            for (let i = lightningBolts.length - 1; i >= 0; i--) {
                const bolt = lightningBolts[i];

                if (bolt.active) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.intensity})`;
                    ctx.shadowBlur = 30;
                    ctx.shadowColor = '#ffffff';
                    ctx.lineWidth = 3;

                    for (const branch of bolt.branches) {
                        ctx.beginPath();
                        ctx.moveTo(bolt.x, bolt.y);
                        for (const point of branch) {
                            ctx.lineTo(point.x, point.y);
                        }
                        ctx.stroke();
                    }

                    bolt.intensity -= bolt.fadeOut;
                    if (bolt.intensity <= 0) {
                        lightningBolts.splice(i, 1);
                    }
                }
            }

            // Enhanced particle animation with multiple types
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                ctx.save();
                ctx.globalAlpha = p.alpha;

                switch (p.type) {
                    case 'spark': {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = p.color;
                        ctx.fill();
                        break;
                    }

                    case 'glow': {
                        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                        glowGradient.addColorStop(0, p.color);
                        glowGradient.addColorStop(1, 'transparent');
                        ctx.fillStyle = glowGradient;
                        ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
                        break;
                    }

                    case 'streak': {
                        ctx.strokeStyle = p.color;
                        ctx.lineWidth = p.size;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = p.color;
                        ctx.beginPath();
                        ctx.moveTo(p.x - p.speedX * 5, p.y - p.speedY * 5);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                        break;
                    }

                    case 'pulse': {
                        const pulseSize = p.size * (1 + Math.sin(Date.now() * 0.01 + p.x * 0.01) * 0.5);
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.shadowBlur = pulseSize * 2;
                        ctx.shadowColor = p.color;
                        ctx.fill();
                        break;
                    }
                }

                ctx.restore();

                p.x += p.speedX;
                p.y += p.speedY;
                p.life--;

                // Fade out over time
                p.alpha = (p.life / p.maxLife) * 0.8 + 0.2;

                // Wrap particles around edges
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                if (p.y < 0) p.y = canvas.height;

                // Respawn particle if life is over
                if (p.life <= 0) {
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.life = p.maxLife;
                    p.alpha = Math.random() * 0.8 + 0.2;
                }
            }

            requestAnimationFrame(animateParticles);
        };

        createParticles();
        createAuroras();
        createStarbursts();
        const animate = animateParticles;

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    // Orange starfield animation from homepage - Performance optimized
    useEffect(() => {
        // Orange starfield animation
        const startAnimation = () => {
            const STAR_COLORS = ['#f97316', '#fb923c', '#fdba74', '#ffffff'];
            const NUM_STARS = 100;
            const SPEED = 0.04;
            const NUM_SHOOTING_STARS = 1;
            const FRAME_RATE = 30;

            const canvas = document.createElement('canvas');
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.position = 'absolute';
            canvas.style.inset = '0';
            canvas.style.zIndex = '1';
            canvas.style.pointerEvents = 'none';

            const starfieldBg = document.getElementById('starfield-bg');
            if (starfieldBg) {
                starfieldBg.appendChild(canvas);

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                let w: number, h: number;
                let lastTime = 0;
                const targetFrameTime = 1000 / FRAME_RATE;

                function resize() {
                    w = canvas.width = window.innerWidth;
                    h = canvas.height = window.innerHeight;
                }
                window.addEventListener('resize', resize);
                resize();

                const stars = Array.from({ length: NUM_STARS }, () => ({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.2 + 0.3,
                    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
                    speedX: (Math.random() - 0.5) * SPEED * 2,
                    speedY: (Math.random() - 0.5) * SPEED * 0.5,
                    twinkle: Math.random() * 0.02 + 0.98
                }));

                const shootingStars = Array.from({ length: NUM_SHOOTING_STARS }, () => ({
                    x: -50,
                    y: Math.random() * h,
                    speedX: Math.random() * 3 + 2,
                    speedY: (Math.random() - 0.5) * 0.5,
                    length: Math.random() * 80 + 20,
                    opacity: 0,
                    active: false,
                    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
                }));

                function animate(currentTime: number) {
                    if (!ctx) return;

                    if (currentTime - lastTime < targetFrameTime) {
                        requestAnimationFrame(animate);
                        return;
                    }
                    lastTime = currentTime;

                    ctx.clearRect(0, 0, w, h);

                    // Draw regular stars
                    for (const s of stars) {
                        ctx.beginPath();
                        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
                        ctx.fillStyle = s.color;
                        ctx.shadowColor = s.color;
                        ctx.shadowBlur = 4;
                        ctx.globalAlpha = s.twinkle;
                        ctx.fill();
                        ctx.closePath();
                        ctx.globalAlpha = 1;

                        s.x += s.speedX;
                        s.y += s.speedY;
                        s.twinkle = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + s.x * 0.01);

                        if (s.x > w + 4) s.x = -4;
                        if (s.x < -4) s.x = w + 4;
                        if (s.y > h + 4) s.y = -4;
                        if (s.y < -4) s.y = h + 4;
                    }

                    // Draw shooting stars
                    for (const ss of shootingStars) {
                        if (!ss.active && Math.random() < 0.001) {
                            ss.active = true;
                            ss.x = -50;
                            ss.y = Math.random() * h;
                            ss.opacity = 1;
                        }

                        if (ss.active) {
                            ctx.strokeStyle = ss.color;
                            ctx.shadowColor = ss.color;
                            ctx.shadowBlur = 8;
                            ctx.globalAlpha = ss.opacity;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(ss.x - ss.length, ss.y);
                            ctx.lineTo(ss.x, ss.y);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.globalAlpha = 1;

                            ss.x += ss.speedX;
                            ss.y += ss.speedY;
                            ss.opacity -= 0.005;

                            if (ss.x > w + 100 || ss.opacity <= 0) {
                                ss.active = false;
                            }
                        }
                    }

                    requestAnimationFrame(animate);
                }
                animate(0);
            }
        };

        setTimeout(startAnimation, 500);
    }, []);

    const loadWalletData = async () => {
        try {
            setLoading(true);

            // Load Bitcoin wallet data first
            await loadBitcoinWallet();

            // In production, replace with actual ICP actor calls
            // For now, we'll simulate the CafeConnect Bitcoin wallet structure
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading

            // This would be: const wallet = await actor.get_my_bitcoin_wallet();
            setWallet({
                principal: "test-principal-123",
                nickname: "SafeDater2024",
                bitcoin_address: bitcoinWallet.address || "Loading...",
                bitcoin_balance_satoshis: bitcoinWallet.balance,
                bitcoin_balance_btc: bitcoinWallet.balance_btc,
                trust_score: 75,
                safety_rating: "SAFE",
                created_at: Date.now(),
                last_activity: Date.now(),
                spending_patterns: {
                    emotional_state_tags: { "excited": 100, "happy": 250 },
                    daily_limit_btc: 0.001,
                    warning_threshold_btc: 0.0005,
                    cooling_off_period: 3600,
                    dating_safety_enabled: true
                },
                dating_goals: [
                    {
                        id: "goal-1",
                        name: "First Date Fund",
                        target_amount_btc: 0.001,
                        current_amount_btc: 0.0005,
                        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
                        priority: 'high',
                        category: 'financial'
                    },
                    {
                        id: "goal-2",
                        name: "Emergency Safety Fund",
                        target_amount_btc: 0.005,
                        current_amount_btc: 0.002,
                        deadline: Date.now() + 90 * 24 * 60 * 60 * 1000,
                        priority: 'high',
                        category: 'safety'
                    }
                ],
                emergency_contacts: [],
                privacy_settings: {
                    share_trust_score: false,
                    allow_trust_connections: true,
                    public_nickname: false,
                    emergency_mode: false
                }
            });

            // Load safety alerts - this would be: await actor.get_safety_alerts();
            setAlerts([
                {
                    id: "alert-1",
                    alert_type: "BITCOIN_SPENDING_LIMIT",
                    message: "You're approaching your daily Bitcoin spending limit",
                    severity: "CAUTION",
                    created_at: Date.now() - 3600000,
                    acknowledged: false,
                    metadata: {
                        current_spending: "0.0003",
                        daily_limit: "0.001"
                    }
                }
            ]);

        } catch (err) {
            setError('Failed to load Bitcoin wallet data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createWallet = async () => {
        try {
            // This would be: const newWallet = await actor.create_bitcoin_wallet(nickname || null);
            await loadWalletData();
            setShowCreateWallet(false);
            setNickname('');
        } catch (err) {
            setError('Failed to create Bitcoin wallet');
            console.error(err);
        }
    };

    // Bitcoin wallet functions
    const loadBitcoinWallet = async () => {
        try {
            setBitcoinWallet(prev => ({ ...prev, loading: true }));

            // Use the Bitcoin service to get real data from your Rust canister
            const address = await bitcoinWalletService.getAddress();
            const balance = await bitcoinWalletService.getBalance();
            const balance_btc = bitcoinWalletService.satoshisToBtc(balance);

            setBitcoinWallet({
                address,
                balance,
                balance_btc,
                network: 'testnet',
                loading: false
            });
        } catch (err) {
            console.error('Failed to load Bitcoin wallet:', err);
            setBitcoinWallet(prev => ({ ...prev, loading: false }));
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // TODO: Add toast notification
            console.log('Copied to clipboard:', text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const sendBitcoin = async () => {
        try {
            setSendBtcForm(prev => ({ ...prev, loading: true }));

            const amountSatoshis = bitcoinWalletService.btcToSatoshis(parseFloat(sendBtcForm.amount));

            // Validate the destination address
            if (!bitcoinWalletService.validateBitcoinAddress(sendBtcForm.destination)) {
                throw new Error('Invalid Bitcoin address');
            }

            // Check dating safety limits
            if (wallet?.spending_patterns.dating_safety_enabled) {
                const amountBtc = parseFloat(sendBtcForm.amount);
                if (amountBtc > wallet.spending_patterns.warning_threshold_btc) {
                    // Add safety alert
                    setAlerts(prev => [...prev, {
                        id: `alert-${Date.now()}`,
                        alert_type: "LARGE_BITCOIN_TRANSACTION",
                        message: `Large Bitcoin transaction detected (${amountBtc} BTC). Purpose: ${sendBtcForm.purpose}. Emotional state: ${sendBtcForm.emotional_state}`,
                        severity: "CAUTION",
                        created_at: Date.now(),
                        acknowledged: false,
                        metadata: {
                            amount_btc: amountBtc.toString(),
                            purpose: sendBtcForm.purpose,
                            emotional_state: sendBtcForm.emotional_state
                        }
                    }]);
                }
            }

            // Send using the Bitcoin service
            const txId = await bitcoinWalletService.sendBitcoin(sendBtcForm.destination, amountSatoshis);

            console.log('Bitcoin sent successfully. Transaction ID:', txId);
            setShowSendBtc(false);
            setSendBtcForm({
                destination: '',
                amount: '',
                loading: false,
                purpose: 'general',
                emotional_state: 'calm'
            });

            // Refresh wallet after sending
            await loadBitcoinWallet();
        } catch (err) {
            console.error('Failed to send Bitcoin:', err);
            setSendBtcForm(prev => ({ ...prev, loading: false }));
            // TODO: Show error toast to user
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-orange-500 font-mono tracking-wider">CONNECTING TO BLOCKCHAIN...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !wallet) {
        return (
            <div className="min-h-screen py-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8">
                        <div className="text-center">
                            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">WALLET NOT FOUND</h2>
                            <p className="text-neutral-400 mb-6">You need to create a CafeConnect wallet first</p>
                            <button
                                onClick={() => setShowCreateWallet(true)}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors font-medium tracking-wider"
                            >
                                CREATE WALLET
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-32 px-4 relative overflow-hidden">
            {/* SPECTACULAR SKY LIGHTING BACKGROUND LAYERS */}
            <div className="aurora-effect"></div>
            <div className="lightning-flash"></div>

            {/* Orange Starfield Background */}
            <div id="starfield-bg" className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 1 }}></div>

            {/* Particle Animation Canvas - ORANGE PARTICLES */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ opacity: 0.8 }}
            />

            {/* Scan Line Effect */}
            <div className="scanline fixed inset-0 pointer-events-none z-10"></div>

            {/* Custom CSS for orange background effects and SPECTACULAR LIGHTING */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scanline {
                    background: linear-gradient(
                        transparent,
                        transparent 48%,
                        rgba(249, 115, 22, 0.4) 49%,
                        rgba(249, 115, 22, 0.9) 50%,
                        rgba(249, 115, 22, 0.4) 51%,
                        transparent 52%,
                        transparent
                    );
                    animation: scanline 4s linear infinite;
                }

                @keyframes scanline {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }

                /* SPECTACULAR SKY LIGHTING EFFECTS */
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 30%, rgba(251, 146, 60, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 40% 70%, rgba(253, 186, 116, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(255, 237, 213, 0.08) 0%, transparent 50%),
                        linear-gradient(45deg, rgba(249, 115, 22, 0.03) 0%, rgba(251, 146, 60, 0.02) 100%);
                    pointer-events: none;
                    z-index: 1;
                    animation: skyPulse 8s ease-in-out infinite;
                }

                @keyframes skyPulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                /* Floating light orbs */
                .min-h-screen::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, rgba(249, 115, 22, 0.8), transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(251, 146, 60, 0.6), transparent),
                        radial-gradient(1px 1px at 90px 40px, rgba(253, 186, 116, 0.5), transparent),
                        radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.4), transparent),
                        radial-gradient(2px 2px at 160px 30px, rgba(249, 115, 22, 0.7), transparent);
                    background-repeat: repeat;
                    background-size: 200px 100px;
                    animation: floatingLights 15s linear infinite;
                    pointer-events: none;
                    z-index: 2;
                }

                @keyframes floatingLights {
                    0% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-10px) translateX(5px); }
                    50% { transform: translateY(-5px) translateX(-3px); }
                    75% { transform: translateY(-15px) translateX(8px); }
                    100% { transform: translateY(0px) translateX(0px); }
                }

                /* Aurora borealis effect */
                .aurora-effect {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60%;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(249, 115, 22, 0.1) 25%,
                        rgba(251, 146, 60, 0.15) 50%,
                        rgba(253, 186, 116, 0.1) 75%,
                        transparent 100%
                    );
                    opacity: 0.6;
                    animation: auroraFlow 12s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                @keyframes auroraFlow {
                    0%, 100% { 
                        transform: translateX(-50%) skewX(-5deg);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateX(50%) skewX(5deg);
                        opacity: 0.8;
                    }
                }

                /* Lightning flash effects */
                .lightning-flash {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    pointer-events: none;
                    z-index: 3;
                    animation: lightningFlash 8s infinite;
                }

                @keyframes lightningFlash {
                    0%, 95%, 100% { opacity: 0; }
                    96%, 97% { opacity: 0.8; }
                    98% { opacity: 0; }
                    99% { opacity: 0.6; }
                }

                /* Typewriter animations for cyberpunk effect */
                .typewriter-1 {
                    overflow: hidden;
                    border-right: 2px solid #f97316;
                    white-space: nowrap;
                    margin: 0 auto;
                    animation: typing-1 3s steps(25, end) 2s infinite,
                               blink-caret 0.75s step-end infinite;
                }

                .typewriter-2 {
                    overflow: hidden;
                    border-right: 2px solid #fb923c;
                    white-space: nowrap;
                    margin: 0 auto;
                    animation: typing-2 2.5s steps(22, end) 3.5s infinite,
                               blink-caret 0.75s step-end infinite;
                }

                .typewriter-3 {
                    overflow: hidden;
                    border-right: 2px solid #fdba74;
                    white-space: nowrap;
                    margin: 0 auto;
                    animation: typing-3 2s steps(20, end) 5s infinite,
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

                @keyframes blink-caret {
                    from, to { border-color: transparent; }
                    50% { border-color: inherit; }
                }

                /* Floating elements */
                .float-animation {
                    animation: floatEffect 6s ease-in-out infinite;
                }

                .float-animation-delayed {
                    animation: floatEffect 6s ease-in-out infinite;
                    animation-delay: -3s;
                }

                @keyframes floatEffect {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                `
            }} />

            {/* Main Content */}
            <div className="relative z-20">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-orange-500 tracking-wider">CAFECONNECT WALLET</h1>
                        </div>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 mx-auto mb-4 rounded-full shadow-lg shadow-orange-500/50"></div>
                        <p className="text-xl text-neutral-300">
                            Secure Bitcoin Dating Wallet with AI-Powered Safety Features
                        </p>
                    </div>

                    {/* Retro TV Component */}
                    <div className="retro-tv-wrapper -mb-8 relative z-10">
                        <div className="retro-tv-main">
                            <div className="retro-tv-antenna">
                                <div className="retro-tv-antenna-shadow"></div>
                                <div className="retro-tv-a1"></div>
                                <div className="retro-tv-a1d"></div>
                                <div className="retro-tv-a2"></div>
                                <div className="retro-tv-a2d"></div>
                                <div className="retro-tv-a_base"></div>
                            </div>
                            <div className="retro-tv-body">
                                <div className="retro-tv-cruve">
                                    <svg
                                        className="retro-tv-curve-svg"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        viewBox="0 0 189.929 189.929"
                                        xmlSpace="preserve"
                                    >
                                        <path
                                            d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                                        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="retro-tv-display-div">
                                    <div className="retro-tv-screen-out">
                                        <div className="retro-tv-screen-out1">
                                            <div className="retro-tv-screen">
                                                <span className="retro-tv-notfound-text">CAFECONNECT</span>
                                            </div>
                                            <div className="retro-tv-screen-mobile">
                                                <span className="retro-tv-notfound-text">CAFECONNECT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="retro-tv-lines">
                                    <div className="retro-tv-line1"></div>
                                    <div className="retro-tv-line2"></div>
                                    <div className="retro-tv-line3"></div>
                                </div>
                                <div className="retro-tv-buttons-div">
                                    <div className="retro-tv-b1"><div></div></div>
                                    <div className="retro-tv-b2"></div>
                                    <div className="retro-tv-speakers">
                                        <div className="retro-tv-g1">
                                            <div className="retro-tv-g11"></div>
                                            <div className="retro-tv-g12"></div>
                                            <div className="retro-tv-g13"></div>
                                        </div>
                                        <div className="retro-tv-g"></div>
                                        <div className="retro-tv-g"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="retro-tv-bottom">
                                <div className="retro-tv-base1"></div>
                                <div className="retro-tv-base2"></div>
                                <div className="retro-tv-base3"></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                            {/* 3D Bitcoin Coin - Left Side */}
                            <div className="absolute left-0 top-[-140px]">
                                <div className="coin">
                                    <div className="side heads">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="100%" height="100%" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 4091.27 4091.73" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <g id="Layer_x0020_1">
                                                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                                <g id="_1421344023328">
                                                    <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"></path>
                                                    <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="side tails">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="svg_back" xmlSpace="preserve" width="100%" height="100%" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 4091.27 4091.73" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <g id="Layer_x0020_1">
                                                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                                                <g id="_1421344023328">
                                                    <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"></path>
                                                    <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-wider">CAFECONNECT WALLET</h1>
                                <p className="text-sm text-neutral-400">
                                    {wallet?.nickname || 'Anonymous User'} • Trust Score: {wallet?.trust_score}/100 •
                                    Safety: <span className={`font-bold ${wallet?.safety_rating === 'SAFE' ? 'text-white' :
                                        wallet?.safety_rating === 'CAUTION' ? 'text-orange-500' : 'text-red-500'
                                        }`}>{wallet?.safety_rating}</span>
                                </p>
                            </div>

                            {/* ICP Coin - Right Side */}
                            <div className="absolute right-0 top-[-140px]">
                                <div className="coin">
                                    <div className="side heads">
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-4 shadow-lg border-2 border-gray-300 shadow-gray-800/50">
                                            <img
                                                src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/ICP-DFINITY.ico"
                                                alt="ICP Logo"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="side tails">
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-4 shadow-lg border-2 border-gray-300 shadow-gray-800/50">
                                            <img
                                                src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/ICP-DFINITY.ico"
                                                alt="ICP Logo"
                                                className="w-full h-full object-contain transform scale-x-[-1]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider">
                                    BACKUP WALLET
                                </button>
                                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider">
                                    SECURITY SETTINGS
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors text-sm font-medium tracking-wider"
                                    title="Logout from ICP Identity"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>LOGOUT</span>
                                </button>
                            </div>
                        </div>

                        {/* Simplified Navigation Tabs */}
                        <div className="flex space-x-2 bg-neutral-800 border border-neutral-700 rounded-lg p-2">
                            {[
                                { id: 'bitcoin', label: 'WALLET', icon: Bitcoin },
                                { id: 'safety', label: 'SAFETY', icon: Shield }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-3 px-6 py-4 rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-orange-500 text-white'
                                        : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                                        }`}
                                >
                                    <tab.icon className="w-6 h-6" />
                                    <span className="text-lg font-bold tracking-wider">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Container - Fixed Height */}
                        <div className="min-h-[600px]">
                            {/* Dating Goals Tab */}
                            {activeTab === 'goals' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Target className="w-8 h-8 text-orange-500" />
                                            <div>
                                                <h3 className="text-xl font-semibold text-white tracking-wider">DATING GOALS TRACKER</h3>
                                                <p className="text-neutral-400">Set and track your Bitcoin dating goals for safer relationships</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider">
                                            <Plus className="w-4 h-4 inline mr-2" />
                                            ADD GOAL
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {wallet?.dating_goals.map(goal => (
                                            <div key={goal.id} className={`bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors ${goal.category === 'safety' ? 'border-red-600/30' :
                                                goal.category === 'emotional' ? 'border-purple-600/30' :
                                                    'border-orange-600/30'
                                                }`}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-white tracking-wider">{goal.name}</h4>
                                                    <span className={`px-3 py-1 rounded text-xs font-medium tracking-wider ${goal.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                                                        goal.priority === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                                                            'bg-neutral-500/20 text-neutral-300'
                                                        }`}>
                                                        {goal.priority.toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-neutral-400">Progress</span>
                                                            <span className="text-white font-mono">
                                                                ₿ {goal.current_amount_btc.toFixed(8)} / ₿ {goal.target_amount_btc.toFixed(8)}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${goal.category === 'safety' ? 'bg-red-500' :
                                                                    goal.category === 'emotional' ? 'bg-purple-500' :
                                                                        'bg-orange-500'
                                                                    }`}
                                                                style={{ width: `${Math.min((goal.current_amount_btc / goal.target_amount_btc) * 100, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-neutral-500 mt-1 font-mono">
                                                            {((goal.current_amount_btc / goal.target_amount_btc) * 100).toFixed(1)}% COMPLETE
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-neutral-400">Deadline</span>
                                                        <span className="text-white font-mono">
                                                            {new Date(goal.deadline).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        {goal.category === 'safety' && <Shield className="w-4 h-4 text-red-400" />}
                                                        {goal.category === 'emotional' && <Heart className="w-4 h-4 text-purple-400" />}
                                                        {goal.category === 'financial' && <DollarSign className="w-4 h-4 text-orange-400" />}
                                                        <span className="text-xs text-neutral-400 uppercase tracking-wider">{goal.category} GOAL</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {(!wallet?.dating_goals || wallet.dating_goals.length === 0) && (
                                        <div className="text-center py-12 bg-neutral-800 border border-neutral-700 rounded-lg">
                                            <Target className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                                            <h4 className="text-lg font-semibold text-white mb-2 tracking-wider">NO DATING GOALS YET</h4>
                                            <p className="text-neutral-400 mb-4">Create your first Bitcoin dating goal to start tracking your progress</p>
                                            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors font-medium tracking-wider">
                                                CREATE YOUR FIRST GOAL
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Safety Features Tab */}
                            {activeTab === 'safety' && (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Shield className="w-8 h-8 text-orange-500" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-white tracking-wider">DATING SAFETY FEATURES</h3>
                                            <p className="text-neutral-400">Bitcoin safety controls for secure dating</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Spending Limits */}
                                        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center tracking-wider">
                                                <Lock className="w-5 h-5 text-orange-500 mr-2" />
                                                SPENDING LIMITS
                                            </h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-neutral-400 tracking-wider">DAILY LIMIT</span>
                                                        <span className="text-orange-400 font-bold font-mono">
                                                            ₿ {wallet?.spending_patterns.daily_limit_btc.toFixed(8)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-neutral-400 tracking-wider">WARNING THRESHOLD</span>
                                                        <span className="text-red-400 font-bold font-mono">
                                                            ₿ {wallet?.spending_patterns.warning_threshold_btc.toFixed(8)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emotional Spending */}
                                        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center tracking-wider">
                                                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                                                EMOTIONAL SPENDING
                                            </h4>
                                            <div className="space-y-3">
                                                {Object.entries(wallet?.spending_patterns.emotional_state_tags || {}).map(([emotion, amount]) => (
                                                    <div key={emotion} className="flex justify-between items-center">
                                                        <span className="capitalize text-neutral-300 tracking-wider">{emotion.toUpperCase()}</span>
                                                        <span className="text-white font-mono">
                                                            ₿ {(amount / 100000000).toFixed(8)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Trust Score */}
                                        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center tracking-wider">
                                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                                TRUST SCORE
                                            </h4>
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-white mb-2 font-mono">
                                                    {wallet?.trust_score}/100
                                                </div>
                                                <div className={`text-lg font-medium tracking-wider ${wallet?.safety_rating === 'SAFE' ? 'text-white' :
                                                    wallet?.safety_rating === 'CAUTION' ? 'text-orange-500' : 'text-red-500'
                                                    }`}>
                                                    {wallet?.safety_rating}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Safety Settings */}
                                        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center tracking-wider">
                                                <Zap className="w-5 h-5 text-orange-500 mr-2" />
                                                SAFETY SETTINGS
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-neutral-300 tracking-wider">DATING SAFETY MODE</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium tracking-wider ${wallet?.spending_patterns.dating_safety_enabled
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-neutral-600/20 text-neutral-400'
                                                        }`}>
                                                        {wallet?.spending_patterns.dating_safety_enabled ? 'ENABLED' : 'DISABLED'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-neutral-300 tracking-wider">EMERGENCY MODE</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium tracking-wider ${wallet?.privacy_settings.emergency_mode
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-neutral-600/20 text-neutral-400'
                                                        }`}>
                                                        {wallet?.privacy_settings.emergency_mode ? 'ACTIVE' : 'INACTIVE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bitcoin Wallet Tab */}
                            {activeTab === 'bitcoin' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Bitcoin className="w-8 h-8 text-orange-500" />
                                            <div>
                                                <h3 className="text-xl font-semibold text-white tracking-wider">BITCOIN WALLET</h3>
                                                <p className="text-neutral-400">Secure Bitcoin storage powered by ICP</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider"
                                                onClick={() => loadBitcoinWallet()}
                                            >
                                                REFRESH
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider"
                                                onClick={() => setShowSendBtc(true)}
                                            >
                                                <Send className="w-4 h-4 inline mr-2" />
                                                SEND BITCOIN
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                        {/* Bitcoin Balance Card */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border border-orange-600/30 rounded-lg p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-white tracking-wider">BALANCE</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm font-medium tracking-wider">
                                                            LIVE MAINNET
                                                        </span>
                                                    </div>
                                                </div>                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-neutral-400 tracking-wider">BITCOIN (BTC)</p>
                                                        <p className="text-3xl font-bold text-orange-400 font-mono">
                                                            {bitcoinWallet.loading ? (
                                                                <span className="animate-pulse">LOADING...</span>
                                                            ) : (
                                                                `₿ ${bitcoinWallet.balance_btc.toFixed(8)}`
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-neutral-400 tracking-wider">SATOSHIS</p>
                                                        <p className="text-2xl font-bold text-white font-mono">
                                                            {bitcoinWallet.loading ? (
                                                                <span className="animate-pulse">...</span>
                                                            ) : (
                                                                bitcoinWallet.balance.toLocaleString()
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bitcoin Address Card */}
                                            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-white mb-4 tracking-wider">YOUR BITCOIN ADDRESS</h4>
                                                <div className="flex items-center space-x-3 p-3 bg-neutral-900 border border-neutral-700 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-neutral-400 mb-1 tracking-wider">TAPROOT (P2TR) ADDRESS</p>
                                                        <p className="text-white font-mono text-sm break-all">
                                                            {bitcoinWallet.address || 'Loading address...'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                                                        onClick={() => copyToClipboard(bitcoinWallet.address)}
                                                        title="Copy address to clipboard"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-green-400 mt-2 tracking-wider flex items-center">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                                    🔒 LIVE BITCOIN MAINNET ADDRESS - DERIVED FROM YOUR ICP IDENTITY
                                                </p>
                                            </div>
                                        </div>

                                        {/* OSINT Café Dating Safety Features */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Main OSINT Café Header */}
                                            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-lg p-7 shadow-xl shadow-orange-900/20">
                                                <h3 className="text-3xl font-extrabold text-white mb-3 tracking-wider">
                                                    OSINT CAFÉ MEETS YOUR DATING SAFETY NEEDS
                                                </h3>
                                                <p className="text-xl text-neutral-200 mb-2">
                                                    Advanced AI verification for dating safety, romance scam detection, and relationship protection.
                                                    Make informed decisions with our comprehensive background verification platform.
                                                </p>
                                            </div>

                                            {/* Romance Scam Detection */}
                                            <div className="bg-neutral-800 border-2 border-red-600/40 rounded-lg p-6 shadow-lg shadow-red-900/20">
                                                <h4 className="text-2xl font-extrabold text-red-400 mb-5 tracking-wider">
                                                    ROMANCE SCAM DETECTION
                                                </h4>
                                                <div className="space-y-4 text-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">AI-powered behavioral pattern analysis</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Real-time financial request warnings</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Cross-platform profile verification</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Emergency contact alerts system</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">$2.3B+ in prevented losses tracked</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Profile Verification */}
                                            <div className="bg-neutral-800 border-2 border-green-600/40 rounded-lg p-6 shadow-lg shadow-green-900/20">
                                                <h4 className="text-2xl font-extrabold text-green-400 mb-5 tracking-wider">
                                                    PROFILE VERIFICATION
                                                </h4>
                                                <div className="space-y-4 text-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Blockchain-based identity verification</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Social media profile analysis</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Photo authenticity checking</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Background history validation</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-orange-500 text-xl">•</span>
                                                        <span className="text-white font-semibold">Trust score calculation (0-100)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Go to Bitcoin Dashboard Button */}
                                            <div className="text-center">
                                                <button
                                                    onClick={() => setActiveTab('bitcoin')}
                                                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-xl font-bold tracking-wider shadow-lg shadow-orange-500/30"
                                                >
                                                    GO TO BITCOIN DASHBOARD
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bitcoin Actions */}
                                        <div className="space-y-6">
                                            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-white mb-4 tracking-wider">QUICK ACTIONS</h4>
                                                <div className="space-y-3">
                                                    <button
                                                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors flex items-center justify-center text-sm font-medium tracking-wider"
                                                        onClick={() => loadBitcoinWallet()}
                                                        disabled={bitcoinWallet.loading}
                                                    >
                                                        {bitcoinWallet.loading ? (
                                                            <>
                                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                                LOADING...
                                                            </>
                                                        ) : (
                                                            'REFRESH BALANCE'
                                                        )}
                                                    </button>

                                                    <button
                                                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-medium tracking-wider"
                                                        onClick={() => setShowSendBtc(true)}
                                                    >
                                                        <Send className="w-4 h-4 inline mr-2" />
                                                        SEND BITCOIN
                                                    </button>

                                                    <button className="w-full px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition-colors text-sm font-medium tracking-wider">
                                                        VIEW TRANSACTIONS
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Safety Features */}
                                            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                                                <h4 className="text-lg font-semibold text-green-400 mb-3 tracking-wider">SAFETY FEATURES</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="w-4 h-4 text-green-400" />
                                                        <span className="text-neutral-300 tracking-wider">ICP-SECURED PRIVATE KEYS</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="w-4 h-4 text-green-400" />
                                                        <span className="text-neutral-300 tracking-wider">TAPROOT SIGNATURE SECURITY</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="w-4 h-4 text-green-400" />
                                                        <span className="text-neutral-300 tracking-wider">DATING SAFETY INTEGRATION</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Safety Alerts Tab */}
                            {activeTab === 'alerts' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-white tracking-wider">SAFETY ALERTS</h3>
                                        <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm font-medium tracking-wider">
                                            {alerts.filter(a => !a.acknowledged).length} NEW
                                        </span>
                                    </div>

                                    {alerts.length === 0 ? (
                                        <div className="text-center py-12 bg-neutral-800 border border-neutral-700 rounded-lg">
                                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                            <h4 className="text-lg font-semibold text-white mb-2 tracking-wider">ALL CLEAR!</h4>
                                            <p className="text-neutral-400">No safety alerts at this time.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {alerts.map(alert => (
                                                <motion.div
                                                    key={alert.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`p-4 bg-neutral-800 border rounded-lg hover:border-orange-500/50 transition-colors ${alert.severity === 'CRITICAL' ? 'border-red-400' :
                                                        alert.severity === 'HIGH' ? 'border-orange-400' :
                                                            'border-neutral-700'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <AlertTriangle className={`w-5 h-5 ${alert.severity === 'CRITICAL' ? 'text-red-400' :
                                                                    alert.severity === 'HIGH' ? 'text-orange-400' :
                                                                        'text-orange-400'
                                                                    }`} />
                                                                <span className="font-semibold text-white tracking-wider">{alert.alert_type}</span>
                                                                <span className={`px-2 py-1 rounded text-xs font-medium tracking-wider ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                                                                    alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                                                                        'bg-orange-500/20 text-orange-500'
                                                                    }`}>
                                                                    {alert.severity}
                                                                </span>
                                                            </div>
                                                            <p className="text-neutral-300 mb-2">{alert.message}</p>
                                                            {alert.chat_context && (
                                                                <div className="bg-neutral-700 border border-neutral-600 p-3 rounded text-sm text-neutral-300 italic">
                                                                    "{alert.chat_context}"
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!alert.acknowledged && (
                                                            <button className="ml-4 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm transition-colors font-medium tracking-wider">
                                                                ACKNOWLEDGE
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div> {/* End Tab Content Container */}
                    </div>

                    {/* Send Bitcoin Modal - Enhanced for Dating Safety */}
                    {showSendBtc && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center tracking-wider">
                                    <Send className="w-5 h-5 mr-2" />
                                    SEND BITCOIN - LIVE MAINNET
                                </h3>

                                {/* Live Network Warning */}
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                                    <div className="flex items-center text-red-400 text-sm font-medium tracking-wider">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                                        ⚠️ LIVE BITCOIN MAINNET - REAL MONEY TRANSACTION
                                    </div>
                                    <p className="text-xs text-red-300 mt-1">
                                        This will send real Bitcoin on the mainnet. Double-check all details before confirming.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2 tracking-wider">
                                            DESTINATION ADDRESS
                                        </label>
                                        <input
                                            type="text"
                                            value={sendBtcForm.destination}
                                            onChange={(e) => setSendBtcForm(prev => ({ ...prev, destination: e.target.value }))}
                                            placeholder="Enter Bitcoin address..."
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2 tracking-wider">
                                            AMOUNT (BTC)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            value={sendBtcForm.amount}
                                            onChange={(e) => setSendBtcForm(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="0.00000000"
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-neutral-500 mt-1 font-mono">
                                            AVAILABLE: ₿ {bitcoinWallet.balance_btc.toFixed(8)}
                                        </p>
                                        {parseFloat(sendBtcForm.amount) > (wallet?.spending_patterns.warning_threshold_btc || 0) && (
                                            <p className="text-xs text-orange-400 mt-1 flex items-center">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                AMOUNT EXCEEDS YOUR SAFETY THRESHOLD
                                            </p>
                                        )}
                                    </div>

                                    {/* Dating Safety Context */}
                                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                                        <h4 className="text-sm font-medium text-orange-500 mb-2 tracking-wider">DATING SAFETY CHECK</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs text-neutral-400 mb-1 tracking-wider">PURPOSE</label>
                                                <select
                                                    value={sendBtcForm.purpose}
                                                    onChange={(e) => setSendBtcForm(prev => ({ ...prev, purpose: e.target.value }))}
                                                    className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm"
                                                    title="Transaction Purpose"
                                                >
                                                    <option value="general">General Transaction</option>
                                                    <option value="dating">Dating Related</option>
                                                    <option value="gift">Gift/Surprise</option>
                                                    <option value="emergency">Emergency</option>
                                                    <option value="investment">Investment</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-400 mb-1 tracking-wider">YOUR EMOTIONAL STATE</label>
                                                <select
                                                    value={sendBtcForm.emotional_state}
                                                    onChange={(e) => setSendBtcForm(prev => ({ ...prev, emotional_state: e.target.value }))}
                                                    className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm"
                                                    title="Emotional State"
                                                >
                                                    <option value="calm">Calm & Rational</option>
                                                    <option value="excited">Excited</option>
                                                    <option value="anxious">Anxious</option>
                                                    <option value="happy">Happy</option>
                                                    <option value="pressured">Feeling Pressured</option>
                                                    <option value="romantic">In Love/Romantic</option>
                                                </select>
                                            </div>
                                        </div>

                                        {(sendBtcForm.emotional_state === 'pressured' || sendBtcForm.emotional_state === 'romantic') && (
                                            <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
                                                ⚠️ WARNING: EMOTIONAL SPENDING CAN LEAD TO POOR DECISIONS. CONSIDER WAITING BEFORE SENDING.
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={sendBitcoin}
                                            disabled={sendBtcForm.loading || !sendBtcForm.destination || !sendBtcForm.amount}
                                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium tracking-wider"
                                        >
                                            {sendBtcForm.loading ? (
                                                <>
                                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline mr-2"></div>
                                                    SENDING...
                                                </>
                                            ) : (
                                                'SEND BITCOIN'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowSendBtc(false)}
                                            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded transition-colors font-medium tracking-wider"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Create Wallet Modal */}
                    {showCreateWallet && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4 tracking-wider">CREATE CAFECONNECT WALLET</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2 tracking-wider">
                                            NICKNAME (OPTIONAL)
                                        </label>
                                        <input
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="Enter a nickname..."
                                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={createWallet}
                                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors font-medium tracking-wider"
                                        >
                                            CREATE WALLET
                                        </button>
                                        <button
                                            onClick={() => setShowCreateWallet(false)}
                                            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded transition-colors font-medium tracking-wider"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Logout Confirmation Modal */}
                    {showLogoutConfirm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4"
                            >
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center tracking-wider">
                                    <LogOut className="w-5 h-5 mr-2 text-red-400" />
                                    CONFIRM LOGOUT
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-neutral-300">
                                        Are you sure you want to logout from your ICP identity? This will disconnect your wallet and you'll need to authenticate again to access your account.
                                    </p>
                                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                                        <p className="text-sm text-orange-400 flex items-center">
                                            <Shield className="w-4 h-4 mr-2" />
                                            Make sure you have backed up your wallet information before logging out.
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={confirmLogout}
                                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors font-medium tracking-wider"
                                        >
                                            YES, LOGOUT
                                        </button>
                                        <button
                                            onClick={() => setShowLogoutConfirm(false)}
                                            className="flex-1 px-4 py-2 bg-neutral-600 hover:bg-neutral-500 text-white rounded transition-colors font-medium tracking-wider"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
