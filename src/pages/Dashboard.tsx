import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Shield, AlertTriangle, Users, Globe, Database } from 'lucide-react';
import { icpIdentityService } from '../services/icpIdentityService';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('global');

    // ICP Identity state for platform statistics
    const [icpIdentity, setIcpIdentity] = useState({
        isAuthenticated: false,
        principal: null as string | null,
        isLoading: false
    });
    const [icpStats, setIcpStats] = useState<Record<string, number> | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    const timeframes = [
        { key: '1h', label: '1 Hour' },
        { key: '24h', label: '24 Hours' },
        { key: '7d', label: '7 Days' },
        { key: '30d', label: '30 Days' }
    ];

    const categories = [
        { key: 'all', label: 'All Threats', icon: '🛡️' },
        { key: 'phishing', label: 'Phishing', icon: '🎣' },
        { key: 'scams', label: 'Scams', icon: '💰' },
        { key: 'malware', label: 'Malware', icon: '🦠' },
        { key: 'fraud', label: 'Fraud', icon: '🚨' }
    ];

    const regions = [
        { key: 'global', label: 'Global' },
        { key: 'na', label: 'North America' },
        { key: 'eu', label: 'Europe' },
        { key: 'asia', label: 'Asia Pacific' }
    ];

    const threatData = [
        { time: '00:00', threats: 45, blocked: 42 },
        { time: '04:00', threats: 67, blocked: 63 },
        { time: '08:00', threats: 89, blocked: 85 },
        { time: '12:00', threats: 123, blocked: 118 },
        { time: '16:00', threats: 98, blocked: 94 },
        { time: '20:00', threats: 76, blocked: 72 }
    ];

    const categoryData = [
        { name: 'Phishing', value: 35, color: '#ff6b35' },
        { name: 'Scams', value: 28, color: '#00f5ff' },
        { name: 'Malware', value: 22, color: '#39ff14' },
        { name: 'Fraud', value: 15, color: '#ffff00' }
    ];

    const stats = [
        { title: 'Total Threats', value: '1,247', change: '+12%', icon: AlertTriangle, color: 'text-red-400' },
        { title: 'Blocked Attacks', value: '1,189', change: '+8%', icon: Shield, color: 'text-green-400' },
        { title: 'Active Users', value: '8,432', change: '+15%', icon: Users, color: 'text-blue-400' },
        { title: 'Global Coverage', value: '99.9%', change: '+0.1%', icon: Globe, color: 'text-cyan-400' }
    ];

    // ICP Ninja: Initialize ICP and load stats
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

    // ICP Ninja: Handle ICP login
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
                toast.success('🔐 Internet Identity verified! Loading platform stats...');

                // Load ICP stats immediately after login
                await loadICPStats();
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

    // ICP Ninja: Load platform statistics
    const loadICPStats = async () => {
        if (!icpIdentity.isAuthenticated) {
            toast.error('Please connect with Internet Identity first');
            return;
        }

        setIsLoadingStats(true);
        try {
            const stats = await icpIdentityService.getStats();
            setIcpStats(stats);
            toast.success('📊 Platform statistics loaded successfully!');
        } catch (error) {
            console.error('Failed to load ICP stats:', error);
            toast.error('Failed to load platform statistics');
        } finally {
            setIsLoadingStats(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-cyber-blue mr-3" />
                        <h1 className="text-4xl font-cyber font-bold text-cyber-blue">Security Dashboard</h1>
                    </div>
                    <p className="text-xl text-gray-300">Real-time threat monitoring and analytics</p>
                </motion.div>

                {/* Control Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Timeframe Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="cyber-border bg-dark-panel rounded-xl p-6"
                        style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-cyber-blue" style={{ borderBottom: '2px solid rgba(0, 245, 255, 0.3)', paddingBottom: '8px' }}>
                            ⏰ Time Range
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {timeframes.map((timeframe) => (
                                <button
                                    key={timeframe.key}
                                    onClick={() => setSelectedTimeframe(timeframe.key)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s',
                                        color: '#00f5ff',
                                        backgroundColor: selectedTimeframe === timeframe.key ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
                                        border: selectedTimeframe === timeframe.key ? '1px solid #00f5ff' : '1px solid rgba(0, 245, 255, 0.3)',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {timeframe.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Category Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="cyber-border bg-dark-panel rounded-xl p-6"
                        style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-cyber-blue" style={{ borderBottom: '2px solid rgba(0, 245, 255, 0.3)', paddingBottom: '8px' }}>
                            🎯 Category Filter
                        </h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.key}
                                    onClick={() => setSelectedCategory(category.key)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s',
                                        color: '#00f5ff',
                                        backgroundColor: selectedCategory === category.key ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
                                        border: selectedCategory === category.key ? '1px solid #00f5ff' : '1px solid rgba(0, 245, 255, 0.3)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <span>{category.icon}</span>
                                    <span>{category.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Region Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="cyber-border bg-dark-panel rounded-xl p-6"
                        style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-cyber-blue" style={{ borderBottom: '2px solid rgba(0, 245, 255, 0.3)', paddingBottom: '8px' }}>
                            🌍 Region
                        </h3>
                        <div className="space-y-2">
                            {regions.map((region) => (
                                <button
                                    key={region.key}
                                    onClick={() => setSelectedRegion(region.key)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s',
                                        color: '#00f5ff',
                                        backgroundColor: selectedRegion === region.key ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
                                        border: selectedRegion === region.key ? '1px solid #00f5ff' : '1px solid rgba(0, 245, 255, 0.3)',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {region.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="cyber-border bg-dark-panel rounded-xl p-6"
                                style={{ boxShadow: '0 0 15px rgba(0, 245, 255, 0.1)' }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                    <span className="text-green-400 text-sm font-bold">{stat.change}</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.title}</div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* ICP Ninja: Platform Statistics Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 p-6 bg-gradient-to-r from-cyber-blue/10 to-cyber-green/10 rounded-xl border border-cyber-blue/30"
                >
                    <h3 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        ICP Platform Analytics
                    </h3>

                    {icpIdentity.isAuthenticated ? (
                        <div className="space-y-4">
                            {/* Connected Status */}
                            <div className="p-4 bg-cyber-green/10 rounded-lg border border-cyber-green/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse"></div>
                                        <span className="text-cyber-green font-medium">Connected to ICP Network</span>
                                    </div>
                                    <button
                                        onClick={loadICPStats}
                                        disabled={isLoadingStats}
                                        className="px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue/50 text-cyber-blue font-medium rounded transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {isLoadingStats ? '🔄 Loading...' : '📊 Refresh Stats'}
                                    </button>
                                </div>
                                <div className="text-xs text-gray-300 mt-2">
                                    Principal: {icpIdentity.principal?.substring(0, 12)}...
                                </div>
                            </div>

                            {/* ICP Statistics */}
                            {icpStats ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-dark-bg/50 rounded-lg border border-gray-600">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-cyber-green">
                                                {icpStats.total_users || 0}
                                            </div>
                                            <div className="text-sm text-gray-400">Total Users</div>
                                            <div className="text-xs text-cyber-green mt-1">On ICP Platform</div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-dark-bg/50 rounded-lg border border-gray-600">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-cyber-blue">
                                                {icpStats.high_trust_users || 0}
                                            </div>
                                            <div className="text-sm text-gray-400">High Trust Users</div>
                                            <div className="text-xs text-cyber-blue mt-1">Trust Score 80+</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400">
                                    <div className="text-sm mb-2">📊 No statistics loaded</div>
                                    <div className="text-xs">Click "Refresh Stats" to load platform data</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-gray-300 mb-4">
                                Connect with Internet Identity to view platform analytics
                            </div>
                            <button
                                onClick={handleICPLogin}
                                disabled={icpIdentity.isLoading}
                                className="px-6 py-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue/50 text-cyber-blue font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {icpIdentity.isLoading ? 'Connecting...' : '🔐 Connect ICP Identity'}
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Main Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Threat Timeline */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 cyber-border bg-dark-panel rounded-xl p-6"
                        style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-cyber-blue">
                            📊 Threat Activity - {selectedTimeframe} ({selectedCategory} - {selectedRegion})
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={threatData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="time" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #00f5ff',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line type="monotone" dataKey="threats" stroke="#ff6b35" strokeWidth={3} />
                                <Line type="monotone" dataKey="blocked" stroke="#39ff14" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Threat Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="cyber-border bg-dark-panel rounded-xl p-6"
                        style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-cyber-blue">🥧 Threat Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #00f5ff',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {categoryData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-gray-300 text-sm">{item.name}</span>
                                    </div>
                                    <span className="text-white font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Live Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 cyber-border bg-dark-panel rounded-xl p-6"
                    style={{ boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)' }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-cyber-blue">🔴 Live Activity Feed</h3>
                        <div className="flex items-center space-x-2 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">Live</span>
                        </div>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {[
                            { time: '14:32:15', event: 'Phishing attempt blocked', severity: 'high', ip: '192.168.1.100' },
                            { time: '14:31:42', event: 'Malware signature detected', severity: 'critical', ip: '10.0.0.25' },
                            { time: '14:30:18', event: 'Suspicious login attempt', severity: 'medium', ip: '172.16.0.5' },
                            { time: '14:29:55', event: 'DDoS attack mitigated', severity: 'high', ip: '203.0.113.0' },
                            { time: '14:28:33', event: 'Fraud transaction blocked', severity: 'critical', ip: '198.51.100.1' }
                        ].map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-400 font-mono text-sm">{activity.time}</span>
                                    <span className="text-gray-300">{activity.event}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500 font-mono text-xs">{activity.ip}</span>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${activity.severity === 'critical'
                                            ? 'bg-red-400/20 text-red-400'
                                            : activity.severity === 'high'
                                                ? 'bg-orange-400/20 text-orange-400'
                                                : 'bg-yellow-400/20 text-yellow-400'
                                            }`}
                                    >
                                        {activity.severity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;