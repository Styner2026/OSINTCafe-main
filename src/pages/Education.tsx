import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Play, BookOpen, Headphones, Clock, Star, ChevronRight } from 'lucide-react';

const Education = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const categories = [
        { key: 'all', label: 'All Topics' },
        { key: 'dating-safety', label: 'Dating Safety' },
        { key: 'phishing', label: 'Phishing Protection' },
        { key: 'social-engineering', label: 'Social Engineering' },
        { key: 'blockchain', label: 'Blockchain Security' },
        { key: 'privacy', label: 'Digital Privacy' }
    ];

    const difficulties = [
        { key: 'all', label: 'All Levels' },
        { key: 'beginner', label: 'Beginner' },
        { key: 'intermediate', label: 'Intermediate' },
        { key: 'advanced', label: 'Advanced' }
    ];

    const educationContent = [
        {
            id: '1',
            title: 'Spotting Romance Scams: Red Flags to Watch For',
            description: 'Learn the warning signs of romance scams and how to protect yourself while dating online.',
            type: 'video',
            difficulty: 'beginner',
            duration: 15,
            category: 'dating-safety',
            rating: 4.8,
            thumbnail: '💕'
        },
        {
            id: '2',
            title: 'Phishing Emails: A Complete Defense Guide',
            description: 'Master the art of identifying and avoiding phishing attacks through email.',
            type: 'interactive',
            difficulty: 'intermediate',
            duration: 25,
            category: 'phishing',
            rating: 4.9,
            thumbnail: '📧'
        },
        {
            id: '3',
            title: 'Blockchain Verification Fundamentals',
            description: 'Understanding how blockchain technology can verify digital identities.',
            type: 'article',
            difficulty: 'intermediate',
            duration: 20,
            category: 'blockchain',
            rating: 4.7,
            thumbnail: '⛓️'
        },
        {
            id: '4',
            title: 'Social Engineering Psychology',
            description: 'Deep dive into the psychological tactics used by cybercriminals.',
            type: 'audio',
            difficulty: 'advanced',
            duration: 45,
            category: 'social-engineering',
            rating: 4.9,
            thumbnail: '🧠'
        },
        {
            id: '5',
            title: 'Digital Privacy Essentials',
            description: 'Practical steps to protect your personal information online.',
            type: 'video',
            difficulty: 'beginner',
            duration: 18,
            category: 'privacy',
            rating: 4.6,
            thumbnail: '🔒'
        },
        {
            id: '6',
            title: 'Advanced Threat Detection',
            description: 'Learn to identify sophisticated cyber threats and attack patterns.',
            type: 'interactive',
            difficulty: 'advanced',
            duration: 60,
            category: 'phishing',
            rating: 4.8,
            thumbnail: '🔍'
        }
    ];

    const filteredContent = educationContent.filter(content => {
        const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || content.difficulty === selectedDifficulty;
        return matchesCategory && matchesDifficulty;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Play className="w-4 h-4" />;
            case 'article': return <BookOpen className="w-4 h-4" />;
            case 'audio': return <Headphones className="w-4 h-4" />;
            case 'interactive': return <GraduationCap className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'text-red-400';
            case 'article': return 'text-blue-400';
            case 'audio': return 'text-green-400';
            case 'interactive': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-400/20';
            case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
            case 'advanced': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-cyber-blue mr-3" />
                        <h1 className="text-4xl font-cyber font-bold text-cyber-blue">Safety Education</h1>
                    </div>
                    <p className="text-xl text-gray-300">
                        Interactive cybersecurity training and educational resources
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Categories */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="cyber-border bg-dark-panel rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-4 text-cyber-blue">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.key}
                                        onClick={() => setSelectedCategory(category.key)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.key
                                                ? 'bg-cyber-blue/20 text-cyber-blue'
                                                : 'text-gray-400 hover:text-white hover:bg-dark-bg/50'
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Difficulty */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="cyber-border bg-dark-panel rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-4 text-cyber-blue">Difficulty</h3>
                            <div className="space-y-2">
                                {difficulties.map((difficulty) => (
                                    <button
                                        key={difficulty.key}
                                        onClick={() => setSelectedDifficulty(difficulty.key)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedDifficulty === difficulty.key
                                                ? 'bg-cyber-blue/20 text-cyber-blue'
                                                : 'text-gray-400 hover:text-white hover:bg-dark-bg/50'
                                            }`}
                                    >
                                        {difficulty.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="cyber-border bg-dark-panel rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-4 text-cyber-blue">Your Progress</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Completed</span>
                                        <span className="text-sm text-cyber-blue">12/20</span>
                                    </div>
                                    <div className="w-full bg-dark-bg rounded-full h-2">
                                        <div className="bg-gradient-to-r from-cyber-blue to-cyber-green h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Learning Streak</span>
                                        <span className="text-sm text-cyber-green">7 days</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Total Hours</span>
                                        <span className="text-sm text-cyber-blue">24.5h</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredContent.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="cyber-border bg-dark-panel rounded-xl overflow-hidden hover:bg-dark-panel/80 transition-all duration-300 group cursor-pointer"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-green/20 flex items-center justify-center">
                                        <span className="text-6xl">{content.thumbnail}</span>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 bg-cyber-blue rounded-full flex items-center justify-center">
                                                {getTypeIcon(content.type)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`flex items-center space-x-1 ${getTypeColor(content.type)}`}>
                                                {getTypeIcon(content.type)}
                                                <span className="text-xs font-medium uppercase">{content.type}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(content.difficulty)}`}>
                                                {content.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-blue transition-colors">
                                            {content.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {content.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{content.duration} min</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                    <span>{content.rating}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 group-hover:text-cyber-blue group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Featured Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 cyber-border bg-gradient-to-r from-dark-panel/80 to-dark-panel/40 rounded-xl p-8 text-center"
                        >
                            <h2 className="text-3xl font-cyber font-bold mb-4 text-cyber-blue">
                                Master Cybersecurity Skills
                            </h2>
                            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                                Complete interactive courses, earn certificates, and become a cybersecurity expert.
                                Join thousands of learners protecting themselves and others online.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-green text-dark-bg font-bold rounded-lg hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300">
                                    Start Learning Path
                                </button>
                                <button className="px-8 py-4 cyber-border bg-transparent text-cyber-blue font-bold rounded-lg hover:bg-cyber-blue/10 transition-all duration-300">
                                    View Certificates
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Education;
