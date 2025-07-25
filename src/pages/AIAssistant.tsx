import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, MicOff, Volume2, VolumeX, User, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAssistantService } from '../services/aiService';
import { icpIdentityService } from '../services/icpIdentityService';
import type { AIMessage } from '../types';

const AIAssistant = () => {
    const [messages, setMessages] = useState<AIMessage[]>([
        {
            id: '1',
            content: "🕵️ Hello! I'm your AI cybersecurity assistant. I'm here to help you investigate threats, analyze suspicious content, and stay safe online. What would you like to investigate today?",
            role: 'assistant',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    //   const [, setCurrentAnalysis] = useState<AIResponse['analysis'] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ICP Identity state for nickname management
    const [icpIdentity, setIcpIdentity] = useState({
        isAuthenticated: false,
        principal: null as string | null,
        nickname: null as string | null,
        isLoading: false
    });
    const [newNickname, setNewNickname] = useState('');
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        // Initialize ICP Identity service
        const initializeICP = async () => {
            try {
                await icpIdentityService.initialize();
                const state = icpIdentityService.getState();

                // Get user profile to check for existing nickname
                if (state.isAuthenticated) {
                    try {
                        const profile = await icpIdentityService.whoAmI();
                        setIcpIdentity({
                            isAuthenticated: true,
                            principal: state.principal,
                            nickname: profile?.nickname || null,
                            isLoading: false
                        });
                    } catch (error) {
                        console.error('Failed to get user profile:', error);
                        setIcpIdentity({
                            isAuthenticated: true,
                            principal: state.principal,
                            nickname: null,
                            isLoading: false
                        });
                    }
                } else {
                    setIcpIdentity({
                        isAuthenticated: false,
                        principal: null,
                        nickname: null,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.error('Failed to initialize ICP Identity:', error);
            }
        };

        initializeICP();
    }, []);

    useEffect(() => {
        // Only scroll to bottom if there are user messages (not just the initial AI message)
        if (messages.length > 1) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            content: inputMessage,
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await aiAssistantService.sendMessage(currentInput);

            const aiMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                content: response.message,
                role: 'assistant',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            // setCurrentAnalysis(response.analysis);

            // Show suggestions if available
            if (response.suggestions && response.suggestions.length > 0) {
                toast.success(`💡 ${response.suggestions[0]}`);
            }

            // Show threat level if analysis indicates risk
            if (response.analysis && response.analysis.threatLevel !== 'low') {
                const levelColor = response.analysis.threatLevel === 'critical' ? '🔴' :
                    response.analysis.threatLevel === 'high' ? '🟠' : '🟡';
                toast.error(`${levelColor} Threat Level: ${response.analysis.threatLevel.toUpperCase()}`);
            }
        } catch (error) {
            console.error('AI Assistant Error:', error);
            const errorMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or check if your API keys are configured properly.",
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error('Failed to get AI response');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            toast.success('Listening... Speak now');
            // Here you would implement speech-to-text
            setTimeout(() => {
                setIsListening(false);
                setInputMessage('Can you help me analyze this suspicious email I received?');
                toast.success('Speech captured!');
            }, 3000);
        } else {
            toast.error('Stopped listening');
        }
    };

    const toggleSpeaking = () => {
        setIsSpeaking(!isSpeaking);
        if (!isSpeaking) {
            toast.success('Reading message aloud');
            // Here you would implement text-to-speech
            setTimeout(() => {
                setIsSpeaking(false);
            }, 3000);
        } else {
            toast.error('Stopped speaking');
        }
    };

    // ICP Ninja: Handle ICP login
    const handleICPLogin = async () => {
        setIcpIdentity(prev => ({ ...prev, isLoading: true }));

        try {
            const result = await icpIdentityService.login();
            if (result.success) {
                // Get user profile to check for existing nickname
                try {
                    const profile = await icpIdentityService.whoAmI();
                    setIcpIdentity({
                        isAuthenticated: true,
                        principal: result.principal || null,
                        nickname: profile?.nickname || null,
                        isLoading: false
                    });
                    toast.success('🔐 Internet Identity verified for nickname management!');
                } catch (error) {
                    console.error('Failed to get profile after login:', error);
                    setIcpIdentity({
                        isAuthenticated: true,
                        principal: result.principal || null,
                        nickname: null,
                        isLoading: false
                    });
                    toast.success('🔐 Internet Identity verified!');
                }
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

    // ICP Ninja: Set nickname
    const handleSetNickname = async () => {
        if (!icpIdentity.isAuthenticated) {
            toast.error('Please connect with Internet Identity first');
            return;
        }

        if (!newNickname.trim()) {
            toast.error('Please enter a nickname');
            return;
        }

        setIsUpdatingNickname(true);
        try {
            await icpIdentityService.setNickname(newNickname.trim());

            // Update local state
            setIcpIdentity(prev => ({
                ...prev,
                nickname: newNickname.trim()
            }));

            setNewNickname('');
            toast.success(`🎯 Nickname set to "${newNickname.trim()}"!`);

            // Add a personalized message to the chat
            const personalizedMessage: AIMessage = {
                id: Date.now().toString(),
                content: `🎉 Great! I'll remember to call you ${newNickname.trim()} from now on. How can I assist you today, ${newNickname.trim()}?`,
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, personalizedMessage]);

        } catch (error) {
            console.error('Nickname update failed:', error);
            toast.error('Failed to set nickname');
        } finally {
            setIsUpdatingNickname(false);
        }
    };

    const quickActions = [
        { label: 'Analyze Email', prompt: 'I received a suspicious email. Can you help me analyze it?' },
        { label: 'Check Website', prompt: 'Is this website legitimate and safe to use?' },
        { label: 'Verify Profile', prompt: 'I want to verify if this social media profile is authentic.' },
        { label: 'Scam Detection', prompt: 'I think I might be dealing with a scam. Can you help?' }
    ];

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-5xl md:text-6xl font-cyber font-bold mb-8">
                        <span className="text-cyber-green">🤖 AI</span>{' '}
                        <span className="text-cyber-blue">Assistant</span>{' '}
                        <span className="text-accent-orange">Hub</span>
                    </h2>
                    <div className="w-40 h-1.5 bg-gradient-to-r from-cyber-green via-cyber-blue to-accent-orange mx-auto mb-8 rounded-full shadow-lg shadow-cyber-green/50"></div>
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Your AI-powered cybersecurity investigation assistant with advanced threat analysis capabilities.
                        Get expert guidance and real-time security insights powered by machine learning.
                    </p>
                </motion.div>

                {/* ICP Ninja: Nickname Management Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mb-8 p-6 bg-gradient-to-r from-cyber-green/10 to-cyber-blue/10 rounded-xl border border-cyber-green/30"
                >
                    <h3 className="text-xl font-bold text-cyber-green mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        ICP Personality Manager
                    </h3>

                    {icpIdentity.isAuthenticated ? (
                        <div className="space-y-4">
                            {/* Current Identity Status */}
                            <div className="flex items-center justify-between p-4 bg-cyber-green/10 rounded-lg border border-cyber-green/30">
                                <div className="flex items-center space-x-3">
                                    <Key className="w-5 h-5 text-cyber-green" />
                                    <div>
                                        <div className="text-cyber-green font-medium">
                                            {icpIdentity.nickname ? `Hello, ${icpIdentity.nickname}!` : 'Identity Connected'}
                                        </div>
                                        <div className="text-xs text-gray-300">
                                            Principal: {icpIdentity.principal?.substring(0, 12)}...
                                        </div>
                                    </div>
                                </div>
                                {icpIdentity.nickname && (
                                    <div className="text-sm text-cyber-green font-medium">
                                        ✅ Nickname Set
                                    </div>
                                )}
                            </div>

                            {/* Nickname Manager */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value)}
                                        placeholder={icpIdentity.nickname ? `Current: ${icpIdentity.nickname}` : 'Enter your preferred nickname...'}
                                        className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none"
                                        maxLength={32}
                                        disabled={isUpdatingNickname}
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleSetNickname}
                                        disabled={!newNickname.trim() || isUpdatingNickname}
                                        className="w-full bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/50 text-cyber-green font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {isUpdatingNickname ? '🔄 Setting...' : '🎯 Set Nickname'}
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400">
                                💡 Your AI assistant will use this nickname to personalize responses and remember your preferences.
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-gray-300 mb-4">
                                Connect with Internet Identity to personalize your AI assistant experience
                            </div>
                            <button
                                onClick={handleICPLogin}
                                disabled={icpIdentity.isLoading}
                                className="px-6 py-3 bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/50 text-cyber-green font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {icpIdentity.isLoading ? 'Connecting...' : '🔐 Connect ICP Identity'}
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="cyber-border bg-dark-panel rounded-xl overflow-hidden"
                >
                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${message.role === 'user'
                                        ? 'bg-cyber-blue text-dark-bg'
                                        : 'bg-dark-bg border border-cyber-blue/30'
                                        }`}
                                >
                                    <div className="flex items-start space-x-2">
                                        {message.role === 'assistant' && (
                                            <Bot className="w-5 h-5 text-cyber-blue mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm">{message.content}</p>
                                            <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-dark-bg/70' : 'text-gray-400'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                        {message.role === 'assistant' && (
                                            <button
                                                onClick={toggleSpeaking}
                                                className="p-1 hover:bg-cyber-blue/20 rounded"
                                            >
                                                {isSpeaking ? (
                                                    <VolumeX className="w-4 h-4 text-cyber-blue" />
                                                ) : (
                                                    <Volume2 className="w-4 h-4 text-cyber-blue" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-start"
                            >
                                <div className="bg-dark-bg border border-cyber-blue/30 px-4 py-3 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                        <Bot className="w-5 h-5 text-cyber-blue" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="px-6 py-4 border-t border-gray-700"
                    >
                        <div className="flex flex-wrap gap-2 mb-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInputMessage(action.prompt)}
                                    className="px-3 py-1 text-xs bg-cyber-blue/20 text-cyber-blue rounded-full hover:bg-cyber-blue/30 transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-gray-700">
                        <div className="flex space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask our AI assistant anything about cybersecurity..."
                                    className="w-full px-4 py-3 pr-12 bg-dark-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyber-blue focus:outline-none"
                                />
                                <button
                                    onClick={toggleListening}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${isListening ? 'text-red-400' : 'text-gray-400 hover:text-cyber-blue'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300 disabled:opacity-50"
                                aria-label="Send message"
                                title="Send message"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            title: 'Threat Analysis',
                            description: 'Advanced AI analysis of suspicious content and potential threats',
                            icon: '🔍'
                        },
                        {
                            title: 'Voice Interaction',
                            description: 'Natural voice commands and audio responses for hands-free operation',
                            icon: '🎤'
                        },
                        {
                            title: 'Real-time Intel',
                            description: 'Access to live threat intelligence and cybersecurity databases',
                            icon: '📡'
                        }
                    ].map((feature, index) => (
                        <div key={index} className="cyber-border bg-dark-panel rounded-xl p-6 text-center">
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-cyber-blue mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default AIAssistant;
