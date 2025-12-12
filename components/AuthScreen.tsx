import React, { useState } from 'react';
import { Github, PieChart } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth network request
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients/Elements */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl"></div>
        </div>

      <div className="w-full max-w-[360px] flex flex-col items-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
           <div className="w-12 h-12 text-white flex items-center justify-center">
             {/* Custom Logo Shape approximating the screenshot */}
             <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="4" strokeOpacity="0.2"/>
                <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="8" fill="white" fillOpacity="0.5"/>
             </svg>
           </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">Start Updated</h1>
        <p className="text-[#888] text-sm mb-8 text-center">Turn Git commits into release notes</p>

        {/* Social Buttons */}
        <div className="w-full space-y-3 mb-6 relative">
             <button 
                onClick={onLogin}
                className="w-full bg-[#0F0F0F] border border-[#222] hover:bg-[#1A1A1A] hover:border-[#333] text-white py-2.5 rounded-lg flex items-center justify-center gap-3 text-sm font-medium transition-all group relative"
            >
                <Github size={18} />
                Continue with GitHub
                <span className="absolute -top-2.5 right-2 bg-[#1A1A1A] text-[#888] text-[10px] px-2 py-0.5 rounded border border-[#333] shadow-sm">Last used</span>
            </button>
            <button 
                onClick={onLogin}
                className="w-full bg-[#0F0F0F] border border-[#222] hover:bg-[#1A1A1A] hover:border-[#333] text-white py-2.5 rounded-lg flex items-center justify-center gap-3 text-sm font-medium transition-all"
            >
                <GoogleIcon />
                Continue with Google
            </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-[1px] bg-[#222] flex-1"></div>
            <span className="text-[#444] text-xs">or</span>
            <div className="h-[1px] bg-[#222] flex-1"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888] ml-1">Email address</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-3 py-2.5 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#555] focus:bg-[#222] transition-all"
                />
            </div>
            
            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-[#E0E0E0] text-black font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors mt-2"
            >
                {loading ? 'Processing...' : (
                    <span className="flex items-center gap-1">
                        Continue 
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 1L9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                )}
            </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex gap-6 text-[10px] text-[#444] font-medium uppercase tracking-wider">
            <button className="hover:text-[#888] transition-colors">Privacy</button>
            <button className="hover:text-[#888] transition-colors">Terms</button>
        </div>
      </div>
    </div>
  );
};