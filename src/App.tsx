import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import HackathonBanner from './components/HackathonBanner.tsx';
import Home from './pages/Home.tsx';
import DatingSafety from './pages/DatingSafety.tsx';
import AIAssistant from './pages/AIAssistant.tsx';
import BlockchainVerification from './pages/BlockchainVerification.tsx';
import ThreatIntelligence from './pages/ThreatIntelligence.tsx';
import Dashboard from './pages/Dashboard.tsx';
import APIStatus from './pages/APIStatus.tsx';
import { PerformanceProvider } from './context/PerformanceContext.tsx';


const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg text-white">
            <ScrollToTop />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dating-safety" element={<DatingSafety />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/blockchain" element={<BlockchainVerification />} />
                <Route path="/threat-intel" element={<ThreatIntelligence />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/api-status" element={<APIStatus />} />
              </Routes>
            </main>
            <HackathonBanner />
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: '#00f5ff',
                  border: '1px solid #00f5ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '400px',
                },
                success: {
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: '#39ff14',
                    border: '1px solid #39ff14',
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
                  },
                  iconTheme: {
                    primary: '#39ff14',
                    secondary: '#000000',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: '#ff6b35',
                    border: '1px solid #ff6b35',
                    boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
                  },
                  iconTheme: {
                    primary: '#ff6b35',
                    secondary: '#000000',
                  },
                },
                loading: {
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: '#00f5ff',
                    border: '1px solid #00f5ff',
                    boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
                  },
                },
              }}
            />
          </div>
        </Router>
      </PerformanceProvider>
    </QueryClientProvider>
  );
}

export default App;
