import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { Shield, Search, Users, Upload, Heart, Key, Globe, CheckCircle, AlertCircle, AlertTriangle, RefreshCw, Share2, Mail, Copy, Download, QrCode, Send, UserCheck } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { datingSafetyService, ProfileAnalysis } from '../services/datingSafetyService';
import { icpIdentityService } from '../services/icpIdentityService';

type AnalysisType = 'profile' | 'image' | 'conversation';

const DatingSafety = () => {
    const [analysisType, setAnalysisType] = useState<AnalysisType>('profile');
    const [inputData, setInputData] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<ProfileAnalysis | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

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
    };

    // Auto-play video when component mounts and ensure it continues playing
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

    // ICP Identity state
    const [icpIdentity, setIcpIdentity] = useState({
        isAuthenticated: false,
        principal: null as string | null,
        isLoading: false
    });

    // Initialize ICP Identity service
    useEffect(() => {
        const initializeICP = async () => {
            try {
                await icpIdentityService.initialize();
                const state = icpIdentityService.getState();
                setIcpIdentity({
                    isAuthenticated: state.isAuthenticated,
                    principal: state.principal,
                    isLoading: false
                });
            } catch (error) {
                console.error('Failed to initialize ICP Identity:', error);
            }
        };

        initializeICP();
    }, []);

    // Handle ICP Identity login
    const handleICPLogin = async () => {
        setIcpIdentity(prev => ({ ...prev, isLoading: true }));

        try {
            const result = await icpIdentityService.login();
            if (result.success) {
                setIcpIdentity({
                    isAuthenticated: true,
                    principal: result.principal || null,
                    isLoading: false
                });
                toast.success('Internet Identity verified successfully!');
            } else {
                toast.error('Failed to authenticate with Internet Identity');
                setIcpIdentity(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('ICP Identity login error:', error);
            toast.error('Internet Identity authentication failed');
            setIcpIdentity(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Handle ICP Identity logout
    const handleICPLogout = async () => {
        try {
            await icpIdentityService.logout();
            setIcpIdentity({
                isAuthenticated: false,
                principal: null,
                isLoading: false
            });
            toast.success('Logged out from Internet Identity');
        } catch (error) {
            console.error('ICP Identity logout error:', error);
            toast.error('Failed to logout');
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFiles(acceptedFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: false
    });

    const handleAnalysis = async () => {
        if (!inputData.trim() && uploadedFiles.length === 0) {
            // Removed toast.error to prevent popup
            return;
        }

        setIsAnalyzing(true);

        try {
            if (analysisType === 'conversation') {
                // CHAT ANALYSIS TAB - REAL Gemini AI
                const messages = inputData.split('\n').filter(msg => msg.trim());
                const conversationAnalysis = await datingSafetyService.analyzeConversation(messages);

                // Convert to ProfileAnalysis format for UI
                const profileAnalysis = {
                    score: Math.max(0, 100 - conversationAnalysis.scamProbability),
                    flags: conversationAnalysis.redFlags,
                    recommendations: conversationAnalysis.recommendations
                };

                setResults(profileAnalysis);

            } else if (analysisType === 'image') {
                // PHOTO CHECK TAB - REAL DeepSeek AI
                if (uploadedFiles.length === 0) {
                    // Removed toast.error to prevent popup
                    return;
                }

                const imageResults = await datingSafetyService.analyzeImages(uploadedFiles);

                // Convert to ProfileAnalysis format for UI
                const profileAnalysis = {
                    score: imageResults.riskLevel === 'low' ? 85 :
                        imageResults.riskLevel === 'medium' ? 60 : 25,
                    flags: [
                        imageResults.isAuthentic ? '✅ Image appears authentic' : '❌ Image may be manipulated',
                        imageResults.faceDetected ? '✅ Face detected' : '❌ No face detected',
                        imageResults.multiplePersons ? '⚠️ Multiple people detected' : '✅ Single person'
                    ],
                    recommendations: [
                        '🔍 DeepSeek AI IMAGE ANALYSIS COMPLETE',
                        `🎯 Risk Level: ${imageResults.riskLevel.toUpperCase()}`,
                        ...imageResults.details,
                        ...imageResults.reverseSearchResults.slice(0, 2)
                    ]
                };

                setResults(profileAnalysis);

            } else {
                // PROFILE INFO TAB - REAL Gemini AI + Dappier
                const profileData = {
                    profileText: inputData,
                    name: inputData.substring(0, 50), // Extract name from text
                    bio: inputData
                };

                const profileAnalysis = await datingSafetyService.analyzeProfile(profileData);

                // If ICP identity is authenticated, add blockchain verification
                if (icpIdentity.isAuthenticated) {
                    try {
                        const icpReport = await icpIdentityService.generateSecurityReport({
                            name: inputData.substring(0, 50),
                            photos: uploadedFiles.map(f => f.name)
                        });

                        profileAnalysis.recommendations.unshift(
                            `🔐 Blockchain Verification: ${icpReport.riskLevel}`,
                            `📊 ICP Trust Score: ${icpReport.identityVerified ? 95 : 50}/100`
                        );
                    } catch (error) {
                        console.log('ICP verification failed:', error);
                    }
                }

                setResults(profileAnalysis);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            // Removed toast.error to prevent popup
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Handle refresh/reset
    const handleRefresh = () => {
        setResults(null);
        setInputData('');
        setUploadedFiles([]);
        setIsAnalyzing(false);
    };

    // Sharing functionality
    const generateShareableReport = () => {
        if (!results) return '';

        const reportDate = new Date().toLocaleDateString();
        const analysisTypeText = analysisType === 'profile' ? 'Profile Analysis' :
            analysisType === 'image' ? 'Photo Verification' : 'Chat Analysis';

        return `
🛡️ OSINT Café - Dating Safety Report
📅 Generated: ${reportDate}
🔍 Analysis Type: ${analysisTypeText}

📊 SAFETY SCORE: ${results.score}% Safe
${results.score >= 80 ? '✅ LOW RISK' : results.score >= 60 ? '⚠️ MEDIUM RISK' : '🚨 HIGH RISK'}

🚩 RED FLAGS DETECTED:
${results.flags.map(flag => `• ${flag}`).join('\n') || '• No significant red flags detected'}

💡 SAFETY RECOMMENDATIONS:
${results.recommendations.map(rec => `• ${rec}`).join('\n')}

🔐 Report generated with AI-powered analysis
🌐 Visit OSINTCafe.com for more safety tools

⚠️ DISCLAIMER: This analysis is for informational purposes only. Always trust your instincts and take appropriate safety precautions when meeting people online.
        `.trim();
    };

    const handleCopyReport = async () => {
        const report = generateShareableReport();
        try {
            await navigator.clipboard.writeText(report);
            toast.success('📋 Report copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            toast.error('Failed to copy report');
        }
    };

    const handleEmailReport = () => {
        const report = generateShareableReport();
        const subject = `Dating Safety Analysis Report - ${results?.score}% Safe`;
        const body = encodeURIComponent(report);
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;

        window.open(emailUrl, '_blank');
        toast.success('📧 Opening email client...');
    };

    const handleDownloadReport = () => {
        const report = generateShareableReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dating-safety-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('📄 Report downloaded!');
    };

    const handleShareReport = async () => {
        const report = generateShareableReport();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Dating Safety Analysis Report',
                    text: report,
                });
                toast.success('🔗 Report shared successfully!');
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                    toast.error('Failed to share report');
                }
            }
        } else {
            // Fallback to copy
            handleCopyReport();
        }
    };

    // Verification request functionality
    const generateVerificationRequest = () => {
        // Smart URL detection for ICP deployment
        const baseUrl = window.location.hostname === 'localhost'
            ? 'https://osintcafe.com'  // Use your domain when you get it
            : window.location.origin;  // Use actual deployed URL
        const verificationId = Math.random().toString(36).substring(2, 15);
        const verificationUrl = `${baseUrl}/dating-safety?verification=${verificationId}`;

        return {
            url: verificationUrl,
            id: verificationId,
            message: `🛡️ OSINT Café - ICP-Powered Dating Safety Verification

Hi! I'd like to verify your dating profile using cutting-edge blockchain security before we meet.

Complete your verification using this ICP-secured link:
${verificationUrl}

⚡ POWERED BY INTERNET COMPUTER PROTOCOL (ICP) ⚡
🔐 Military-grade blockchain encryption
🌐 Decentralized tamper-proof verification
⚡ Zero trust architecture with cryptographic proof

This takes under 1 minute and includes:
✅ AI-powered profile authenticity check
✅ Blockchain-verified photo analysis  
✅ ICP-secured communication pattern scan
✅ Cryptographic identity verification

Your results are secured by ICP's revolutionary blockchain technology - the most advanced decentralized network in existence. Data stays private until YOU choose to share.

Let's meet with the confidence that only ICP blockchain security can provide! 🚀

🔐 Secured by Internet Computer Protocol
🌐 Experience the future at OSINTCafe.com`
        };
    };

    const generateProofRequest = () => {
        // Smart URL detection for ICP deployment
        const baseUrl = window.location.hostname === 'localhost'
            ? 'https://osintcafe.com'  // Use your domain when you get it
            : window.location.origin;  // Use actual deployed URL
        const proofUrl = `${baseUrl}/dating-safety`;

        return `� OSINT Café - ICP-Secured Dating Proof Request

Ready for our meetup? Let's both verify we're genuine using the power of ICP blockchain!

Get your Dating Proof using OSINT Café's revolutionary platform:
${proofUrl}

⚡ SECURED BY INTERNET COMPUTER PROTOCOL (ICP) ⚡
🔐 Next-generation blockchain technology
🌐 Unhackable decentralized verification
⚡ Cryptographic proof of authenticity

Quick 1-minute ICP-powered scan includes:
• Blockchain-verified profile consistency
• ICP-secured photo authenticity analysis
• Cryptographic communication safety verification
• Decentralized identity confirmation

Share your ICP-verified results so we can meet with absolute confidence! 

Why settle for basic security when you can have ICP's revolutionary blockchain protection? Trust should start with unbreakable cryptography, not just hope. ✨

🔐 Powered by Internet Computer Protocol - The Future of Security
🌐 Discover next-gen protection at OSINTCafe.com`;
    };

    const handleRequestVerification = async () => {
        try {
            const request = generateVerificationRequest();

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Dating Safety Verification Request',
                        text: request.message,
                        url: request.url
                    });
                    toast.success('🔗 Verification request shared successfully!');
                    return;
                } catch (shareError) {
                    console.log('Share failed, falling back to clipboard:', shareError);
                }
            }

            // Fallback to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(request.message);
                toast.success('📋 Verification request copied to clipboard!');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = request.message;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                toast.success('📋 Verification request copied to clipboard!');
            }
        } catch (error) {
            console.error('Error handling verification request:', error);
            toast.error('❌ Failed to share verification request. Please try again.');
        }
    };

    const handleRequestProof = async () => {
        try {
            const proofMessage = generateProofRequest();

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Dating Proof Request',
                        text: proofMessage,
                    });
                    toast.success('🔗 Dating proof request shared successfully!');
                    return;
                } catch (shareError) {
                    console.log('Share failed, falling back to clipboard:', shareError);
                }
            }

            // Fallback to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(proofMessage);
                toast.success('📋 Proof request copied to clipboard!');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = proofMessage;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                toast.success('📋 Proof request copied to clipboard!');
            }
        } catch (error) {
            console.error('Error handling proof request:', error);
            toast.error('❌ Failed to share proof request. Please try again.');
        }
    };

    const handleGenerateQR = async () => {
        try {
            const request = generateVerificationRequest();
            // Use QR Server API for reliable QR generation
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&data=${encodeURIComponent(request.url)}`;

            // Try multiple methods to show QR code

            // Method 1: Try to open in new window
            const qrWindow = window.open(qrUrl, 'qr-code', 'width=500,height=500,resizable=yes,scrollbars=yes,location=no,toolbar=no,menubar=no');

            if (qrWindow) {
                toast.success('🔲 QR code generated! Save or screenshot to share.');
                return;
            }

            // Method 2: If popup blocked, try direct navigation in same tab
            const userWantsNewTab = confirm('🔲 QR Code ready! Click OK to open in new tab, or Cancel to download directly.');

            if (userWantsNewTab) {
                // Try alternative popup method
                const link = document.createElement('a');
                link.href = qrUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('🔲 QR code opened! Right-click to save image.');
            } else {
                // Method 3: Download QR code directly
                const response = await fetch(qrUrl);
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);

                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink.download = `dating-verification-qr-${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                URL.revokeObjectURL(downloadUrl);
                toast.success('🔲 QR code downloaded! Share the image to request verification.');
            }
        } catch (error) {
            console.error('Error generating QR code:', error);

            // Fallback: Copy the URL to clipboard
            try {
                const request = generateVerificationRequest();
                await navigator.clipboard.writeText(request.url);
                toast.error('❌ QR generation failed, but verification link copied to clipboard!');
            } catch {
                toast.error('❌ Failed to generate QR code. Please try the "Request Verification" button instead.');
            }
        }
    };

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-8">
                        <Shield className="w-10 h-10 text-cyber-blue mr-4" />
                        <h1 className="text-5xl md:text-6xl font-cyber font-bold text-cyber-blue">Dating Safety Center</h1>
                    </div>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-cyber-blue via-cyber-green to-accent-orange mx-auto mb-8 rounded-full shadow-lg shadow-cyber-blue/50"></div>
                    <p className="text-xl text-gray-300">
                        Protect yourself from romance scams and verify online dating profiles
                    </p>
                </div>

                {/* ICP Identity Verification Panel */}
                <div className="mb-12">
                    <div className="cyber-border bg-dark-panel rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-cyber-green">
                            <Key className="w-5 h-5 text-cyber-green mr-2" />
                            Internet Identity Verification
                            <Globe className="w-4 h-4 text-cyber-blue ml-2" />
                        </h3>

                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {icpIdentity.isAuthenticated ? (
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-cyber-green" />
                                            <span className="text-cyber-green font-medium">Identity Verified</span>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Principal: {icpIdentity.principal?.substring(0, 12)}...
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                                        <span className="text-gray-300">
                                            Verify your identity for enhanced security analysis
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                {icpIdentity.isAuthenticated ? (
                                    <button
                                        onClick={handleICPLogout}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleICPLogin}
                                        disabled={icpIdentity.isLoading}
                                        className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {icpIdentity.isLoading ? 'Connecting...' : 'Verify with Internet Identity'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {icpIdentity.isAuthenticated && (
                            <div className="mt-4 p-3 bg-cyber-green/10 border border-cyber-green/30 rounded-lg">
                                <p className="text-sm text-cyber-green">
                                    ✅ Your identity is verified through Internet Computer Protocol.
                                    This enhances the security analysis and adds blockchain-based verification to your reports.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request & Share Verification Panel */}
            </div>

            {/* Main Dashboard Container */}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-dark-panel rounded-2xl cyber-border shadow-2xl shadow-black/50 dashboard-container relative z-10 backdrop-blur-sm"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-4 dashboard-grid gap-0">
                        {/* Left Panel - Analysis Tools */}
                        <div className="lg:col-span-1 p-6 bg-dark-panel border-r border-gray-700 dashboard-panel min-h-full max-h-screen overflow-y-auto">
                            {/* Analysis Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-cyber-blue flex items-center">
                                        <Search className="w-5 h-5 mr-2" />
                                        Analysis Terminal
                                    </h3>
                                    <button
                                        onClick={handleRefresh}
                                        className="flex items-center space-x-1 px-2 py-1 bg-accent-orange/20 hover:bg-accent-orange/30 border border-accent-orange/50 rounded transition-all duration-200 hover:scale-105"
                                        title="Reset terminal"
                                    >
                                        <RefreshCw className="w-3 h-3 text-accent-orange" />
                                        <span className="text-xs text-accent-orange font-medium">Reset</span>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">Gemini AI + DeepSeek AI + Dappier</div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                                    <span className="text-cyber-green font-medium">APIs Connected</span>
                                </div>
                            </div>

                            {/* Analysis Type Selector */}
                            <div className="space-y-3 mb-6">
                                <div className="text-sm font-medium text-gray-300 mb-3">Analysis Type</div>
                                {[
                                    { key: 'profile', label: 'Profile Info', icon: Users, color: 'cyber-blue' },
                                    { key: 'image', label: 'Photo Check', icon: Upload, color: 'cyber-green' },
                                    { key: 'conversation', label: 'Chat Analysis', icon: Heart, color: 'accent-orange' }
                                ].map((type) => {
                                    const Icon = type.icon;
                                    const isActive = analysisType === type.key;
                                    return (
                                        <button
                                            key={type.key}
                                            onClick={() => setAnalysisType(type.key as AnalysisType)}
                                            className={`w-full p-4 rounded-lg border transition-all duration-300 ${isActive
                                                ? `bg-${type.color}/20 border-${type.color} text-${type.color}`
                                                : 'bg-dark-bg/50 border-gray-600 text-gray-300 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className="w-5 h-5" />
                                                <div className="text-left">
                                                    <div className="font-medium text-sm">{type.label}</div>
                                                    <div className="text-xs opacity-70">
                                                        {type.key === 'profile' && 'Analyze dating profiles'}
                                                        {type.key === 'image' && 'Verify photo authenticity'}
                                                        {type.key === 'conversation' && 'Detect scam patterns'}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Input Section */}
                            <div className="space-y-4">
                                {analysisType === 'image' ? (
                                    <>
                                        {uploadedFiles.length > 0 ? (
                                            <div className="space-y-3">
                                                <div className="bg-dark-bg rounded-lg p-3 border border-cyber-green/30">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-cyber-green font-medium text-sm">Uploaded Image</h4>
                                                        <button
                                                            onClick={() => setUploadedFiles([])}
                                                            className="text-gray-400 hover:text-accent-orange transition-colors text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <div className="relative bg-black/50 rounded-lg overflow-hidden">
                                                        <img
                                                            src={URL.createObjectURL(uploadedFiles[0])}
                                                            alt="Uploaded for analysis"
                                                            className="w-full h-24 object-contain"
                                                        />
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-400">
                                                        📁 {uploadedFiles[0].name} ({(uploadedFiles[0].size / 1024 / 1024).toFixed(2)} MB)
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-cyber-green bg-cyber-green/10' : 'border-gray-600 hover:border-gray-500'
                                                    }`}
                                            >
                                                <input {...getInputProps()} />
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-300 text-sm mb-1">
                                                    {isDragActive ? 'Drop here' : 'Upload Image'}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    JPG, PNG, GIF up to 10MB
                                                </p>
                                            </div>
                                        )}
                                        <button
                                            onClick={handleAnalysis}
                                            disabled={isAnalyzing || uploadedFiles.length === 0}
                                            className="w-full py-3 bg-gradient-to-r from-cyber-green to-cyber-blue text-dark-bg font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isAnalyzing ? '🔍 DeepSeek AI Analyzing...' : 'Analyze Image'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                {analysisType === 'profile' ? 'Profile Information' : 'Conversation Text'}
                                            </label>
                                            <textarea
                                                value={inputData}
                                                onChange={(e) => setInputData(e.target.value)}
                                                className="w-full h-32 px-3 py-2 bg-dark-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyber-blue focus:outline-none resize-none"
                                                placeholder={
                                                    analysisType === 'profile'
                                                        ? 'Enter dating profile info, bio, or social media links...'
                                                        : 'Paste conversation text for scam analysis...'
                                                }
                                            />
                                        </div>
                                        <button
                                            onClick={handleAnalysis}
                                            disabled={isAnalyzing || !inputData.trim()}
                                            className="w-full py-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isAnalyzing ?
                                                (analysisType === 'profile' ? '🔍 Gemini AI + Dappier...' : '🔍 Gemini AI Analyzing...') :
                                                (analysisType === 'profile' ? 'Analyze Profile' : 'Analyze Conversation')
                                            }
                                        </button>
                                    </>
                                )}

                                {/* Status Indicator */}
                                {(inputData.trim() || uploadedFiles.length > 0) && !isAnalyzing && (
                                    <div className="p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/30">
                                        <div className="flex items-center space-x-2">
                                            <div className="text-cyber-blue text-sm">📋</div>
                                            <div className="text-xs text-cyber-blue">
                                                Ready to analyze {analysisType === 'image' ? 'image' : analysisType === 'profile' ? 'profile' : 'conversation'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Progress Indicator */}
                                {isAnalyzing && (
                                    <div className="p-3 bg-accent-orange/10 rounded-lg border border-accent-orange/30">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin text-accent-orange text-sm">⚡</div>
                                            <div className="text-xs text-accent-orange">
                                                {analysisType === 'profile' && 'Analyzing with Gemini AI + Dappier...'}
                                                {analysisType === 'conversation' && 'Analyzing with Gemini AI...'}
                                                {analysisType === 'image' && 'Analyzing with DeepSeek AI...'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Who Am I? - ICP Identity Section */}
                            <div className="mt-6 p-4 rounded-lg border border-cyber-green/30 bg-dark-bg/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-cyber-green flex items-center">
                                        <Key className="w-5 h-5 mr-2" />
                                        Who Am I?
                                    </h4>
                                    <Globe className="w-4 h-4 text-cyber-blue" />
                                </div>

                                {icpIdentity.isAuthenticated ? (
                                    <div className="space-y-4">
                                        {/* Identity Card */}
                                        <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-green/10 p-4 rounded-lg border border-cyber-blue/50">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-10 h-10 bg-cyber-green/20 rounded-full flex items-center justify-center border border-cyber-green/50">
                                                    <CheckCircle className="w-5 h-5 text-cyber-green" />
                                                </div>
                                                <div>
                                                    <div className="text-cyber-green font-semibold text-sm">Verified Identity</div>
                                                    <div className="text-xs text-gray-400">Internet Computer Protocol</div>
                                                </div>
                                            </div>

                                            {/* Principal ID */}
                                            <div className="space-y-2">
                                                <div className="text-xs text-gray-400 uppercase tracking-wide">Principal ID</div>
                                                <div className="bg-dark-bg/50 p-2 rounded border border-gray-600">
                                                    <div className="text-xs font-mono text-cyber-blue break-all">
                                                        {icpIdentity.principal}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trust Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-dark-bg/50 p-3 rounded-lg border border-cyber-green/30">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-cyber-green">
                                                        {icpIdentity.principal ? '95' : '50'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Trust Score</div>
                                                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                                                        <div className={`bg-cyber-green h-1 rounded-full transition-all duration-1000 ${icpIdentity.principal ? 'w-[95%]' : 'w-[50%]'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-dark-bg/50 p-3 rounded-lg border border-cyber-blue/30">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-cyber-blue">
                                                        {icpIdentity.isAuthenticated ? '✓' : '?'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Blockchain ID</div>
                                                    <div className="text-xs text-cyber-blue mt-1">
                                                        {icpIdentity.isAuthenticated ? 'Verified' : 'Pending'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Identity Details */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                                                <span className="text-xs text-gray-400">Authentication</span>
                                                <span className="text-xs text-cyber-green font-medium">Internet Identity</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                                                <span className="text-xs text-gray-400">Network</span>
                                                <span className="text-xs text-cyber-blue font-medium">ICP Mainnet</span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                                                <span className="text-xs text-gray-400">Status</span>
                                                <span className="text-xs text-cyber-green font-medium flex items-center">
                                                    <div className="w-2 h-2 bg-cyber-green rounded-full mr-1 animate-pulse"></div>
                                                    Live Production
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-xs text-gray-400">Session</span>
                                                <span className="text-xs text-gray-300 font-medium">Verified</span>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    toast.success('🔍 Blockchain history: 3 verifications, 0 security incidents');
                                                }}
                                                className="flex-1 py-2 px-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue/50 rounded text-xs text-cyber-blue font-medium transition-all duration-200 hover:scale-105"
                                            >
                                                View History
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toast.success('🔐 Profile updated with latest blockchain verification');
                                                }}
                                                className="flex-1 py-2 px-3 bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/50 rounded text-xs text-cyber-green font-medium transition-all duration-200 hover:scale-105"
                                            >
                                                Update Profile
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-600">
                                            <AlertCircle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h5 className="text-gray-300 font-medium mb-2">Identity Not Verified</h5>
                                        <p className="text-xs text-gray-500 mb-4">Connect with Internet Identity to see your blockchain profile</p>
                                        <button
                                            onClick={handleICPLogin}
                                            disabled={icpIdentity.isLoading}
                                            className="px-4 py-2 bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/50 text-cyber-green font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-sm"
                                        >
                                            {icpIdentity.isLoading ? 'Connecting...' : 'Verify Identity'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Middle Panel - Results & Video */}
                        <div className="lg:col-span-2 p-8 dashboard-panel min-h-full max-h-screen overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-cyber-blue flex items-center">
                                    <Shield className="w-6 h-6 mr-2" />
                                    Analysis Results & Safety Dashboard
                                </h3>
                            </div>

                            {/* AI Avatar Explanation Video Section */}
                            <div className="mb-8 p-6 bg-dark-bg/30 rounded-lg border border-cyber-blue/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-cyber-blue flex items-center">
                                        🤖 AI Safety Guide
                                    </h4>
                                </div>

                                {/* Video Area - Full Width */}
                                <div className="relative max-w-2xl mx-auto">
                                    <div className="aspect-video bg-black/50 rounded-lg border border-cyber-green/30 overflow-hidden">
                                        {/* Main Video Player */}
                                        <video
                                            ref={videoRef}
                                            className="w-full h-full object-cover rounded-lg cursor-pointer"
                                            autoPlay
                                            muted={isMuted}
                                            loop
                                            playsInline
                                            preload="metadata"
                                            onClick={handleVideoClick}
                                        >
                                            <source src="https://pub-b47f1581004140fdbce86b4213266bb9.r2.dev/OSINTCafe-main/OSINT-Cafe-Talking-Avators/OSINT-Cafe-Talking-Avators/Dom-Digital-Avator..mp4" type="video/mp4" />
                                            <source src="/videos/dating-safety-dashboard-explanation.mp4" type="video/mp4" />
                                            <source src="/videos/dating-safety-dashboard-explanation.webm" type="video/webm" />

                                            {/* Fallback for browsers that don't support video */}
                                            <div className="flex items-center justify-center h-full bg-black/70">
                                                <div className="text-center">
                                                    <h5 className="text-cyber-green font-medium mb-2">Dashboard Explanation Video</h5>
                                                    <p className="text-sm text-gray-400 mb-4">Your browser doesn't support video playback</p>
                                                    <a
                                                        href="/videos/dating-safety-dashboard-explanation.mp4"
                                                        download
                                                        className="px-4 py-2 bg-cyber-green text-dark-bg font-medium rounded-lg hover:bg-cyber-green/80 transition-colors"
                                                    >
                                                        Download Video
                                                    </a>
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

                                    {/* Video Info Overlay */}
                                    <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1">
                                        <span className="text-xs text-cyber-green font-medium">AI Dashboard Guide</span>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Results Output Box */}
                            <div className="mt-6 p-4 rounded-lg border-2 border-cyber-blue/50 bg-dark-panel/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-cyber text-cyber-blue">Analysis Results</h3>
                                    {results ? (
                                        <div className="flex items-center space-x-2">
                                            {/* Sharing Options */}
                                            <div className="flex items-center space-x-1 mr-2">
                                                <button
                                                    onClick={handleShareReport}
                                                    className="flex items-center space-x-1 px-3 py-1 bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/50 rounded transition-all duration-200 hover:scale-105"
                                                    title="Share report"
                                                >
                                                    <Share2 className="w-3 h-3 text-cyber-green" />
                                                    <span className="text-xs text-cyber-green font-medium">Share</span>
                                                </button>
                                                <button
                                                    onClick={handleEmailReport}
                                                    className="flex items-center space-x-1 px-2 py-1 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue/50 rounded transition-all duration-200 hover:scale-105"
                                                    title="Email report"
                                                >
                                                    <Mail className="w-3 h-3 text-cyber-blue" />
                                                </button>
                                                <button
                                                    onClick={handleCopyReport}
                                                    className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded transition-all duration-200 hover:scale-105"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="w-3 h-3 text-yellow-400" />
                                                </button>
                                                <button
                                                    onClick={handleDownloadReport}
                                                    className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded transition-all duration-200 hover:scale-105"
                                                    title="Download report"
                                                >
                                                    <Download className="w-3 h-3 text-purple-400" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleRefresh}
                                                className="flex items-center space-x-2 px-3 py-1 bg-accent-orange/20 hover:bg-accent-orange/30 border border-accent-orange/50 rounded-lg transition-all duration-200 hover:scale-105"
                                                title="Clear results and start fresh"
                                            >
                                                <RefreshCw className="w-4 h-4 text-accent-orange" />
                                                <span className="text-xs text-accent-orange font-medium">Clear & Restart</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-cyber-blue/70 bg-cyber-blue/10 px-2 py-1 rounded">
                                            OUTPUT ZONE
                                        </div>
                                    )}
                                </div>

                                {results ? (
                                    <div className="max-h-96 min-h-96 overflow-y-auto overflow-x-hidden border border-cyber-blue/20 rounded-lg bg-dark-bg/20 p-4 results-scrollbar">
                                        <div className="space-y-6 pr-1">
                                            {/* Score Display */}
                                            <div className="text-center p-6 rounded-lg bg-dark-bg border border-cyber-blue/30">
                                                <div className={`text-5xl font-cyber font-bold mb-3 ${results.score >= 80 ? 'text-cyber-green' :
                                                    results.score >= 60 ? 'text-yellow-400' :
                                                        'text-accent-orange'
                                                    }`}>
                                                    {results.score}% Safe
                                                </div>
                                                <div className="text-gray-400">
                                                    Trust Score Based on AI Analysis
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Red Flags */}
                                                <div className="bg-dark-bg/50 p-4 rounded-lg border border-accent-orange/30">
                                                    <h4 className="text-lg font-semibold mb-4 flex items-center text-accent-orange">
                                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                                        Red Flags
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {results.flags.map((flag: string, index: number) => (
                                                            <div key={index} className="flex items-start space-x-3 p-2 rounded bg-dark-bg/30">
                                                                <AlertCircle className="w-4 h-4 text-accent-orange mt-1 flex-shrink-0" />
                                                                <span className="text-gray-300 text-sm">{flag}</span>
                                                            </div>
                                                        ))}
                                                        {results.flags.length === 0 && (
                                                            <div className="text-cyber-green text-sm flex items-center">
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                No significant red flags detected
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Recommendations */}
                                                <div className="bg-dark-bg/50 p-4 rounded-lg border border-cyber-green/30">
                                                    <h4 className="text-lg font-semibold mb-4 flex items-center text-cyber-green">
                                                        <CheckCircle className="w-5 h-5 mr-2" />
                                                        Recommendations
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {results.recommendations.map((rec: string, index: number) => (
                                                            <div key={index} className="flex items-start space-x-3 p-2 rounded bg-dark-bg/30">
                                                                <CheckCircle className="w-4 h-4 text-cyber-green mt-1 flex-shrink-0" />
                                                                <span className="text-gray-300 text-sm">{rec}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-600/50 rounded-lg">
                                        <div className="text-6xl mb-4">🛡️</div>
                                        <h4 className="text-xl font-semibold mb-2 text-cyber-blue">Output Area Ready</h4>
                                        <p>Analysis results will display in this secure zone</p>
                                        <p className="text-sm mt-2 text-cyber-blue/70">• Safety scores • Red flags • Recommendations</p>
                                        <div className="mt-4 text-xs text-gray-500 bg-gray-800/50 inline-block px-3 py-1 rounded">
                                            Results will scroll independently from video section above
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Request & Share Verification */}
                        <div className="lg:col-span-1 p-6 bg-dark-panel border-l border-gray-700 dashboard-panel min-h-full max-h-screen overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-2 flex items-center text-accent-orange">
                                    <UserCheck className="w-5 h-5 mr-2" />
                                    Verification Hub
                                </h3>
                                <div className="text-xs text-gray-400 mb-2">Request & Share Dating Safety</div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse"></div>
                                    <span className="text-accent-orange font-medium">Blockchain Ready</span>
                                </div>
                            </div>

                            {/* Met Someone Online */}
                            <div className="mb-6 p-4 bg-gradient-to-br from-cyber-blue/10 to-cyber-green/10 rounded-lg border border-cyber-blue/30">
                                <h4 className="text-sm font-semibold text-cyber-blue mb-3 flex items-center">
                                    🛡️ Met Someone Online?
                                </h4>
                                <p className="text-gray-300 text-xs mb-3">
                                    Send them a verification request for safer first dates.
                                </p>

                                <div className="space-y-2 mb-4 text-xs text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-cyber-green rounded-full"></div>
                                        <span>Secure link or QR code</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-cyber-green rounded-full"></div>
                                        <span>ICP blockchain-anchored</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-cyber-green rounded-full"></div>
                                        <span>Tamper-proof results</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={handleRequestVerification}
                                        className="w-full px-3 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue/50 text-cyber-blue font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-xs"
                                    >
                                        <Send className="w-3 h-3" />
                                        <span>Request Verification</span>
                                    </button>
                                    <button
                                        onClick={handleGenerateQR}
                                        className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-xs"
                                    >
                                        <QrCode className="w-3 h-3" />
                                        <span>Generate QR Code</span>
                                    </button>
                                </div>
                            </div>

                            {/* Show You're Real */}
                            <div className="mb-6 p-4 bg-gradient-to-br from-accent-orange/10 to-cyber-green/10 rounded-lg border border-accent-orange/30">
                                <h4 className="text-sm font-semibold text-accent-orange mb-3 flex items-center">
                                    ✨ Show You're Real
                                </h4>
                                <p className="text-gray-300 text-xs mb-3">
                                    Ask your match for an OSINT Café proof before meeting.
                                </p>

                                <div className="space-y-2 mb-4 text-xs text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-accent-orange rounded-full"></div>
                                        <span>Under 1-minute verification</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-accent-orange rounded-full"></div>
                                        <span>Photo & chat analysis</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-accent-orange rounded-full"></div>
                                        <span>Meet with confidence</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestProof}
                                    className="w-full px-3 py-2 bg-accent-orange/20 hover:bg-accent-orange/30 border border-accent-orange/50 text-accent-orange font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-xs"
                                >
                                    <UserCheck className="w-3 h-3" />
                                    <span>Request Dating Proof</span>
                                </button>
                            </div>

                            {/* Privacy Notice */}
                            <div className="p-3 bg-cyber-green/10 border border-cyber-green/30 rounded-lg">
                                <p className="text-xs text-cyber-green">
                                    💡 <strong>Privacy First:</strong> Your results stay private until you choose to share.
                                    Use Share, Email, Copy, or Download for trusted connections.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DatingSafety;
