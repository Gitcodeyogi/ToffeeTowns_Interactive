import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';
import GlassButton from './GlassButton';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { loginWithEmail, registerWithEmail, authLoading } = useTTStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isRegistering) {
        if (!displayName.trim()) {
          setErrorMsg('Hero Name is required for registration.');
          return;
        }
        await registerWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error('Auth error:', error);
      const err = error as { message?: string };
      setErrorMsg(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      {/* 92vw x 96vh Glassmorphism Container (Zero Blur) */}
      <div
        className="relative z-10 w-[92vw] h-[96vh] max-h-[96vh] rounded-[2.5rem] border-2 border-white/35 bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col lg:flex-row"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
        {/* Left Side: Brand Narrative */}
        <div className="lg:w-1/2 p-6 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/15 bg-black/40 flex flex-col justify-center gap-6">
          <div>
            {/* Heading Above in Luckiest Guy Gradient */}
            <p
              className="uppercase tracking-wider text-xs md:text-sm mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 font-brand"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              The Imperial Province of ChocoBrook
            </p>
            
            <h1
              className="leading-[0.9] uppercase tracking-tight"
              style={{ fontFamily: '"Luckiest Guy", cursive', fontSize: 'clamp(2.1rem, 5.6vw, 4.6rem)' }}
            >
              <span className="text-emerald-400">Welcome to</span>
              <br />
              <span className="text-yellow-300 font-brand">Toffee Towns</span>
            </h1>
            
            {/* Subheadings Below in Luckiest Guy */}
            <div className="mt-4 space-y-1 font-brand uppercase tracking-wider" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              <p className="text-white/60 text-xs md:text-sm">
                Chocolate Era • Confection Year Cycle
              </p>
              <p className="text-cyan-300 text-xs md:text-sm mt-1">
                16 towns, 4 counties, 1 Capital, 1 Province
              </p>
            </div>
          </div>

          <div className="border-l-2 border-white/20 pl-5 py-1 flex flex-col gap-4 font-body">
            <p className="text-white/90 text-[1.05rem] leading-relaxed max-w-[680px]">
              Step into a <span className="text-cyan-300 font-semibold">cozy fantasy province</span> where players become residents, build their legacy, and <span className="text-cyan-300 font-semibold">be part of the town stories</span>. Journey through delightful <span className="text-pink-300 font-semibold">confectionery towns</span>, interact with <span className="text-pink-300 font-semibold">lovely, unforgettable characters</span>, and unlock rich, story-driven rewards.
            </p>
            <p className="text-white/90 text-[1.05rem] leading-relaxed max-w-[680px]">
              Support vital <span className="text-orange-300 font-semibold">community projects</span>, gather unique stamps in your passport, and earn prestigious badges. <span className="text-orange-300 font-semibold">Earn XP, unlock achievements, and compete to top the global leaderboard</span>. The choices you make today shape the province and define your <span className="text-yellow-300 font-semibold">lasting deeds</span>.
            </p>
          </div>

          {/* Motto Section */}
          <div 
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 font-brand italic tracking-wider text-[13px] md:text-[15px] lg:text-[16px] mt-2 whitespace-nowrap overflow-hidden text-ellipsis text-center"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Choose a home, Become a resident, Build a legacy, Be remembered.
          </div>
        </div>

        {/* Right Side: Login/Register Form */}
        <div className="lg:w-1/2 p-6 md:p-10 lg:p-12 bg-black/40 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6 text-center">
              {/* SPARROWX Studios Presents */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-white/10 bg-black/60 shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                  <span className="text-[14px] uppercase tracking-wider text-white font-brand" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    Sparrow<span className="text-emerald-400 text-[16px] font-black mx-0.5">X</span> Studios Presents
                  </span>
                </div>
              </div>

              {/* Toffee Towns Title */}
              <h1 
                className="text-4xl md:text-5xl font-black text-yellow-300 mb-3 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: '"Luckiest Guy", cursive' }}
              >
                Toffee Towns
              </h1>

              <h2
                className="uppercase tracking-wider text-emerald-300 leading-none font-brand text-2xl md:text-3xl"
                style={{ fontFamily: '"Luckiest Guy", cursive' }}
              >
                {isRegistering ? 'TRAVELLER REGISTER' : 'TRAVELLER LOGIN'}
              </h2>
            </div>

            {errorMsg && (
              <div className="mb-4 text-center text-xs text-red-400 bg-red-950/40 border border-red-500/20 py-2 rounded-lg font-body">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 font-body">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="block w-[70%] mx-auto text-[10px] uppercase tracking-[0.25em] font-black text-white/70">
                    Hero Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-[70%] mx-auto block h-14 px-4 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/55 outline-none focus:border-emerald-400/60"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    placeholder="Captain Giggles"
                    required={isRegistering}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block w-[70%] mx-auto text-[10px] uppercase tracking-[0.25em] font-black text-white/70">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[70%] mx-auto block h-14 px-4 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/55 outline-none focus:border-blue-400/60"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  placeholder="hero@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block w-[70%] mx-auto text-[10px] uppercase tracking-[0.25em] font-black text-white/70">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[70%] mx-auto block h-14 px-4 rounded-lg bg-black border border-white/20 text-white placeholder:text-white/55 outline-none focus:border-yellow-400/60"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  placeholder="........"
                  required
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <GlassButton
                  label={authLoading ? 'Loading...' : (isRegistering ? 'Register' : 'Enter the Town')}
                  type="submit"
                  variant="primary"
                  className="!w-[70%] !mx-auto !h-14 !min-h-14 !rounded-lg !py-0 !normal-case text-[16px] md:text-[17px] tracking-wide"
                  style={{ fontFamily: '"Luckiest Guy", cursive' }}
                  disabled={authLoading}
                />

                <GlassButton
                  label={isRegistering ? 'Already a Traveller? Login' : 'New Traveller? Register'}
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrorMsg('');
                  }}
                  className="!w-[70%] !mx-auto !h-14 !min-h-14 !rounded-lg !py-0 !normal-case text-[15px] md:text-[16px] tracking-wide"
                  style={{ fontFamily: '"Luckiest Guy", cursive' }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0 1000px #000 inset !important;
          box-shadow: 0 0 0 1000px #000 inset !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
