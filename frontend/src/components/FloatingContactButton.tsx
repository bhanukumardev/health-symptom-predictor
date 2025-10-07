import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingContactButton({ profileOpen = false }: { profileOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  // Responsive position: bottom-center for mobile, right for desktop
  if (profileOpen) return null;
  return (
    <div
      className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0 md:bottom-10 md:left-auto md:right-10 md:translate-x-0 flex flex-col items-center gap-2"
      style={{ pointerEvents: profileOpen ? 'none' : 'auto' }}
    >
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto mb-2 space-y-2 animate-in slide-in-from-bottom-4">
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
        </div>
      )}
      <button
        className="bg-cyan-600 text-white rounded-full p-4 shadow-lg hover:bg-cyan-700 transition-all w-16 h-16 flex items-center justify-center"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        {isOpen ? (
          <X className="w-10 h-10 text-white" />
        ) : (
          <MessageCircle className="w-10 h-10 text-white" />
        )}
      </button>
    </div>
  );
}