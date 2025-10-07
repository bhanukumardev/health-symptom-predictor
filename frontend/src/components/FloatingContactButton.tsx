import React, { useState } from 'react';
import { MessageCircle, X, Mail, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 space-y-2 animate-in slide-in-from-bottom-4">
          <Link
            to="/developer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 transition-all duration-200 min-w-[200px]"
          >
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <div className="text-left">
              <div className="font-medium text-sm">Contact Developer</div>
              <div className="text-xs text-slate-400">Send a message</div>
            </div>
          </Link>
          
          <a
            href="mailto:kumarbhanu818@gmail.com"
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 transition-all duration-200 min-w-[200px]"
          >
            <Mail className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <div className="font-medium text-sm">Quick Email</div>
              <div className="text-xs text-slate-400">kumarbhanu818@gmail.com</div>
            </div>
          </a>
          
          <a
            href="https://github.com/bhanukumardev/health-symptom-predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 transition-all duration-200 min-w-[200px]"
          >
            <Github className="w-5 h-5 text-purple-400" />
            <div className="text-left">
              <div className="font-medium text-sm">View Source</div>
              <div className="text-xs text-slate-400">GitHub Repository</div>
            </div>
          </a>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-90' 
            : 'bg-cyan-600 hover:bg-cyan-700 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}