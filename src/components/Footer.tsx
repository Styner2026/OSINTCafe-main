import { Shield, Github, Twitter, Mail } from 'lucide-react';
import ScrollToTopButton from './ScrollToTopButton';

export default function Footer() {
  return (
    <footer className="bg-dark-panel border-t border-cyber-blue/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-cyber-blue" />
              <span className="text-xl font-cyber font-bold text-white">OSINT Café</span>
            </div>
            <p className="text-gray-400 text-base max-w-md">
              AI-powered cybersecurity investigation and digital verification platform.
              Stay safe online with comprehensive threat intelligence and verification tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-base">
              <li><a href="/dating-safety" className="text-gray-400 hover:text-cyber-blue transition-colors">Dating Safety</a></li>
              <li><a href="/ai-assistant" className="text-gray-400 hover:text-cyber-blue transition-colors">AI Assistant</a></li>
              <li><a href="/blockchain" className="text-gray-400 hover:text-cyber-blue transition-colors">Blockchain Verification</a></li>
              <li><a href="/threat-intel" className="text-gray-400 hover:text-cyber-blue transition-colors">Threat Intelligence</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyber-blue transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex justify-between items-center">
          {/* Scroll to Top Button - Left Side */}
          <div className="flex items-center ml-8">
            <ScrollToTopButton />
          </div>

          <p className="text-gray-400 text-base flex-1 text-center">
            © 2024 OSINT Café. Built with ❤️ for digital safety and cybersecurity.
          </p>

          {/* Empty div for balance */}
          <div className="w-12"></div>
        </div>
      </div>
    </footer>
  );
}