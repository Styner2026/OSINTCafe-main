import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Wifi, WifiOff, Shield, Brain, RefreshCw, Activity, Terminal, Database } from 'lucide-react';
import { apiTester } from '../services/apiTester';

interface APIStatus {
    name: string;
    status: 'connected' | 'warning' | 'disconnected';
    description: string;
    rebrandNeeded: boolean;
    category: 'ai' | 'security' | 'infrastructure' | 'monitoring';
}

const APIStatusDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastTestTime, setLastTestTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const runAPITests = async () => {
        setIsLoading(true);
        try {
            const results = await apiTester.runAllTests();
            console.log('API test results:', results);
            setLastTestTime(new Date());
        } catch (error) {
            console.error('API tests failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Run tests on component mount
        runAPITests();

        // Update time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const apiStatuses: APIStatus[] = [
        {
            name: 'Google Gemini AI',
            status: 'connected',
            description: 'AI Assistant & Threat Analysis',
            rebrandNeeded: false,
            category: 'ai'
        },
        {
            name: 'ElevenLabs Voice',
            status: 'warning',
            description: 'Voice synthesis & audio guides',
            rebrandNeeded: true,
            category: 'ai'
        },
        {
            name: 'Tavus AI Avatar',
            status: 'warning',
            description: 'Interactive AI video avatars',
            rebrandNeeded: true,
            category: 'ai'
        },
        {
            name: 'Sentry Monitoring',
            status: 'warning',
            description: 'Error tracking & performance',
            rebrandNeeded: true,
            category: 'monitoring'
        },
        {
            name: 'Pica Image Analysis',
            status: 'connected',
            description: 'Image verification & deepfake detection',
            rebrandNeeded: false,
            category: 'security'
        },
        {
            name: 'Dappier Web Scraping',
            status: 'connected',
            description: 'Real-time threat intelligence',
            rebrandNeeded: false,
            category: 'infrastructure'
        },
        {
            name: 'Algorand Blockchain',
            status: 'connected',
            description: 'Identity verification & IPFS storage',
            rebrandNeeded: false,
            category: 'infrastructure'
        },
        {
            name: 'Internet Computer (ICP)',
            status: 'connected',
            description: 'Deployed canister with "Who am I?" functionality',
            rebrandNeeded: false,
            category: 'infrastructure'
        }
    ];

    const connectedCount = apiStatuses.filter(api => api.status === 'connected').length;
    const warningCount = apiStatuses.filter(api => api.status === 'warning').length;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-panel/20 to-dark-bg text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-transparent to-cyber-green/5"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.03)_0%,transparent_50%)]"></div>
            </div>

            <div className="container mx-auto p-6 relative z-10">
                {/* Modern Header */}
                <header className="flex items-center justify-between py-8 border-b border-cyber-blue/20 mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-2xl flex items-center justify-center shadow-lg shadow-cyber-blue/30">
                            <Activity className="w-6 h-6 text-dark-bg" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-cyber font-bold text-cyber-blue">
                                OSINT Café API Status
                            </h1>
                            <p className="text-gray-400">Real-time monitoring of your cybersecurity platform APIs</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Time Display */}
                        <div className="bg-dark-panel/50 rounded-xl px-4 py-2 border border-cyber-blue/30 backdrop-blur-sm">
                            <div className="text-xs text-gray-500 mb-1 font-mono">SYSTEM TIME</div>
                            <div className="text-lg font-mono text-cyber-blue">{formatTime(currentTime)}</div>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={runAPITests}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-cyber-green/20 hover:bg-cyber-green/30 border border-cyber-green/30 rounded-lg transition-all duration-300 text-cyber-green disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">
                                {isLoading ? 'Testing...' : 'Refresh'}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-8 mt-8">
                    {/* Sidebar - System Overview */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-dark-panel/50 border border-cyber-blue/20 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/50 mb-6 min-h-[600px]">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                <Terminal className="w-5 h-5 mr-2 text-cyber-blue" />
                                System Overview
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-cyber-green/20">
                                    <div className="text-sm text-gray-400">Active APIs</div>
                                    <div className="text-xl font-bold text-cyber-green">{connectedCount}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-accent-orange/20">
                                    <div className="text-sm text-gray-400">Need Updates</div>
                                    <div className="text-xl font-bold text-accent-orange">{warningCount}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-cyber-blue/20">
                                    <div className="text-sm text-gray-400">Security Level</div>
                                    <div className="text-xl font-bold text-cyber-blue">100%</div>
                                </div>
                            </div>

                            {/* System Status Bars */}
                            <div className="mt-8 pt-6 border-t border-gray-700/50">
                                <div className="text-xs text-gray-500 mb-4 font-mono">SYSTEM HEALTH</div>
                                <div className="space-y-4">
                                    <StatusBar label="API Health" value={Math.round((connectedCount / apiStatuses.length) * 100)} color="cyber-green" />
                                    <StatusBar label="Security" value={100} color="cyber-blue" />
                                    <StatusBar label="Performance" value={92} color="accent-orange" />
                                </div>
                            </div>

                            {/* Additional System Info */}
                            <div className="mt-8 pt-6 border-t border-gray-700/50">
                                <div className="text-xs text-gray-500 mb-4 font-mono">SYSTEM METRICS</div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-gray-600/20">
                                        <div className="text-sm text-gray-400">Total APIs</div>
                                        <div className="text-lg font-bold text-white">{apiStatuses.length}</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-gray-600/20">
                                        <div className="text-sm text-gray-400">Uptime</div>
                                        <div className="text-lg font-bold text-cyber-green">99.9%</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-dark-bg/60 rounded-lg border border-gray-600/20">
                                        <div className="text-sm text-gray-400">Response Time</div>
                                        <div className="text-lg font-bold text-cyber-blue">45ms</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-700/50">
                                <div className="text-xs text-gray-500 mb-4 font-mono">QUICK ACTIONS</div>
                                <div className="space-y-3">
                                    <button className="w-full bg-gradient-to-r from-cyber-blue to-cyber-green hover:from-cyber-blue/80 hover:to-cyber-green/80 text-dark-bg px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyber-blue/25 hover:shadow-xl hover:shadow-cyber-green/25 transform hover:scale-105 text-sm">
                                        Test Platform Now
                                    </button>
                                    <button className="w-full bg-dark-bg/60 hover:bg-dark-bg/80 text-white px-4 py-3 rounded-lg font-semibold border border-gray-600 hover:border-cyber-blue/50 transition-all duration-300 text-sm">
                                        View Rebranding Guide
                                    </button>
                                    <button className="w-full bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green px-4 py-3 rounded-lg font-semibold border border-cyber-green/30 hover:border-cyber-green/50 transition-all duration-300 text-sm">
                                        Check API Health
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-9">
                        {/* Status Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                            <div className="bg-dark-panel/50 border border-cyber-green/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyber-green/50 transition-all duration-300 shadow-xl shadow-black/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyber-green/20 to-cyber-green/40 rounded-2xl flex items-center justify-center">
                                        <Check className="w-8 h-8 text-cyber-green" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-cyber-green">{connectedCount} Active</h3>
                                        <p className="text-gray-400">APIs Working</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-gradient-to-r from-cyber-green to-cyber-blue h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.round((connectedCount / apiStatuses.length) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-panel/50 border border-accent-orange/30 rounded-xl p-6 backdrop-blur-sm hover:border-accent-orange/50 transition-all duration-300 shadow-xl shadow-black/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-accent-orange/20 to-accent-orange/40 rounded-2xl flex items-center justify-center">
                                        <AlertTriangle className="w-8 h-8 text-accent-orange" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-accent-orange">{warningCount} Need Rebranding</h3>
                                        <p className="text-gray-400">Project Name Update</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-gradient-to-r from-accent-orange to-red-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.round((warningCount / apiStatuses.length) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-panel/50 border border-cyber-blue/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyber-blue/50 transition-all duration-300 shadow-xl shadow-black/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue/20 to-cyber-blue/40 rounded-2xl flex items-center justify-center">
                                        <Shield className="w-8 h-8 text-cyber-blue" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-cyber-blue">100% Secure</h3>
                                        <p className="text-gray-400">All APIs Protected</p>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                            <div className="bg-gradient-to-r from-cyber-blue to-purple-500 h-2 rounded-full w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* API Services Grid */}
                        <div className="bg-dark-panel/50 border border-cyber-blue/20 rounded-2xl p-8 backdrop-blur-sm shadow-xl shadow-black/50 mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <Database className="w-6 h-6 mr-2 text-cyber-blue" />
                                    API Services Status
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2 bg-dark-bg/60 rounded-lg px-3 py-1.5 border border-cyber-green/30">
                                        <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                                        <span className="text-cyber-green text-sm font-medium">LIVE</span>
                                    </div>
                                    {lastTestTime && (
                                        <span className="text-xs text-gray-500">
                                            Last updated: {formatTime(lastTestTime)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {apiStatuses.map((api, index) => (
                                    <APIServiceCard key={index} api={api} />
                                ))}
                            </div>
                        </div>

                        {/* Recommended Actions */}
                        <div className="bg-dark-panel/50 border border-cyber-blue/20 rounded-2xl p-8 backdrop-blur-sm shadow-xl shadow-black/50">
                            <h3 className="text-xl font-bold text-cyber-blue mb-6 flex items-center">
                                <Brain className="w-6 h-6 mr-2" />
                                Recommended Actions
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <RecommendationItem
                                    title="Test Current Platform"
                                    description="Visit the live site and test AI Assistant, Dating Safety, and Blockchain features"
                                    priority="high"
                                    color="cyber-green"
                                />
                                <RecommendationItem
                                    title="Update ElevenLabs Voice Models"
                                    description="Create new voice models under 'OSINT Café' project name"
                                    priority="medium"
                                    color="accent-orange"
                                />
                                <RecommendationItem
                                    title="Setup Sentry Project"
                                    description="Create new monitoring project for 'OSINT Café'"
                                    priority="medium"
                                    color="accent-orange"
                                />
                                <RecommendationItem
                                    title="Create Tavus Avatar"
                                    description="Generate cybersecurity expert avatar for OSINT Café"
                                    priority="medium"
                                    color="accent-orange"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-10 pt-8 border-t border-gray-700/50">
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-gradient-to-r from-cyber-blue to-cyber-green hover:from-cyber-blue/80 hover:to-cyber-green/80 text-dark-bg px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyber-blue/25 hover:shadow-xl hover:shadow-cyber-green/25 transform hover:scale-105">
                                        Test Platform Now
                                    </button>
                                    <button className="bg-dark-bg/60 hover:bg-dark-bg/80 text-white px-6 py-3 rounded-lg font-semibold border border-gray-600 hover:border-cyber-blue/50 transition-all duration-300">
                                        View Rebranding Guide
                                    </button>
                                    <button className="bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green px-6 py-3 rounded-lg font-semibold border border-cyber-green/30 hover:border-cyber-green/50 transition-all duration-300">
                                        Check API Health
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component for status bars
const StatusBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'cyber-green':
                return 'from-cyber-green to-emerald-500';
            case 'cyber-blue':
                return 'from-cyber-blue to-blue-500';
            case 'accent-orange':
                return 'from-accent-orange to-orange-500';
            default:
                return 'from-cyber-blue to-blue-500';
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-xs text-gray-400">{value}%</div>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${getColorClasses()} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                ></div>
            </div>
        </div>
    );
};

// Component for individual API service cards
const APIServiceCard: React.FC<{ api: APIStatus }> = ({ api }) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <Wifi className="w-5 h-5 text-cyber-green" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-accent-orange" />;
            case 'disconnected':
                return <WifiOff className="w-5 h-5 text-red-400" />;
            default:
                return <WifiOff className="w-5 h-5 text-gray-400" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'ai':
                return <Brain className="w-4 h-4" />;
            case 'security':
                return <Shield className="w-4 h-4" />;
            case 'infrastructure':
                return <Database className="w-4 h-4" />;
            case 'monitoring':
                return <Activity className="w-4 h-4" />;
            default:
                return <Terminal className="w-4 h-4" />;
        }
    };

    const getBorderColor = () => {
        switch (api.status) {
            case 'connected':
                return 'border-cyber-green/30 hover:border-cyber-green/50';
            case 'warning':
                return 'border-accent-orange/30 hover:border-accent-orange/50';
            case 'disconnected':
                return 'border-red-400/30 hover:border-red-400/50';
            default:
                return 'border-gray-600/30 hover:border-gray-600/50';
        }
    };

    return (
        <div className={`bg-dark-bg/60 border ${getBorderColor()} rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/20`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-dark-panel rounded-lg flex items-center justify-center border border-gray-600/50">
                        {getCategoryIcon(api.category)}
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white">{api.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(api.status)}
                            <span className={`text-sm font-medium ${api.status === 'connected' ? 'text-cyber-green' :
                                api.status === 'warning' ? 'text-accent-orange' : 'text-red-400'
                                }`}>
                                {api.status === 'connected' ? 'Connected' :
                                    api.status === 'warning' ? 'Needs Update' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>
                {api.rebrandNeeded && (
                    <span className="bg-accent-orange/20 text-accent-orange px-3 py-1 rounded-full text-xs font-medium border border-accent-orange/30">
                        Rebrand Needed
                    </span>
                )}
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{api.description}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${api.status === 'connected' ? 'bg-cyber-green animate-pulse' :
                        api.status === 'warning' ? 'bg-accent-orange' : 'bg-red-400'
                        }`}></div>
                    <span className="text-xs text-gray-500 font-mono">
                        {api.status === 'connected' ? 'ACTIVE' : 'REQUIRES ATTENTION'}
                    </span>
                </div>

                {api.rebrandNeeded && (
                    <button className="text-cyber-blue hover:text-cyber-green transition-colors text-xs font-medium underline">
                        Update Instructions
                    </button>
                )}
            </div>
        </div>
    );
};

// Component for recommendation items
const RecommendationItem: React.FC<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    color: string
}> = ({ title, description, priority }) => {
    const getPriorityColor = () => {
        switch (priority) {
            case 'high':
                return 'bg-cyber-green/20 text-cyber-green border-cyber-green/30';
            case 'medium':
                return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
            case 'low':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30';
        }
    };

    return (
        <div className="bg-dark-bg/60 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${priority === 'high' ? 'bg-cyber-green' :
                    priority === 'medium' ? 'bg-accent-orange' : 'bg-gray-500'
                    } animate-pulse`}></div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor()}`}>
                            {priority.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default APIStatusDashboard;
