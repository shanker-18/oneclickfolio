import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaUser, FaEnvelope, FaRocket, FaMagic, FaStar, FaArrowRight, FaShieldAlt, FaBolt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form submitted with:', { email, name });

    if (!email || !name) {
      alert('Please fill in both email and name');
      return;
    }

    console.log('Starting login process...');
    setLoading(true);

    try {
      const result = await login(email, name);
      console.log('Login result:', result);
      
      if (!result.success) {
        console.error('Login failed:', result.error);
        setLoading(false);
      } else {
        console.log('Login successful!');
        setShowSuccess(true);
        
        // Show success animation for a moment
        setTimeout(() => {
          setLoading(false);
          console.log('Navigating to dashboard...');
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 min-h-screen">
        {/* Left: branding/benefits */}
        <div className="hidden lg:flex flex-col justify-center gap-8 px-12">
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-neutral-400 uppercase tracking-wide">
              <FaMagic />
              Welcome
            </div>
            <h1 className="mt-4 text-5xl font-extrabold text-white leading-tight">
              OneClick<span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Folio</span>
            </h1>
            <p className="mt-4 text-neutral-300 text-lg max-w-xl">
              Turn your resume into a polished portfolio with AI extraction and beautiful templates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3">
              <div className="size-9 rounded-lg bg-neutral-800 inline-flex items-center justify-center text-neutral-100">
                <FaBolt />
              </div>
              <div>
                <div className="text-white font-medium">AI-Powered</div>
                <div className="text-neutral-400 text-sm">Instant extraction</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3">
              <div className="size-9 rounded-lg bg-neutral-800 inline-flex items-center justify-center text-neutral-100">
                <FaStar />
              </div>
              <div>
                <div className="text-white font-medium">Beautiful templates</div>
                <div className="text-neutral-400 text-sm">Professional design</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3">
              <div className="size-9 rounded-lg bg-neutral-800 inline-flex items-center justify-center text-neutral-100">
                <FaShieldAlt />
              </div>
              <div>
                <div className="text-white font-medium">Secure</div>
                <div className="text-neutral-400 text-sm">Your data protected</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3">
              <div className="size-9 rounded-lg bg-neutral-800 inline-flex items-center justify-center text-neutral-100">
                <FaRocket />
              </div>
              <div>
                <div className="text-white font-medium">One‑click deploy</div>
                <div className="text-neutral-400 text-sm">Publish instantly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 shadow-2xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 size-14 rounded-xl bg-neutral-800 inline-flex items-center justify-center text-white">
                    <FaRocket />
                  </div>
                  <h2 className="text-white text-2xl font-semibold">
                    {showSuccess ? 'Welcome aboard' : 'Sign in to continue'}
                  </h2>
                  {!showSuccess && (
                    <p className="text-neutral-400 mt-1 text-sm">No account needed — we create it for you.</p>
                  )}
                </div>

                {showSuccess ? (
                  <div className="text-center py-10">
                    <div className="mx-auto size-16 rounded-full bg-emerald-500 inline-flex items-center justify-center text-white animate-pulse">
                      <FaRocket />
                    </div>
                    <p className="mt-4 text-white">Redirecting to your dashboard…</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm text-neutral-300 mb-2">Full name</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-neutral-300 mb-2">Email address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 text-white placeholder-neutral-500 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{error}</div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-500 text-white font-semibold py-3 shadow-lg hover:opacity-95 transition disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <span className="size-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></span>
                          Signing in…
                        </>
                      ) : (
                        <>
                          Sign In / Sign Up
                          <FaArrowRight />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-neutral-500">By continuing, you agree to our terms.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
