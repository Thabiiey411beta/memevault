// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Player } from '@lottiefiles/react-lottie-player';
import dogeJson from './assets/doge.json'; // Download from LottieFiles
import shibJson from './assets/shib.json';
import pepeJson from './assets/pepe.json';

const memeParticles = [
  { icon: '🐶', delay: 0 },
  { icon: '🐕', delay: 1.2 },
  { icon: '🦊', delay: 2.4 },
  { icon: '🐸', delay: 0.8 },
  { icon: '🚀', delay: 3.1 },
  { icon: '💸', delay: 1.8 },
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [burnTime, setBurnTime] = useState({ days: 0, hours: 0, mins: 0 });
  const [wallet, setWallet] = useState(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Burn Countdown (next burn: Dec 16, 2025)
  useEffect(() => {
    const target = new Date('2025-12-16T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff > 0) {
        setBurnTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    new Audio(theme === 'dark' ? '/sfx/doge-bark.mp3' : '/sfx/pepe-croak.mp3').play();
  };

  const connectWallet = async () => {
    if (window.ethereum || window.starKey) {
      const provider = window.ethereum || window.starKey;
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4));
    } else {
      alert('Install StarKey Wallet for Supra!');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gradient-to-br from-yellow-100 to-pink-100 text-gray-900'} overflow-x-hidden`}>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {memeParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ x: Math.random() * window.innerWidth, y: -100 }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: p.delay, ease: 'linear' }}
            style={{ left: `${Math.random() * 100}%` }}
          >
            {p.icon}
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <motion.section style={{ y }} className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-yellow-900 opacity-60 blur-3xl"></div>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
          >
            MEMEVAULT
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mt-4 font-light"
          >
            Stake <span className="font-bold text-yellow-400">DOGE</span>,{' '}
            <span className="font-bold text-red-500">SHIB</span>,{' '}
            <span className="font-bold text-green-400">PEPE</span> + $SUPRA → Earn <span className="text-purple-400">$MEPL</span>
          </motion.p>

          <div className="flex gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-2xl"
            >
              {wallet ? `🦊 ${wallet}` : 'Connect StarKey'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={toggleTheme}
              className="px-6 py-4 bg-gray-800 rounded-full"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Live Burn Countdown */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">🔥 $MEPL Monthly Burn</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {['days', 'hours', 'mins'].map((unit, i) => (
              <motion.div
                key={unit}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
              >
                <CountUp end={burnTime[unit]} duration={2} className="text-5xl font-black text-yellow-400" />
                <p className="text-sm uppercase mt-2">{unit}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-sm opacity-80">Burn stops after 2 years → ~47.5M circulating</p>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-700 py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 whitespace-nowrap text-white font-bold text-xl"
        >
          <span>🚀 TVL: $1.42M</span>
          <span>📈 APY: 42.0%</span>
          <span>🔥 Burned: 189.2M $MEPL</span>
          <span>🗳️ Governance: 892 Proposals</span>
          <span>🎮 Missions: 12,304 Completed</span>
          <span>🚀 TVL: $1.42M</span>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <h2 className="text-5xl font-black text-center mb-16">Why MemeVault Slaps</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'AutoFi Yield Harvester', desc: 'AI snipes cross-chain APY via HyperNova', icon: '🤖' },
            { title: 'Gamified Missions', desc: 'Stake $1K for 30d → 100 $MEPL + NFT', icon: '🎮' },
            { title: 'MEME-INDEX Token', desc: '1 token = entire meme basket', icon: '📊' },
          ].map((f, i) => (
            <FeatureCard key={i} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Meme Animations */}
      <section className="py-16 bg-black/50">
        <div className="flex justify-center gap-12">
          <Player autoplay loop src={dogeJson} style={{ height: 120 }} />
          <Player autoplay loop src={shibJson} style={{ height: 120 }} />
          <Player autoplay loop src={pepeJson} style={{ height: 120 }} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-5xl font-black mb-6"
        >
          Ready to Vault In?
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="px-12 py-6 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full text-black font-bold text-xl shadow-xl"
        >
          Launch DApp 🚀
        </motion.button>
        <p className="mt-6 text-sm opacity-70">@Newton_crypt • Supra Blockchain • ZA</p>
      </section>
    </div>
  );
}

// Tilt Card Component
function FeatureCard({ title, desc, icon, index }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const tilt = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.05, rotate: tilt }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl cursor-pointer"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-80">{desc}</p>
    </motion.div>
  );
}