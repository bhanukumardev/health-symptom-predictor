import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

export default function Developer() {
  return (
    <div className="min-h-screen bg-[#101528] px-4 py-10 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-3 text-center">Meet the Developer</h1>
      <p className="mb-12 text-lg md:text-xl text-gray-300 text-center max-w-2xl">
        Building innovative health technology solutions with AI and machine learning
      </p>
      
      {/* Panels */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-8">
        {/* Profile Card */}
        <div className="bg-[#161b2a] rounded-2xl shadow-xl flex-1 p-8 flex flex-col items-center">
          <div className="h-32 w-32 rounded-full border-4 border-cyan-400 flex items-center justify-center mb-6 bg-gradient-to-br from-cyan-500 to-blue-600">
            <div className="text-6xl animate-pulse">
              👨‍💻
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-cyan-300 mb-1">Bhanu Kumar Dev</h2>
          <h3 className="mb-1 text-base text-cyan-200 font-medium">AI/ML Enthusiast & Full Stack Web Developer</h3>
          <div className="mb-6 text-indigo-200 italic font-medium">BTech CSSE</div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3 bg-[#20243c] px-3 py-2 rounded-lg text-cyan-200 hover:bg-[#2a2f47] transition-colors cursor-pointer">
              <FaGithub />
              <a href="https://github.com/bhanukumardev" target="_blank" rel="noopener noreferrer" className="flex-1 font-medium">
                GitHub
              </a>
            </div>
            <div className="flex items-center gap-3 bg-[#20243c] px-3 py-2 rounded-lg text-cyan-200 hover:bg-[#2a2f47] transition-colors cursor-pointer">
              <FaLinkedin />
              <a href="https://www.linkedin.com/in/bhanu-kumar-dev-97b820313/" target="_blank" rel="noopener noreferrer" className="flex-1 font-medium">
                LinkedIn
              </a>
            </div>
            <div className="flex items-center gap-3 bg-[#20243c] px-3 py-2 rounded-lg text-cyan-200 hover:bg-[#2a2f47] transition-colors cursor-pointer">
              <FaInstagram />
              <a href="https://www.instagram.com/bhumi_bhanu_dev/" target="_blank" rel="noopener noreferrer" className="flex-1 font-medium">
                Instagram
              </a>
            </div>
            <div className="flex items-center gap-3 bg-[#20243c] px-3 py-2 rounded-lg text-cyan-200 hover:bg-[#2a2f47] transition-colors cursor-pointer">
              <FaFacebook />
              <a href="https://www.facebook.com/profile.php?id=100076607474743" target="_blank" rel="noopener noreferrer" className="flex-1 font-medium">
                Facebook
              </a>
            </div>
            <div className="flex items-center gap-3 bg-[#20243c] px-3 py-2 rounded-lg text-cyan-200 hover:bg-[#2a2f47] transition-colors cursor-pointer">
              <span className="font-semibold">📄</span>
              <a href="https://github.com/bhanukumardev/health-symptom-predictor" target="_blank" rel="noopener noreferrer" className="flex-1 font-medium">
                Documentation <FaExternalLinkAlt className="inline ml-1 text-sm" />
              </a>
            </div>
            
            {/* Highlighted Portfolio Button */}
            <div className="mt-4">
              <a 
                href="https://bhanukumardev.github.io/bhanu-portfolio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-4 py-3 rounded-lg text-white font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-xl">🌐</span>
                <span>View Full Portfolio</span>
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="w-full md:w-1/2 bg-[#161b2a] rounded-2xl shadow-xl p-8 flex flex-col">
          <h2 className="text-xl font-bold text-cyan-100 mb-2 flex items-center gap-2">
            Get In Touch
          </h2>
          <p className="text-gray-300 mb-6">Have questions about the app, want to collaborate, or need technical support? Send me a message and I'll get back to you soon!</p>
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="access_key" value="e3401362-a55c-4dc6-a2c7-b40aa6becf58" />
            <input type="text" name="name" required placeholder="Your Name" className="bg-[#222741] p-3 rounded-lg text-white focus:outline-none" />
            <input type="email" name="email" required placeholder="Email Address" className="bg-[#222741] p-3 rounded-lg text-white focus:outline-none" />
            <input type="text" name="subject" placeholder="Subject" className="bg-[#222741] p-3 rounded-lg text-white focus:outline-none" />
            <textarea name="message" required rows={5} placeholder="What's on your mind?" className="bg-[#222741] p-3 rounded-lg text-white focus:outline-none"></textarea>
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-lg mt-2 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 w-full max-w-5xl bg-[#161b2a] rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">About This Project</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="text-center">
            <h4 className="font-semibold text-cyan-300 mb-3 text-lg">🚀 Technology Stack</h4>
            <p className="text-gray-300">
              Built with React, TypeScript, FastAPI, PostgreSQL, and AI/ML models for accurate health predictions.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-cyan-300 mb-3 text-lg">🎯 Mission</h4>
            <p className="text-gray-300">
              Making healthcare more accessible through AI-powered symptom analysis and personalized health insights.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-cyan-300 mb-3 text-lg">📈 Future Plans</h4>
            <p className="text-gray-300">
              Expanding with more ML models, telemedicine integration, and comprehensive health tracking features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}