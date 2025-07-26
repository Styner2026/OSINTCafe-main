import { motion } from 'framer-motion';
import { Shield, Key, Lock, Upload, FileImage, Database, FileText, Zap, Users, Globe, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { icpIdentityService } from '../services/icpIdentityService';
import { icpEncryptedNotesService, ThreatIntelNote } from '../services/icpEncryptedNotesService';
import { icpPhotoGalleryService, ThreatIntelImage } from '../services/icpPhotoGalleryService';
import toast from 'react-hot-toast';

const EncryptedGallery = () => {
    // State management
    const [isICPAuthenticated, setIsICPAuthenticated] = useState(false);
    const [icpConnectionStatus, setIcpConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [encryptedNotes, setEncryptedNotes] = useState<ThreatIntelNote[]>([]);
    const [galleryImages, setGalleryImages] = useState<ThreatIntelImage[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    // Form states
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [newNoteCategory, setNewNoteCategory] = useState('personal');
    const [isCreatingNote, setIsCreatingNote] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Video controls
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Video control functions
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleVideoClick = () => {
        toggleMute();
    };

    // Auto-play video and setup starfield when component mounts
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch(console.error);
            const handlePause = () => {
                if (video.paused) {
                    video.play().catch(console.error);
                }
            };
            video.addEventListener('pause', handlePause);

            // Cleanup function
            return () => {
                video.removeEventListener('pause', handlePause);
            };
        }

        // Starfield animation
        const starfield = document.getElementById('starfield-bg');
        if (starfield) {
            // Clear any existing stars
            starfield.innerHTML = '';

            // Create stars
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'absolute bg-white rounded-full opacity-70';
                star.style.width = Math.random() * 3 + 1 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animation = 'twinkle 3s infinite';
                starfield.appendChild(star);
            }

            // Add CSS for twinkling animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // ICP Authentication
    const handleICPAuthentication = async () => {
        try {
            setIcpConnectionStatus('connecting');
            const result = await icpIdentityService.login();
            setIsICPAuthenticated(result.success);
            setIcpConnectionStatus(result.success ? 'connected' : 'disconnected');

            if (result.success) {
                toast.success('🚀 Connected to ICP Network!');
                loadData();
            } else {
                toast.error('Failed to connect to ICP');
            }
        } catch (error) {
            console.error('ICP authentication failed:', error);
            setIcpConnectionStatus('disconnected');
            toast.error('ICP authentication failed');
        }
    };

    // Load data from ICP services
    const loadData = async () => {
        try {
            setIsLoadingNotes(true);
            setIsLoadingImages(true);

            const [notes, images] = await Promise.all([
                icpEncryptedNotesService.getThreatIntelNotes(),
                icpPhotoGalleryService.getThreatIntelImages()
            ]);

            setEncryptedNotes(notes);
            setGalleryImages(images);

            console.log(`✅ Loaded ${notes.length} encrypted notes and ${images.length} gallery images`);
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            toast.error('Failed to load data from ICP');
        } finally {
            setIsLoadingNotes(false);
            setIsLoadingImages(false);
        }
    };

    // Create encrypted note
    const createEncryptedNote = async () => {
        if (!newNoteTitle.trim() || !newNoteContent.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsCreatingNote(true);
            await icpEncryptedNotesService.createThreatIntelNote({
                title: newNoteTitle,
                content: newNoteContent,
                category: newNoteCategory,
                threatLevel: 'low',
                isEncrypted: true,
                sharedWith: []
            });

            toast.success('🔐 Note encrypted and stored on ICP!');
            setNewNoteTitle('');
            setNewNoteContent('');
            loadData();
        } catch (error) {
            console.error('Failed to create note:', error);
            toast.error('Failed to create encrypted note');
        } finally {
            setIsCreatingNote(false);
        }
    };

    // Handle image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        try {
            setIsUploadingImage(true);
            await icpPhotoGalleryService.uploadThreatIntelImage(file, {
                category: 'personal',
                threatLevel: 'low',
                description: `Uploaded image: ${file.name}`
            });

            toast.success('📸 Image uploaded to decentralized gallery!');
            loadData();
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg relative overflow-hidden">
            {/* Custom CSS for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
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

                .scanline {
                    background: linear-gradient(
                        transparent,
                        transparent 48%,
                        rgba(0, 245, 255, 0.4) 49%,
                        rgba(0, 245, 255, 0.9) 50%,
                        rgba(0, 245, 255, 0.4) 51%,
                        transparent 52%,
                        transparent
                    );
                    animation: scanline 4s linear infinite;
                }

                @keyframes scanline {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }

                .cyber-glow {
                    text-shadow: 0 0 20px rgba(0,245,255,0.8), 0 0 40px rgba(0,245,255,0.4);
                    background: linear-gradient(45deg, #00f5ff, #39ff14);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .glass-card {
                    backdrop-filter: blur(16px);
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 245, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
                }

                .pulse-glow {
                    animation: pulseGlow 2s ease-in-out infinite alternate;
                }

                @keyframes pulseGlow {
                    from { box-shadow: 0 0 20px rgba(0,245,255,0.3); }
                    to { box-shadow: 0 0 40px rgba(0,245,255,0.6), 0 0 60px rgba(57,255,20,0.3); }
                }

                /* Animated Code Cards */
                .code-card {
                    position: relative;
                    height: 300px;
                    width: 230px;
                }
                .code-card:nth-child(2) {
                    filter: hue-rotate(300deg) brightness(1.3);
                }
                .code-card:nth-child(3) {
                    filter: hue-rotate(200deg) brightness(1.5);
                }
                .code-card:nth-child(4) {
                    filter: hue-rotate(60deg) brightness(3);
                }
                .code-card .boxshadow {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    border: 1px solid rgb(0, 217, 255);
                    transform: scale(0.8);
                    box-shadow: rgb(0, 217, 255) 0px 30px 70px 0px;
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }
                .code-card .main {
                    width: 230px;
                    height: 300px;
                    overflow: hidden;
                    background: rgb(0, 255, 149);
                    background: linear-gradient(
                        0deg,
                        #3e0000 0%,
                        rgb(0, 247, 255) 60%,
                        #3e0000 100%
                    );
                    position: relative;
                    clip-path: polygon(
                        0 0,
                        100% 0,
                        100% 40px,
                        100% calc(100% - 40px),
                        calc(100% - 40px) 100%,
                        40px 100%,
                        0 calc(100% - 40px)
                    );
                    box-shadow: rgb(0, 132, 255) 0px 7px 29px 0px;
                    transition: all 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }
                .code-card .main .top {
                    position: absolute;
                    top: 0px;
                    left: 0;
                    width: 0px;
                    height: 0px;
                    z-index: 2;
                    border-top: 115px solid black;
                    border-left: 115px solid transparent;
                    border-right: 115px solid transparent;
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }
                .code-card .main .side {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    transform: translateX(-50%);
                    height: 101%;
                    background: black;
                    clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%);
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 1s;
                }
                .code-card .main .left {
                    left: 0;
                }
                .code-card .main .right {
                    right: 0;
                    transform: translateX(50%) scale(-1, 1);
                }
                .code-card .main .title {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 90px;
                    font-weight: bold;
                    font-size: 18px;
                    opacity: 0;
                    z-index: -1;
                    transition: all 0.2s ease-out 0s;
                    color: white;
                    text-align: center;
                }
                .code-card .main .button-container {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .code-card .main .button-container .button {
                    position: absolute;
                    transform: translateX(-50%);
                    padding: 5px 10px;
                    clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%);
                    background: black;
                    border: none;
                    color: white;
                    display: grid;
                    place-content: center;
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }
                .code-card .main .button-container .button .svg {
                    width: 15px;
                    transition: all 0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }
                .code-card .main .button-container .button:nth-child(1) {
                    bottom: 300px;
                    transition-delay: 0.4s;
                }
                .code-card .main .button-container .button:nth-child(2) {
                    bottom: 300px;
                    transition-delay: 0.6s;
                }
                .code-card .main .button-container .button:nth-child(3) {
                    bottom: 300px;
                    transition-delay: 0.8s;
                }
                .code-card .main .button-container .button:hover .svg {
                    transform: scale(1.2);
                }
                .code-card .main .button-container .button:active .svg {
                    transform: scale(0.7);
                }
                .code-card:hover .main {
                    transform: scale(1.1);
                }
                .code-card:hover .main .top {
                    top: -50px;
                }
                .code-card:hover .main .left {
                    left: -50px;
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
                }
                .code-card:hover .main .right {
                    right: -50px;
                    transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s;
                }
                .code-card:hover .main .title {
                    opacity: 1;
                    transition: all 0.2s ease-out 1.3s;
                }
                .code-card:hover .main .button-container .button:nth-child(1) {
                    bottom: 80px;
                    transition-delay: 0.8s;
                }
                .code-card:hover .main .button-container .button:nth-child(2) {
                    bottom: 40px;
                    transition-delay: 0.6s;
                }
                .code-card:hover .main .button-container .button:nth-child(3) {
                    bottom: 0;
                    transition-delay: 0.4s;
                }

                /* Connection Loader Animation */
                .loader {
                    --size: 200px;
                    --duration: 2s;
                    --logo-color: #00f5ff;
                    --background: linear-gradient(
                        0deg,
                        rgba(0, 245, 255, 0.1) 0%,
                        rgba(57, 255, 20, 0.1) 100%
                    );
                    height: var(--size);
                    aspect-ratio: 1;
                    position: relative;
                }

                .loader .box {
                    position: absolute;
                    background: rgba(0, 245, 255, 0.05);
                    background: var(--background);
                    border-radius: 50%;
                    border-top: 1px solid rgba(0, 245, 255, 0.8);
                    box-shadow: rgba(0, 245, 255, 0.3) 0px 10px 10px -0px;
                    backdrop-filter: blur(5px);
                    animation: ripple var(--duration) infinite ease-in-out;
                }

                .loader .box:nth-child(1) {
                    inset: 40%;
                    z-index: 99;
                }

                .loader .box:nth-child(2) {
                    inset: 30%;
                    z-index: 98;
                    border-color: rgba(0, 245, 255, 0.6);
                    animation-delay: 0.2s;
                }

                .loader .box:nth-child(3) {
                    inset: 20%;
                    z-index: 97;
                    border-color: rgba(57, 255, 20, 0.4);
                    animation-delay: 0.4s;
                }

                .loader .box:nth-child(4) {
                    inset: 10%;
                    z-index: 96;
                    border-color: rgba(57, 255, 20, 0.3);
                    animation-delay: 0.6s;
                }

                .loader .box:nth-child(5) {
                    inset: 0%;
                    z-index: 95;
                    border-color: rgba(255, 107, 53, 0.2);
                    animation-delay: 0.8s;
                }

                .loader .logo {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-content: center;
                    padding: 30%;
                }

                .loader .logo svg {
                    fill: var(--logo-color);
                    width: 100%;
                    animation: color-change var(--duration) infinite ease-in-out;
                }

                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        box-shadow: rgba(0, 245, 255, 0.3) 0px 10px 10px -0px;
                    }
                    50% {
                        transform: scale(1.3);
                        box-shadow: rgba(0, 245, 255, 0.6) 0px 30px 20px -0px;
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: rgba(0, 245, 255, 0.3) 0px 10px 10px -0px;
                    }
                }

                @keyframes color-change {
                    0% {
                        fill: var(--logo-color);
                    }
                    50% {
                        fill: white;
                    }
                    100% {
                        fill: var(--logo-color);
                    }
                }

                /* Floating Phone Animation */
                .phone-card {
                    width: 150px;
                    height: 300px;
                    background: black;
                    border-radius: 25px;
                    border: 2px solid rgba(0, 245, 255, 0.4);
                    padding: 5px;
                    position: relative;
                    box-shadow: 0 8px 30px rgba(0, 245, 255, 0.3);
                    animation: phoneFloat 4s ease-in-out infinite;
                }

                .phone-card-int {
                    background-image: linear-gradient(
                        to right bottom,
                        rgba(0, 245, 255, 0.1),
                        rgba(57, 255, 20, 0.1),
                        rgba(255, 107, 53, 0.1),
                        rgba(0, 245, 255, 0.05),
                        rgba(57, 255, 20, 0.05),
                        rgba(255, 107, 53, 0.05),
                        rgba(0, 0, 0, 0.8),
                        rgba(26, 26, 26, 0.9)
                    );
                    background-size: 200% 200%;
                    background-position: 0% 0%;
                    height: 100%;
                    border-radius: 20px;
                    transition: all 0.6s ease-out;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }

                .phone-card:hover .phone-card-int {
                    background-position: 100% 100%;
                    box-shadow: inset 0 0 20px rgba(0, 245, 255, 0.2);
                }

                .phone-top {
                    position: absolute;
                    top: 0px;
                    right: 50%;
                    transform: translate(50%, 0%);
                    width: 35%;
                    height: 12px;
                    background-color: rgb(1, 1, 1);
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }

                .phone-speaker {
                    position: absolute;
                    top: 2px;
                    right: 50%;
                    transform: translate(50%, 0%);
                    width: 40%;
                    height: 1px;
                    border-radius: 2px;
                    background-color: rgb(20, 20, 20);
                }

                .phone-camera {
                    position: absolute;
                    top: 4px;
                    right: 84%;
                    transform: translate(50%, 0%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: rgba(0, 245, 255, 0.6);
                    box-shadow: 0 0 8px rgba(0, 245, 255, 0.8);
                }

                .phone-camera-int {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    border-radius: 50%;
                    top: 50%;
                    right: 50%;
                    transform: translate(50%, -50%);
                    background-color: rgba(0, 245, 255, 0.9);
                }

                .phone-btn1,
                .phone-btn2,
                .phone-btn3 {
                    position: absolute;
                    width: 2px;
                    height: 30px;
                    top: 25%;
                    right: -4px;
                    background: linear-gradient(
                        to bottom,
                        rgba(0, 245, 255, 0.3),
                        rgba(0, 245, 255, 0.1),
                        rgba(0, 0, 0, 0.5)
                    );
                    border-radius: 1px;
                }

                .phone-btn2,
                .phone-btn3 {
                    left: -4px;
                    height: 20px;
                }

                .phone-btn2 {
                    top: 22%;
                }

                .phone-btn3 {
                    top: 32%;
                }

                .phone-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 20px 10px;
                    position: relative;
                }

                .phone-image {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid rgba(0, 245, 255, 0.6);
                    animation: phonePulse 2s ease-in-out infinite;
                    box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
                }

                @keyframes phonePulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
                        border-color: rgba(0, 245, 255, 0.6);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 30px rgba(0, 245, 255, 0.8), 0 0 40px rgba(57, 255, 20, 0.3);
                        border-color: rgba(57, 255, 20, 0.8);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
                        border-color: rgba(0, 245, 255, 0.6);
                    }
                }

                @keyframes phoneFloat {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg); 
                        box-shadow: 0 8px 30px rgba(0, 245, 255, 0.3);
                    }
                    50% { 
                        transform: translateY(-15px) rotate(1deg); 
                        box-shadow: 0 15px 40px rgba(0, 245, 255, 0.5);
                    }
                }

                /* Animated Rainbow Card */
                .rainbow-card {
                    width: 180px;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 20px 15px;
                    background: linear-gradient(135deg, #000, #1a1a1a, #333);
                    border-radius: 15px;
                    border: none;
                    color: white;
                    position: relative;
                    cursor: pointer;
                    font-weight: 900;
                    transition-duration: 0.3s;
                    overflow: hidden;
                }

                .rainbow-card:before, 
                .rainbow-card:after {
                    content: '';
                    position: absolute;
                    left: -2px;
                    top: -2px;
                    border-radius: 15px;
                    background: linear-gradient(45deg, 
                        #00f5ff, #39ff14, #ff6b35, #00f5ff, #39ff14, 
                        #ff6b35, #00f5ff, #39ff14, #ff6b35, #00f5ff);
                    background-size: 400%;
                    width: calc(100% + 4px);
                    height: calc(100% + 4px);
                    z-index: -1;
                    animation: rainbow-steam 8s linear infinite;
                }

                .rainbow-card:after {
                    filter: blur(20px);
                    opacity: 0.7;
                }

                .rainbow-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 10px 30px rgba(0, 245, 255, 0.4);
                }

                .rainbow-card-content {
                    text-align: center;
                    z-index: 2;
                    position: relative;
                }

                @keyframes rainbow-steam {
                    0% {
                        background-position: 0% 0%;
                    }
                    50% {
                        background-position: 400% 0%;
                    }
                    100% {
                        background-position: 0% 0%;
                    }
                }

                /* Animated Ghost Character */
                #ghost {
                    position: relative;
                    scale: 0.8;
                }

                #red {
                    animation: upNDown infinite 0.5s;
                    position: relative;
                    width: 140px;
                    height: 140px;
                    display: grid;
                    grid-template-columns: repeat(14, 1fr);
                    grid-template-rows: repeat(14, 1fr);
                    grid-column-gap: 0px;
                    grid-row-gap: 0px;
                    grid-template-areas:
                        "a1  a2  a3  a4  a5  top0  top0  top0  top0  a10 a11 a12 a13 a14"
                        "b1  b2  b3  top1 top1 top1 top1 top1 top1 top1 top1 b12 b13 b14"
                        "c1 c2 top2 top2 top2 top2 top2 top2 top2 top2 top2 top2 c13 c14"
                        "d1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 d14"
                        "e1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 e14"
                        "f1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 f14"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
                        "st0 st0 an4 st1 an7 st2 an10 an10 st3 an13 st4 an16 st5 st5"
                        "an1 an2 an3 an5 an6 an8 an9 an9 an11 an12 an14 an15 an17 an18";
                }

                @keyframes upNDown {
                    0%, 49% {
                        transform: translateY(0px);
                    }
                    50%, 100% {
                        transform: translateY(-10px);
                    }
                }

                #top0, #top1, #top2, #top3, #top4, #st0, #st1, #st2, #st3, #st4, #st5 {
                    background-color: #00f5ff;
                }

                #top0 { grid-area: top0; }
                #top1 { grid-area: top1; }
                #top2 { grid-area: top2; }
                #top3 { grid-area: top3; }
                #top4 { grid-area: top4; }
                #st0 { grid-area: st0; }
                #st1 { grid-area: st1; }
                #st2 { grid-area: st2; }
                #st3 { grid-area: st3; }
                #st4 { grid-area: st4; }
                #st5 { grid-area: st5; }

                #an1 { grid-area: an1; animation: flicker0 infinite 0.5s; }
                #an18 { grid-area: an18; animation: flicker0 infinite 0.5s; }
                #an2 { grid-area: an2; animation: flicker1 infinite 0.5s; }
                #an17 { grid-area: an17; animation: flicker1 infinite 0.5s; }
                #an3 { grid-area: an3; animation: flicker1 infinite 0.5s; }
                #an16 { grid-area: an16; animation: flicker1 infinite 0.5s; }
                #an4 { grid-area: an4; animation: flicker1 infinite 0.5s; }
                #an15 { grid-area: an15; animation: flicker1 infinite 0.5s; }
                #an6 { grid-area: an6; animation: flicker0 infinite 0.5s; }
                #an12 { grid-area: an12; animation: flicker0 infinite 0.5s; }
                #an7 { grid-area: an7; animation: flicker0 infinite 0.5s; }
                #an13 { grid-area: an13; animation: flicker0 infinite 0.5s; }
                #an9 { grid-area: an9; animation: flicker1 infinite 0.5s; }
                #an10 { grid-area: an10; animation: flicker1 infinite 0.5s; }
                #an8 { grid-area: an8; animation: flicker0 infinite 0.5s; }
                #an11 { grid-area: an11; animation: flicker0 infinite 0.5s; }

                @keyframes flicker0 {
                    0%, 49% {
                        background-color: #00f5ff;
                    }
                    50%, 100% {
                        background-color: transparent;
                    }
                }

                @keyframes flicker1 {
                    0%, 49% {
                        background-color: transparent;
                    }
                    50%, 100% {
                        background-color: #00f5ff;
                    }
                }

                #eye {
                    width: 40px;
                    height: 50px;
                    position: absolute;
                    top: 30px;
                    left: 10px;
                }

                #eye::before {
                    content: "";
                    background-color: white;
                    width: 20px;
                    height: 50px;
                    transform: translateX(10px);
                    display: block;
                    position: absolute;
                }

                #eye::after {
                    content: "";
                    background-color: white;
                    width: 40px;
                    height: 30px;
                    transform: translateY(10px);
                    display: block;
                    position: absolute;
                }

                #eye1 {
                    width: 40px;
                    height: 50px;
                    position: absolute;
                    top: 30px;
                    right: 30px;
                }

                #eye1::before {
                    content: "";
                    background-color: white;
                    width: 20px;
                    height: 50px;
                    transform: translateX(10px);
                    display: block;
                    position: absolute;
                }

                #eye1::after {
                    content: "";
                    background-color: white;
                    width: 40px;
                    height: 30px;
                    transform: translateY(10px);
                    display: block;
                    position: absolute;
                }

                #pupil {
                    width: 20px;
                    height: 20px;
                    background-color: #39ff14;
                    position: absolute;
                    top: 50px;
                    left: 10px;
                    z-index: 1;
                    animation: eyesMovement infinite 3s;
                }

                #pupil1 {
                    width: 20px;
                    height: 20px;
                    background-color: #39ff14;
                    position: absolute;
                    top: 50px;
                    right: 50px;
                    z-index: 1;
                    animation: eyesMovement infinite 3s;
                }

                @keyframes eyesMovement {
                    0%, 49% {
                        transform: translateX(0px);
                    }
                    50%, 99% {
                        transform: translateX(10px);
                    }
                    100% {
                        transform: translateX(0px);
                    }
                }

                #shadow {
                    background-color: rgba(0, 245, 255, 0.3);
                    width: 140px;
                    height: 140px;
                    position: absolute;
                    border-radius: 50%;
                    transform: rotateX(80deg);
                    filter: blur(20px);
                    top: 80%;
                    animation: shadowMovement infinite 0.5s;
                }

                @keyframes shadowMovement {
                    0%, 49% {
                        opacity: 0.5;
                    }
                    50%, 100% {
                        opacity: 0.2;
                    }
                }
                `
            }} />

            {/* Animated Starfield Background */}
            <div id="starfield-bg" className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}></div>

            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 1 }}>
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover opacity-15"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onClick={handleVideoClick}
                    style={{ cursor: 'pointer' }}
                >
                    <source src="/videos/cafe-ambiance.mp4" type="video/mp4" />
                </video>

                {/* Scanning Line Effect */}
                <div className="scanline absolute inset-0 w-full h-1 opacity-30"></div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-transparent to-cyber-green/10" style={{ zIndex: 2 }}></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden" style={{ zIndex: 10 }}>
                <div className="container mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-6 mb-8">
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-2xl flex items-center justify-center pulse-glow"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Lock className="w-10 h-10 text-dark-bg" />
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-cyber font-bold">
                                <span className="cyber-glow">ENCRYPTED</span>{' '}
                                <span className="text-cyber-green">GALLERY</span>
                            </h1>
                            <motion.div
                                className="w-20 h-20 bg-gradient-to-r from-cyber-green to-purple-500 rounded-2xl flex items-center justify-center pulse-glow"
                                animate={{
                                    rotate: [0, -5, 5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 2
                                }}
                            >
                                <FileImage className="w-10 h-10 text-dark-bg" />
                            </motion.div>
                        </div>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            🛡️ <span className="text-cyber-blue font-bold">Protect Your Dating Life</span> with Military-Grade Encryption
                        </motion.p>

                        <motion.p
                            className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                        >
                            Document red flags, save evidence, and build a secure vault of dating intelligence
                            with <span className="text-cyber-blue font-semibold">vetKeys encryption</span> and
                            <span className="text-cyber-green font-semibold"> blockchain storage</span> that only YOU control.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                        >
                            <button
                                onClick={handleICPAuthentication}
                                disabled={icpConnectionStatus === 'connecting'}
                                className="px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 disabled:opacity-50"
                            >
                                <Zap className="w-5 h-5" />
                                <span>{icpConnectionStatus === 'connecting' ? 'Connecting...' : 'Start Encrypting'}</span>
                                <Send className="w-5 h-5" />
                            </button>
                            <Link
                                to="/dating-safety"
                                className="px-8 py-4 cyber-border bg-transparent text-cyber-blue font-bold rounded-lg hover:bg-cyber-blue/10 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
                            >
                                <Shield className="w-5 h-5" />
                                <span>Dating Safety Hub</span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Code Elements */}
                <motion.div
                    className="absolute top-20 right-10 hidden lg:block"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                >
                    <div className="code-card" style={{ transform: 'scale(0.7)' }}>
                        <div className="boxshadow"></div>
                        <div className="main">
                            <div className="top"></div>
                            <div className="left side"></div>
                            <div className="right side"></div>
                            <div className="title">BLOCKCHAIN<br />VERIFIED</div>
                            <div className="button-container">
                                <button className="button" title="Blockchain Security">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#00f5ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                    </svg>
                                </button>
                                <button className="button" title="Decentralized Storage">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2 2 7l10 5 10-5-10-5z"></path>
                                        <path d="M2 17l10 5 10-5"></path>
                                    </svg>
                                </button>
                                <button className="button" title="Smart Contracts">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-10 left-10 hidden lg:block"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <div className="code-card" style={{ transform: 'scale(0.6)' }}>
                        <div className="boxshadow"></div>
                        <div className="main">
                            <div className="top"></div>
                            <div className="left side"></div>
                            <div className="right side"></div>
                            <div className="title">END-TO-END<br />ENCRYPTED</div>
                            <div className="button-container">
                                <button className="button" title="AES Encryption">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#00f5ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                        <circle cx="12" cy="16" r="1"></circle>
                                        <path d="m7 11 0-5a5 5 0 0 1 10 0v5"></path>
                                    </svg>
                                </button>
                                <button className="button" title="Private Keys">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12 6.5 9.5a1 1 0 0 1 0-1.414l2.828-2.828A1 1 0 0 1 10.742 5H19a1 1 0 0 1 1 1v8.742a1 1 0 0 1-.293.707l-2.828 2.828a1 1 0 0 1-1.414 0L12 15"></path>
                                    </svg>
                                </button>
                                <button className="button" title="Source Code">
                                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m18 16 4-4-4-4"></path>
                                        <path d="m6 8-4 4 4 4"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </section>

            {/* AI Transcript Dashboard Section */}
            <section className="py-12 px-4 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card rounded-2xl p-8 mb-8"
                    >
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* AI Avatar Section */}
                            <div className="lg:col-span-1 text-center">
                                {/* Floating Phone with Secure Vault */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="mb-8"
                                >
                                    <div className="phone-card mx-auto">
                                        <div className="phone-btn1"></div>
                                        <div className="phone-btn2"></div>
                                        <div className="phone-btn3"></div>
                                        <div className="phone-card-int">
                                            <div className="phone-display">
                                                <div className="phone-main-text">
                                                    🔐<br />
                                                    SECURE<br />
                                                    VAULT
                                                </div>
                                            </div>
                                        </div>
                                        <div className="phone-top">
                                            <div className="phone-camera">
                                                <div className="phone-camera-int"></div>
                                            </div>
                                            <div className="phone-speaker"></div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="relative mb-6"
                                    animate={{
                                        scale: [1, 1.02, 1],
                                        rotate: [0, 1, -1, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-cyber-blue to-cyber-green p-1">
                                        <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=200&fit=crop&crop=center"
                                                alt="Couple holding hands - Dating Safety"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -inset-2 rounded-full border-2 border-cyber-blue/30 animate-pulse"></div>
                                </motion.div>

                                {/* Animated Ghost Character - Security Guardian */}
                                <motion.div
                                    className="flex justify-center mb-6"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                >
                                    <div id="ghost">
                                        <div id="red">
                                            <div id="pupil"></div>
                                            <div id="pupil1"></div>
                                            <div id="eye"></div>
                                            <div id="eye1"></div>
                                            <div id="top0"></div>
                                            <div id="top1"></div>
                                            <div id="top2"></div>
                                            <div id="top3"></div>
                                            <div id="top4"></div>
                                            <div id="st0"></div>
                                            <div id="st1"></div>
                                            <div id="st2"></div>
                                            <div id="st3"></div>
                                            <div id="st4"></div>
                                            <div id="st5"></div>
                                            <div id="an1"></div>
                                            <div id="an2"></div>
                                            <div id="an3"></div>
                                            <div id="an4"></div>
                                            <div id="an5"></div>
                                            <div id="an6"></div>
                                            <div id="an7"></div>
                                            <div id="an8"></div>
                                            <div id="an9"></div>
                                            <div id="an10"></div>
                                            <div id="an11"></div>
                                            <div id="an12"></div>
                                            <div id="an13"></div>
                                            <div id="an14"></div>
                                            <div id="an15"></div>
                                            <div id="an16"></div>
                                            <div id="an17"></div>
                                            <div id="an18"></div>
                                        </div>
                                        <div id="shadow"></div>
                                    </div>
                                </motion.div>

                                <h3 className="text-2xl font-bold text-white mb-2">Platform Security Overview</h3>
                                <p className="text-gray-400 mb-4">Learn about our advanced encryption & blockchain technology</p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-sm text-cyber-green">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>End-to-End Encrypted</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-cyber-blue">
                                        <Shield className="w-4 h-4" />
                                        <span>ICP Blockchain Verified</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm text-accent-orange">
                                        <Lock className="w-4 h-4" />
                                        <span>Military-Grade Security</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transcript Interface */}
                            <div className="lg:col-span-2">
                                <div className="bg-dark-panel/50 rounded-xl p-6 border border-cyber-blue/20 h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xl font-bold text-white">Security Architecture Explained</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm text-gray-400">Live Demo</span>
                                        </div>
                                    </div>

                                    {/* Video Explanation Area - Full Height */}
                                    <div className="relative rounded-lg overflow-hidden bg-black border border-cyber-blue/30 h-full">
                                        <video
                                            className="w-full h-full object-cover"
                                            controls
                                            poster="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center"
                                        >
                                            <source src="/videos/dashboard-explanation.mp4" type="video/mp4" />
                                            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>

                                        {/* Video Overlay Info */}
                                        <div className="absolute top-4 left-4 bg-black/80 rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-white text-sm font-medium">Security Deep Dive</span>
                                            </div>
                                        </div>

                                        {/* Video Bottom Info */}
                                        <div className="absolute bottom-4 right-4 bg-black/80 rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2 text-xs text-cyber-green">
                                                <Shield className="w-3 h-3" />
                                                <span>Encryption & Blockchain • 5:30</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Code Snippets Section */}
            <section className="py-16 px-4 relative z-10 bg-dark-panel/20">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            <span className="text-cyber-blue">Security</span>{' '}
                            <span className="text-cyber-green">In Action</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Explore the code behind our military-grade encryption and blockchain verification systems
                        </p>
                    </motion.div>

                    <div className="flex justify-center items-center gap-8 flex-wrap">
                        {/* Encryption Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="code-card"
                        >
                            <div className="boxshadow"></div>
                            <div className="main">
                                <div className="top"></div>
                                <div className="left side"></div>
                                <div className="right side"></div>
                                <div className="title">AES-256<br />ENCRYPTION</div>
                                <div className="button-container">
                                    <button className="button" title="View Encryption Code">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#00f5ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                            <circle cx="12" cy="16" r="1"></circle>
                                            <path d="m7 11 0-5a5 5 0 0 1 10 0v5"></path>
                                        </svg>
                                    </button>
                                    <button className="button" title="Blockchain Verification">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                            <path d="m9 12 2 2 4-4"></path>
                                        </svg>
                                    </button>
                                    <button className="button" title="View Source">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m18 16 4-4-4-4"></path>
                                            <path d="m6 8-4 4 4 4"></path>
                                            <path d="m14.5 4-5 16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* VetKeys Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="code-card"
                        >
                            <div className="boxshadow"></div>
                            <div className="main">
                                <div className="top"></div>
                                <div className="left side"></div>
                                <div className="right side"></div>
                                <div className="title">VETKEYS<br />PROTOCOL</div>
                                <div className="button-container">
                                    <button className="button" title="Threshold Cryptography">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#00f5ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 12 6.5 9.5a1 1 0 0 1 0-1.414l2.828-2.828A1 1 0 0 1 10.742 5H19a1 1 0 0 1 1 1v8.742a1 1 0 0 1-.293.707l-2.828 2.828a1 1 0 0 1-1.414 0L12 15"></path>
                                            <path d="m12 15-3-3a22 22 0 0 1 2-1 22 22 0 0 0 1-2"></path>
                                            <path d="M7 7 4.5 4.5"></path>
                                            <path d="m3.5 5.5 2 2"></path>
                                            <path d="M14 12h.01"></path>
                                        </svg>
                                    </button>
                                    <button className="button" title="Decentralized Keys">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                                            <path d="M8 12h4l-2-2"></path>
                                            <path d="M8 12l2 2"></path>
                                        </svg>
                                    </button>
                                    <button className="button" title="Documentation">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14,2 14,8 20,8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10,9 9,9 8,9"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rust Canister Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="code-card"
                        >
                            <div className="boxshadow"></div>
                            <div className="main">
                                <div className="top"></div>
                                <div className="left side"></div>
                                <div className="right side"></div>
                                <div className="title">RUST<br />CANISTERS</div>
                                <div className="button-container">
                                    <button className="button" title="Smart Contracts">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#00f5ff" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    </button>
                                    <button className="button" title="ICP Network">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2 2 7l10 5 10-5-10-5z"></path>
                                            <path d="M2 17l10 5 10-5"></path>
                                            <path d="M2 12l10 5 10-5"></path>
                                        </svg>
                                    </button>
                                    <button className="button" title="Performance">
                                        <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 3v5h5"></path>
                                            <path d="M3 8C7 4 14 4 18 8"></path>
                                            <path d="M21 21v-5h-5"></path>
                                            <path d="M21 16c-4 4-11 4-15 0"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Code Preview Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="mt-16 glass-card rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Live Code Preview</h3>
                                <p className="text-gray-400">Hover over cards above to explore our security implementations</p>
                            </div>
                        </div>

                        <div className="bg-dark-bg/80 rounded-xl p-6 border border-cyber-blue/30">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-400 text-sm ml-2">security/encryption.rs</span>
                            </div>
                            <pre className="text-cyber-green text-sm overflow-x-auto">
                                <code>{`// AES-256-GCM Encryption for Gallery Images
use aes_gcm::{Aes256Gcm, Key, Nonce};
use ic_cdk::api::management_canister::main::raw_rand;

pub async fn encrypt_image(data: &[u8]) -> Result<Vec<u8>, String> {
    let key = generate_encryption_key().await?;
    let cipher = Aes256Gcm::new(&key);
    let nonce = generate_nonce().await?;
    
    cipher.encrypt(&nonce, data)
        .map_err(|e| format!("Encryption failed: {}", e))
}

// VetKeys threshold decryption
pub fn decrypt_with_vetkeys(
    encrypted_data: &[u8], 
    derived_key: &[u8]
) -> Result<Vec<u8>, String> {
    // Implementation uses threshold cryptography
    // Only the key holder can decrypt their data
    threshold_decrypt(encrypted_data, derived_key)
}`}</code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Animated Phone Display Section - Moved Down */}
            <section className="py-16 px-4 relative z-10">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-8">
                            <span className="text-cyber-blue">Secure</span>{' '}
                            <span className="text-cyber-green">Mobile Vault</span>
                        </h2>

                        <div className="flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                            >
                                <div className="phone-card">
                                    <div className="phone-btn1"></div>
                                    <div className="phone-btn2"></div>
                                    <div className="phone-btn3"></div>
                                    <div className="phone-card-int">
                                        <div className="phone-display">
                                            <img
                                                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop&crop=face"
                                                alt="Secure Profile"
                                                className="phone-image"
                                            />
                                        </div>
                                    </div>
                                    <div className="phone-top">
                                        <div className="phone-camera">
                                            <div className="phone-camera-int"></div>
                                        </div>
                                        <div className="phone-speaker"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ICP Connection Section - Moved Above Stats */}
            <section className="py-16 px-4 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card rounded-2xl p-12"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Connect to Your Digital Safety Vault
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                                Your encrypted gallery is powered by the Internet Computer blockchain.
                                Connect securely to start building your private collection of safety evidence and encrypted notes.
                            </p>
                        </div>

                        {/* Connection Status and Button Row */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-lg border ${icpConnectionStatus === 'connected' ? 'border-green-500/50 bg-green-500/10' :
                                icpConnectionStatus === 'connecting' ? 'border-yellow-500/50 bg-yellow-500/10' :
                                    'border-red-500/50 bg-red-500/10'
                                }`}>
                                <div className={`w-3 h-3 rounded-full ${icpConnectionStatus === 'connected' ? 'bg-green-500' :
                                    icpConnectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                                        'bg-red-500'
                                    }`}></div>
                                <span className="text-lg font-medium text-white">
                                    ICP Network: {icpConnectionStatus === 'connected' ? 'Connected' :
                                        icpConnectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                                </span>
                            </div>

                            {!isICPAuthenticated && (
                                <button
                                    onClick={handleICPAuthentication}
                                    disabled={icpConnectionStatus === 'connecting'}
                                    className="px-12 py-4 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-xl hover:shadow-2xl hover:shadow-cyber-blue/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 text-lg flex items-center gap-3"
                                >
                                    <Zap className="w-6 h-6" />
                                    <span>{icpConnectionStatus === 'connecting' ? '🔄 Connecting...' : '🚀 Connect to ICP'}</span>
                                    <Send className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Features Grid - Space for additional elements */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center justify-center gap-3 text-cyber-blue">
                                <CheckCircle className="w-6 h-6" />
                                <span className="text-lg font-medium">End-to-End Encrypted</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-cyber-green">
                                <CheckCircle className="w-6 h-6" />
                                <span className="text-lg font-medium">Blockchain Verified</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-accent-orange">
                                <CheckCircle className="w-6 h-6" />
                                <span className="text-lg font-medium">Military-Grade Security</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section with Animated Cards */}
            <section className="py-16 px-4" style={{ zIndex: 10 }}>
                <div className="container mx-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: AlertTriangle, value: "95%", label: "Red Flags Detected", color: "red" },
                                { icon: Shield, value: "100%", label: "Data Encrypted", color: "blue" },
                                { icon: Users, value: "50K+", label: "Lives Protected", color: "green" }
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        className="text-center p-8 rounded-xl glass-card hover:scale-105 transition-all duration-300"
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="relative">
                                            <Icon className={`w-12 h-12 mx-auto mb-4 drop-shadow-lg ${stat.color === 'red' ? 'text-red-400' :
                                                stat.color === 'blue' ? 'text-cyber-blue' : 'text-cyber-green'
                                                }`} style={{
                                                    filter: `drop-shadow(0 0 8px ${stat.color === 'red' ? 'rgba(239,68,68,0.6)' :
                                                        stat.color === 'blue' ? 'rgba(0,245,255,0.6)' : 'rgba(57,255,20,0.6)'
                                                        })`
                                                }} />
                                            <div className={`text-4xl font-bold mb-2 ${stat.color === 'red' ? 'text-red-400' :
                                                stat.color === 'blue' ? 'text-cyber-blue' : 'text-cyber-green'
                                                }`} style={{
                                                    textShadow: `0 0 20px ${stat.color === 'red' ? 'rgba(239,68,68,0.8)' :
                                                        stat.color === 'blue' ? 'rgba(0,245,255,0.8)' : 'rgba(57,255,20,0.8)'
                                                        }`
                                                }}>
                                                {stat.value}
                                            </div>
                                            <div className="text-lg text-gray-300" style={{
                                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                            }}>{stat.label}</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - Story-driven approach */}
            {isICPAuthenticated ? (
                <div className="relative z-10">
                    {/* The Story Section */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-4xl md:text-5xl font-cyber font-bold mb-8">
                                    <span className="text-cyber-blue">Your Digital</span>{' '}
                                    <span className="text-cyber-green">Safety Vault</span>
                                </h2>
                                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                    In a world where digital privacy is under constant threat, we've created a fortress for your most sensitive information.
                                    Whether it's evidence of a potential romance scammer, screenshots of suspicious conversations, or private notes
                                    about your dating experiences - everything is encrypted with military-grade security and stored on the
                                    decentralized Internet Computer blockchain.
                                </p>
                            </motion.div>

                            {/* Two-Column Layout: Photo Gallery & Private Notes */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Photo Gallery Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="glass-card rounded-2xl p-8"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-purple-500 rounded-xl flex items-center justify-center">
                                            <FileImage className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-cyber-blue">Encrypted Photo Gallery</h3>
                                            <p className="text-gray-400">Rust-powered decentralized storage</p>
                                        </div>
                                    </div>

                                    <div className="bg-dark-bg/50 rounded-xl p-6 mb-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">📸 Upload Evidence</h4>
                                        <p className="text-gray-300 mb-4 text-sm">
                                            Store screenshots of suspicious profiles, fake verification images, or any visual evidence
                                            that might help protect yourself or others from scams.
                                        </p>

                                        <label className="block w-full">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploadingImage}
                                                className="hidden"
                                            />
                                            <div className="border-2 border-dashed border-cyber-blue/50 rounded-lg p-8 text-center hover:border-cyber-blue cursor-pointer transition-all duration-300">
                                                {isUploadingImage ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-cyber-blue">Encrypting & uploading...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
                                                        <p className="text-cyber-blue font-medium">Click to upload image</p>
                                                        <p className="text-gray-400 text-xs mt-1">Max 10MB • JPG, PNG, WebP</p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Gallery Grid */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold text-white">🖼️ Your Encrypted Gallery</h4>
                                            <span className="text-cyber-green font-medium">{galleryImages.length} images</span>
                                        </div>

                                        {isLoadingImages ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                    <div key={i} className="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
                                                ))}
                                            </div>
                                        ) : galleryImages.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                                {galleryImages.map((image) => (
                                                    <div key={image.id} className="group relative">
                                                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-cyber-blue/30 hover:border-cyber-blue transition-all duration-300">
                                                            <img
                                                                src={image.url}
                                                                alt={image.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <button
                                                                        className="p-2 bg-cyber-blue rounded-full hover:bg-cyber-blue/80"
                                                                        title="View image details"
                                                                        aria-label="View image details"
                                                                    >
                                                                        <FileImage className="w-4 h-4 text-white" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-xs text-gray-400 truncate">{image.name}</p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className={`text-xs px-2 py-1 rounded ${image.threatLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                                                                    image.threatLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                        'bg-green-500/20 text-green-400'
                                                                    }`}>
                                                                    {image.threatLevel}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(image.timestamp).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <FileImage className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400">No images uploaded yet</p>
                                                <p className="text-gray-500 text-sm">Start building your encrypted evidence vault</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Private Notes Section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="glass-card rounded-2xl p-8"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-cyber-green to-emerald-500 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-cyber-green">Private Notes</h3>
                                            <p className="text-gray-400">VetKeys encrypted storage</p>
                                        </div>
                                    </div>

                                    {/* Create Note Form */}
                                    <div className="bg-dark-bg/50 rounded-xl p-6 mb-6">
                                        <h4 className="text-lg font-semibold text-white mb-4">📝 Create Encrypted Note</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Note Title</label>
                                                <input
                                                    type="text"
                                                    value={newNoteTitle}
                                                    onChange={(e) => setNewNoteTitle(e.target.value)}
                                                    placeholder="e.g., 'Red Flags from John_Dating_App'"
                                                    className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                                <select
                                                    value={newNoteCategory}
                                                    onChange={(e) => setNewNoteCategory(e.target.value)}
                                                    className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white focus:border-cyber-green focus:outline-none"
                                                    title="Select note category"
                                                    aria-label="Note category"
                                                >
                                                    <option value="personal">Personal Safety</option>
                                                    <option value="evidence">Evidence Collection</option>
                                                    <option value="warnings">Scammer Warnings</option>
                                                    <option value="investigation">Investigation Notes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Note Content</label>
                                                <textarea
                                                    value={newNoteContent}
                                                    onChange={(e) => setNewNoteContent(e.target.value)}
                                                    placeholder="Document suspicious behavior, red flags, or safety concerns..."
                                                    rows={4}
                                                    className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none resize-none"
                                                />
                                            </div>
                                            <button
                                                onClick={createEncryptedNote}
                                                disabled={isCreatingNote || !newNoteTitle.trim() || !newNoteContent.trim()}
                                                className="w-full px-4 py-2 bg-gradient-to-r from-cyber-green to-emerald-500 text-dark-bg font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isCreatingNote ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                                                        Encrypting Note...
                                                    </span>
                                                ) : (
                                                    '🔐 Encrypt & Store Note'
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold text-white">📚 Your Encrypted Notes</h4>
                                            <span className="text-cyber-green font-medium">{encryptedNotes.length} notes</span>
                                        </div>

                                        {isLoadingNotes ? (
                                            <div className="space-y-3">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse">
                                                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                                                        <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : encryptedNotes.length > 0 ? (
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {encryptedNotes.map((note) => (
                                                    <div key={note.id} className="bg-dark-bg/50 rounded-lg p-4 border border-gray-600 hover:border-cyber-green/50 transition-all duration-300">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h5 className="font-semibold text-white text-sm">{note.title}</h5>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-xs px-2 py-1 rounded ${note.threatLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                                                                    note.threatLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                        'bg-green-500/20 text-green-400'
                                                                    }`}>
                                                                    {note.threatLevel}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(note.timestamp).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-300 text-sm line-clamp-2 mb-2">{note.content}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs px-2 py-1 bg-cyber-blue/20 text-cyber-blue rounded">
                                                                {note.category}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <Lock className="w-3 h-3 text-cyber-green" />
                                                                <span className="text-xs text-cyber-green">Encrypted</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400">No encrypted notes yet</p>
                                                <p className="text-gray-500 text-sm">Start documenting your digital safety journey</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Why This Matters Section */}
                    <section className="py-16 px-4 bg-dark-panel/30">
                        <div className="container mx-auto max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-4xl font-bold text-white mb-8">
                                    Why Your Digital Safety Vault Matters
                                </h2>
                                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                                    In the age of digital deception, having a secure place to store evidence and document red flags
                                    isn't just smart—it's essential for protecting yourself and helping others stay safe.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="glass-card rounded-xl p-6 text-center"
                                >
                                    <Shield className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-4">Protect Evidence</h3>
                                    <p className="text-gray-300">
                                        Screenshots of fake profiles, suspicious messages, and red flag behaviors are safely encrypted
                                        and stored on the blockchain where they can't be deleted or tampered with.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="glass-card rounded-xl p-6 text-center"
                                >
                                    <Database className="w-12 h-12 text-cyber-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-4">Build Intelligence</h3>
                                    <p className="text-gray-300">
                                        Document patterns, collect information, and build a comprehensive intelligence file
                                        that helps you recognize and avoid similar threats in the future.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="glass-card rounded-xl p-6 text-center"
                                >
                                    <Users className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-4">Help Others</h3>
                                    <p className="text-gray-300">
                                        Your documented experiences and evidence can help protect others from falling victim
                                        to the same scams, creating a safer dating environment for everyone.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Excellence Section */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="glass-card rounded-2xl p-8"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold text-white mb-4">
                                        Built with Military-Grade Security
                                    </h2>
                                    <p className="text-xl text-gray-300">
                                        Your data is protected by the most advanced encryption and decentralized storage technologies available.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                            <Key className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-cyber-blue mb-2">VetKeys Encryption</h3>
                                        <p className="text-gray-400 text-sm">
                                            Threshold cryptography ensures only you can decrypt your private notes
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-cyber-green to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                            <Database className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-cyber-green mb-2">Rust-Powered Storage</h3>
                                        <p className="text-gray-400 text-sm">
                                            High-performance Rust canisters provide lightning-fast, secure data operations
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                            <Globe className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-purple-400 mb-2">Decentralized</h3>
                                        <p className="text-gray-400 text-sm">
                                            No single point of failure - your data lives on the Internet Computer blockchain
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-accent-orange to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-accent-orange mb-2">Immutable</h3>
                                        <p className="text-gray-400 text-sm">
                                            Once stored, your evidence cannot be altered or deleted by anyone
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </div>
            ) : (
                // Connection Required Section
                <section className="py-20 px-4 relative z-10">
                    <div className="container mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="glass-card rounded-2xl p-12"
                        >
                            <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-full mx-auto mb-8 flex items-center justify-center">
                                <Lock className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Connect to Your Digital Safety Vault
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Your encrypted gallery is powered by the Internet Computer blockchain.
                                Connect securely to start building your private collection of safety evidence and encrypted notes.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center gap-3 text-cyber-blue">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Military-grade encryption for all uploads</span>
                                </div>
                                <div className="flex items-center justify-center gap-3 text-cyber-green">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Decentralized storage that you control</span>
                                </div>
                                <div className="flex items-center justify-center gap-3 text-accent-orange">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Immutable evidence preservation</span>
                                </div>
                            </div>
                            <button
                                onClick={handleICPAuthentication}
                                disabled={icpConnectionStatus === 'connecting'}
                                className="px-12 py-4 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-xl hover:shadow-2xl hover:shadow-cyber-blue/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 text-lg"
                            >
                                {icpConnectionStatus === 'connecting' ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                                        Connecting to ICP Network...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <Zap className="w-5 h-5" />
                                        Access Your Encrypted Vault
                                        <Send className="w-5 h-5" />
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Footer CTA */}
            <section className="py-16 px-4 relative z-10">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card rounded-xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Ready to protect your digital life?
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Join thousands of users who trust OSINT Café to keep their dating experiences safe and secure.
                        </p>
                        <Link
                            to="/dating-safety"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <Shield className="w-5 h-5" />
                            <span>Explore All Safety Tools</span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default EncryptedGallery;
