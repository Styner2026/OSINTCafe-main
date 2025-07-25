import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Upload, Search, Users, Heart, AlertCircle, Key, Globe } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { datingSafetyService, type ProfileAnalysis } from '../services/datingSafetyService';
import { icpIdentityService } from '../services/icpIdentityService';
import type { AnalysisType } from '../types';

const DatingSafety = () => {
    const [analysisType, setAnalysisType] = useState<AnalysisType>('profile');
    const [inputData, setInputData] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<ProfileAnalysis | null>(null);
    // const [conversationResults, setConversationResults] = useState<ConversationAnalysis | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
            console.error('ICP login failed:', error);
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
            console.error('ICP logout failed:', error);
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
            toast.error('Please enter some data to analyze or upload an image');
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
                // PHOTO CHECK TAB - REAL Pica AI
                if (uploadedFiles.length === 0) {
                    toast.error('Please upload an image to analyze');
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
                        '🔍 PICA AI IMAGE ANALYSIS COMPLETE',
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
                            `🔐 Internet Identity Verified by: ${icpReport.verifiedBy}`,
                            `🎯 ICP Risk Level: ${icpReport.riskLevel.toUpperCase()}`,
                            ...icpReport.recommendations.slice(0, 3)
                        );

                        if (icpReport.identityVerified) {
                            profileAnalysis.score = Math.min(profileAnalysis.score + 10, 100);
                        }
                    } catch (error) {
                        console.error('ICP verification failed:', error);
                        profileAnalysis.recommendations.unshift('⚠️ ICP verification temporarily unavailable');
                    }
                }

                setResults(profileAnalysis);

                // Don't show popup toast - results already display in the Analysis Results box
                console.log('✅ Profile analysis completed and displayed in dashboard');
            }
        } catch (error) {
            console.error('Analysis Error:', error);
            // Only show error in console - user can see the analysis failed by lack of results
            setResults(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // const riskLevel = results && results.score >= 80 ? 'low' : results && results.score >= 60 ? 'medium' : 'high';

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10 text-cyber-blue mr-4" />
                        <h1 className="text-5xl md:text-6xl font-cyber font-bold text-cyber-blue">Dating Safety Center</h1>
                    </div>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-cyber-blue via-cyber-green to-accent-orange mx-auto mb-6 rounded-full shadow-lg shadow-cyber-blue/50"></div>
                    <p className="text-xl text-gray-300">
                        Protect yourself from romance scams and verify online dating profiles
                    </p>
                </div>

                {/* ICP Identity Verification Panel */}
                <div className="mb-8">
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

                {/* Main Dashboard Container */}
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-dark-panel rounded-2xl cyber-border shadow-2xl shadow-black/50 dashboard-container relative z-10 backdrop-blur-sm"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 dashboard-grid gap-0">
                            {/* Left Panel - Analysis Tools */}
                            <div className="lg:col-span-1 p-6 bg-dark-panel border-r border-gray-700 dashboard-panel min-h-full">
                                {/* Analysis Header */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-cyber-blue mb-2 flex items-center">
                                        <Search className="w-5 h-5 mr-2" />
                                        Analysis Terminal
                                    </h3>
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
                                                className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                                                    isActive
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
                                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                                        isDragActive ? 'border-cyber-green bg-cyber-green/10' : 'border-gray-600 hover:border-gray-500'
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
                            </div>

                            {/* Right Panel - Results & Community */}
                            <div className="lg:col-span-2 p-8 dashboard-panel min-h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-cyber-blue flex items-center">
                                        <Shield className="w-6 h-6 mr-2" />
                                    </h3>
                                </div>

                                {/* Analysis Results */}
                                {results ? (
                                    <div className="space-y-6">
                                        {/* Score Display */}
                                        <div className="text-center p-6 rounded-lg bg-dark-bg border border-cyber-blue/30">
                                            <div className={`text-5xl font-cyber font-bold mb-3 ${
                                                results.score >= 80 ? 'text-cyber-green' :
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
                                ) : (
                                    <div className="text-center text-gray-400 py-12">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h4 className="text-xl font-semibold mb-2">Ready for Analysis</h4>
                                        <p>Choose an analysis type and enter data to see results</p>
                                        <p className="text-sm mt-2">Safety scores, red flags, and recommendations will appear here</p>
                                    </div>
                                )}

                                {/* Safety Tips Dashboard */}
                                <div className="mt-8 p-6 bg-dark-bg/30 rounded-lg border border-gray-600">
                                    <h4 className="text-lg font-semibold mb-4 flex items-center text-cyber-blue">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Dating Safety Tips
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <h5 className="font-semibold text-cyber-green">✓ Do:</h5>
                                            <ul className="text-sm text-gray-300 space-y-1">
                                                <li>• Video chat before meeting</li>
                                                <li>• Meet in public places</li>
                                                <li>• Trust your instincts</li>
                                                <li>• Verify their identity</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h5 className="font-semibold text-accent-orange">✗ Don't:</h5>
                                            <ul className="text-sm text-gray-300 space-y-1">
                                                <li>• Send money or gifts</li>
                                                <li>• Share personal info early</li>
                                                <li>• Ignore red flags</li>
                                                <li>• Meet at private locations</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Romance Scam Stats */}
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-dark-bg/30 rounded-lg border border-red-500/30">
                                        <div className="text-2xl font-bold text-red-400">$547M</div>
                                        <div className="text-xs text-gray-400">Lost to romance scams in 2023</div>
                                    </div>
                                    <div className="text-center p-4 bg-dark-bg/30 rounded-lg border border-yellow-500/30">
                                        <div className="text-2xl font-bold text-yellow-400">24K+</div>
                                        <div className="text-xs text-gray-400">Reported victims</div>
                                    </div>
                                    <div className="text-center p-4 bg-dark-bg/30 rounded-lg border border-blue-500/30">
                                        <div className="text-2xl font-bold text-blue-400">65+</div>
                                        <div className="text-xs text-gray-400">Average victim age</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
                                    </h3>
                                </div>
                    {/* Analysis Panel */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="cyber-border bg-dark-panel rounded-xl p-6 h-[800px] flex flex-col overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 flex items-center text-cyber-blue">
                                <Search className="w-6 h-6 text-cyber-blue mr-2" />
                                Profile Analysis
                            </h2>

                            {/* Analysis Type Selector */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                                {[
                                    { key: 'profile', label: 'Profile Info', icon: Users },
                                    { key: 'image', label: 'Photo Check', icon: Upload },
                                    { key: 'conversation', label: 'Chat Analysis', icon: Heart }
                                ].map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.key}
                                            onClick={() => setAnalysisType(type.key as AnalysisType)}
                                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 w-full sm:w-auto ${analysisType === type.key
                                                ? 'cyber-border bg-cyber-blue/20 text-cyber-blue'
                                                : 'border border-cyber-blue/50 text-cyber-blue/80 hover:text-cyber-blue hover:border-cyber-blue hover:bg-cyber-blue/10'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className="flex flex-col space-y-4 min-h-[250px]">
                                {analysisType === 'image' ? (
                                    <>
                                        {uploadedFiles.length > 0 ? (
                                            <div className="flex flex-col space-y-3">
                                                {/* Image Preview */}
                                                <div className="bg-dark-bg rounded-lg p-3 border border-cyber-blue/30">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="text-cyber-blue font-medium text-sm">Uploaded Image</h4>
                                                        <button
                                                            onClick={() => setUploadedFiles([])}
                                                            className="text-gray-400 hover:text-accent-orange transition-colors text-sm"
                                                        >
                                                            ✕ Remove
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
                                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex-1 flex flex-col justify-center ${isDragActive ? 'border-cyber-blue bg-cyber-blue/10' : 'border-gray-600 hover:border-gray-500'
                                                    }`}
                                            >
                                                <input {...getInputProps()} />
                                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-300 mb-2">
                                                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    Supports JPG, PNG, GIF up to 10MB
                                                </p>
                                            </div>
                                        )}
                                        <button
                                            onClick={handleAnalysis}
                                            disabled={isAnalyzing || uploadedFiles.length === 0}
                                            className="w-full py-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isAnalyzing ? '🔍 Analyzing with DeepSeek AI...' : 'Analyze Image'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-300">
                                            {analysisType === 'profile' ? 'Enter profile information or social media links' : 'Paste conversation text'}
                                        </label>
                                        <textarea
                                            value={inputData}
                                            onChange={(e) => setInputData(e.target.value)}
                                            className="w-full flex-1 px-4 py-3 bg-dark-bg border border-cyber-blue/50 rounded-lg text-cyber-blue placeholder-cyber-blue/50 focus:border-cyber-blue focus:outline-none resize-none overflow-y-auto"
                                            placeholder={
                                                analysisType === 'profile'
                                                    ? 'Profile description, social media links, or any information to verify...'
                                                    : 'Paste your conversation here for AI analysis...'
                                            }
                                        />
                                        <button
                                            onClick={handleAnalysis}
                                            disabled={isAnalyzing || !inputData.trim()}
                                            className="w-full py-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isAnalyzing ?
                                                (analysisType === 'profile' ? '🔍 Analyzing with Gemini AI + Dappier...' : '🔍 Analyzing with Gemini AI...') :
                                                (analysisType === 'profile' ? 'Analyze Profile' : 'Analyze Conversation')
                                            }
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Analysis Status */}
                            {(inputData.trim() || uploadedFiles.length > 0) && (
                                <div className="mt-3 p-3 bg-dark-bg/50 rounded-lg border border-cyber-blue/30">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-cyber-blue text-sm">📋</div>
                                        <div>
                                            <div className="text-xs font-medium text-cyber-blue">Ready to Analyze:</div>
                                            <div className="text-xs text-gray-400">
                                                {analysisType === 'profile' && inputData.trim() &&
                                                    `Profile text (${inputData.length} chars)`
                                                }
                                                {analysisType === 'conversation' && inputData.trim() &&
                                                    `Conversation (${inputData.split('\n').filter(line => line.trim()).length} messages)`
                                                }
                                                {analysisType === 'image' && uploadedFiles.length > 0 &&
                                                    `Image: ${uploadedFiles[0].name}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Analysis Progress */}
                            {isAnalyzing && (
                                <div className="mt-3 p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/30">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin text-cyber-blue text-sm">⚡</div>
                                        <div>
                                            <div className="text-xs font-medium text-cyber-blue">
                                                {analysisType === 'profile' && 'Analyzing with Gemini AI + Dappier...'}
                                                {analysisType === 'conversation' && 'Analyzing with Gemini AI...'}
                                                {analysisType === 'image' && 'Analyzing with DeepSeek AI...'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Real-time AI analysis • 10-30 seconds
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}                            {/* Results */}
                            <div className="mt-6 p-6 cyber-border bg-dark-panel rounded-xl">
                                <h3 className="text-xl font-bold mb-6 text-cyber-blue flex items-center">
                                    <Shield className="w-6 h-6 mr-3 text-cyber-blue" />
                                    Analysis Results
                                </h3>
                                {results ? (
                                    <div className="space-y-6">
                                        {/* Score Display */}
                                        <div className="text-center p-4 rounded-lg bg-dark-bg border border-cyber-blue/30">
                                            <div className={`text-4xl font-cyber font-bold mb-2 ${results.score >= 80 ? 'text-cyber-green' :
                                                results.score >= 60 ? 'text-yellow-400' :
                                                    'text-accent-orange'
                                                }`}>
                                                {results.score}% Safe
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                Trust Score Based on AI Analysis
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            <span className="text-gray-300 text-sm leading-relaxed">{flag}</span>
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
                                                            <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-12">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <p>Run an analysis to see results here</p>
                                        <p className="text-sm mt-2">Safety score, red flags, and recommendations will appear in this area</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Safety Score */}
                        <div className="cyber-border bg-dark-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <Shield className="w-5 h-5 text-cyber-blue mr-2" />
                                Safety Tips
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-dark-bg/50 rounded-lg">
                                    <h4 className="font-semibold text-green-400 mb-2">✓ Do</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Video chat before meeting</li>
                                        <li>• Meet in public places</li>
                                        <li>• Trust your instincts</li>
                                        <li>• Verify their identity</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-dark-bg/50 rounded-lg">
                                    <h4 className="font-semibold text-red-400 mb-2">✗ Don't</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>• Send money or gifts</li>
                                        <li>• Share personal info early</li>
                                        <li>• Ignore red flags</li>
                                        <li>• Meet at private locations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="cyber-border bg-dark-panel rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Romance Scam Stats</h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-red-400">$547M</div>
                                    <div className="text-sm text-gray-400">Lost to romance scams in 2023</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">24K+</div>
                                    <div className="text-sm text-gray-400">Reported victims</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400">65+</div>
                                    <div className="text-sm text-gray-400">Average victim age</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatingSafety;