export default function AIAssistant() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <div className="text-lime-400 text-sm font-medium tracking-wide uppercase">
                            OUR FEATURE
                        </div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                            Viewing long-term and short-term forecast
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                            Add funds to your cryptocurrency account to start trading cryptocurrencies. You can add funds using different payment methods.
                        </p>
                        <button className="bg-transparent border-2 border-lime-400 text-lime-400 px-8 py-3 rounded-full hover:bg-lime-400 hover:text-black transition-all duration-300 font-medium">
                            Get Started
                        </button>
                    </div>

                    {/* Right Content - Phone Mockups */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* First Phone */}
                        <div className="relative z-10 w-64 h-[500px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 p-2">
                            <div className="w-full h-full bg-black rounded-[2rem] p-4 overflow-hidden">
                                {/* Phone Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div className="text-xs text-gray-400">Welcome Back</div>
                                    <div className="flex space-x-1">
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                    </div>
                                </div>

                                {/* Portfolio Value */}
                                <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
                                    <div className="text-xs text-gray-400 mb-1">Portfolio value</div>
                                    <div className="text-xl font-bold text-white mb-2">$47,412.65</div>
                                    <div className="h-16 bg-gradient-to-r from-blue-500 to-green-400 rounded opacity-60"></div>
                                </div>

                                {/* Watchlist */}
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-400 mb-2">Watchlist</div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                                            <div className="text-sm text-white">Bitcoin</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white">47,412.65</div>
                                            <div className="text-xs text-green-400">+4.20%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                                            <div className="text-sm text-white">Ripple</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white">1.1164</div>
                                            <div className="text-xs text-red-400">-2.1%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                            <div className="text-sm text-white">Litecoin</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white">169.6</div>
                                            <div className="text-xs text-green-400">+1.2%</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-cyan-500 rounded-full"></div>
                                            <div className="text-sm text-white">Solana</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-white">119.69</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Navigation */}
                                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                                    <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                                        <div className="w-6 h-6 text-black text-xl font-bold">+</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second Phone */}
                        <div className="absolute top-16 -right-4 w-64 h-[500px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 p-2 shadow-2xl">
                            <div className="w-full h-full bg-black rounded-[2rem] p-4">
                                {/* ETH/USDT Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs text-gray-400">ETH / USDT</div>
                                    <div className="flex space-x-1">
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-2xl font-bold text-white mb-6">3,839.65</div>

                                {/* Chart Area */}
                                <div className="h-48 mb-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg"></div>
                                    <svg className="w-full h-full" viewBox="0 0 200 100">
                                        <path
                                            d="M 0 80 Q 50 60 100 50 Q 150 40 200 30"
                                            stroke="#10b981"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    </svg>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 mb-4">
                                    <button className="flex-1 bg-green-500 text-white py-2 rounded font-medium">
                                        Buy
                                    </button>
                                    <button className="flex-1 bg-red-500 text-white py-2 rounded font-medium">
                                        Sell
                                    </button>
                                </div>

                                {/* Crypto List */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                            <span>Bitcoin</span>
                                        </div>
                                        <span className="text-green-400">47,412.65</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                            <span>Ripple</span>
                                        </div>
                                        <span className="text-red-400">1.1164</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                            <span>Litecoin</span>
                                        </div>
                                        <span className="text-green-400">169.6</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Second Section */}
            <section className="container mx-auto px-6 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content - Phone and Card */}
                    <div className="relative flex justify-center lg:justify-start">
                        {/* Phone */}
                        <div className="relative z-10 w-64 h-[500px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 p-2">
                            <div className="w-full h-full bg-black rounded-[2rem] p-4">
                                {/* Same phone content as second phone above */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs text-gray-400">ETH / USDT</div>
                                    <div className="flex space-x-1">
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                        <div className="w-4 h-4 bg-gray-600 rounded"></div>
                                    </div>
                                </div>

                                <div className="text-2xl font-bold text-white mb-6">3,839.65</div>

                                <div className="h-48 mb-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg"></div>
                                    <svg className="w-full h-full" viewBox="0 0 200 100">
                                        <path
                                            d="M 0 80 Q 50 60 100 50 Q 150 40 200 30"
                                            stroke="#10b981"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                    </svg>
                                </div>

                                <div className="flex space-x-2 mb-4">
                                    <button className="flex-1 bg-green-500 text-white py-2 rounded font-medium">
                                        Buy
                                    </button>
                                    <button className="flex-1 bg-red-500 text-white py-2 rounded font-medium">
                                        Sell
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                            <span>Bitcoin</span>
                                        </div>
                                        <span className="text-green-400">47,412.65</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                            <span>Ripple</span>
                                        </div>
                                        <span className="text-red-400">1.1164</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                            <span>Litecoin</span>
                                        </div>
                                        <span className="text-green-400">169.6</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credit Card */}
                        <div className="absolute -bottom-8 -right-8 w-80 h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl p-6 border border-gray-600 shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-white font-bold text-2xl tracking-wider">VISA</div>
                                <div className="bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                                    128 points
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="text-gray-300 text-lg font-mono tracking-wider">**** **** **** 1234</div>
                                <div className="text-gray-400 text-sm">12/25</div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-white text-lg font-medium">John Doe</div>
                                <div className="w-14 h-10 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-lg flex items-center justify-center">
                                    <div className="w-8 h-6 bg-white rounded-sm opacity-90"></div>
                                </div>
                            </div>
                        </div>

                        {/* Green Circle Background */}
                        <div className="absolute -bottom-16 -right-16 w-96 h-96 border-4 border-lime-400 rounded-full opacity-20"></div>
                    </div>

                    {/* Right Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                More than you think
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                                Add funds to your cryptocurrency account to start trading cryptocurrencies. You can add funds using different payment methods.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Productivity Card */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Productivity</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Dramatically reintermediate effective applications after high-payoff core competencies.
                                </p>
                            </div>

                            {/* Synchronize Card */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Synchronize</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Dramatically reintermediate effective applications after high-payoff core competencies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Third Section */}
            <section className="container mx-auto px-6 py-16 lg:py-24 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-lime-400 text-sm font-medium tracking-wide uppercase">
                        OUR MEMBERS
                    </div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                        Get to know<br />amazing people
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                        Our mission is to be the global standard for modern crypto issuing, empowering builders to bring the most innovative products to the world.
                    </p>
                </div>
            </section>
        </div>
    );
}
