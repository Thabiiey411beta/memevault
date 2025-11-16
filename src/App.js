import React, { useState, useEffect } from 'react';

function App() {
  const [burnCountdown, setBurnCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mock burn countdown (next burn in 30 days from Nov 16, 2025)
    const now = new Date('2025-11-16');
    const nextBurn = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const interval = setInterval(() => {
      const diff = nextBurn.getTime() - new Date().getTime();
      setBurnCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-meme-yellow to-meme-pink text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🚀 MemeVault</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Connect Wallet</button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16">
        <h2 className="text-5xl font-bold mb-4">Stake Memecoins on Supra</h2>
        <p className="text-xl mb-8">Aggregate DOGE, SHIB, PEPE with $SUPRA. Earn stMEME + $MEPL rewards. 12% monthly burn!</p>
        <div className="bg-white p-4 rounded mx-auto w-64">
          <p>Next Burn: {burnCountdown.days}d {burnCountdown.hours}h {burnCountdown.minutes}m</p>
          <p className="text-sm">Status: Active (Stops in 2 years)</p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">Protocol Overview</h3>
        <p>MemeVault aggregates staking for memecoins in a weighted pool on Supra blockchain. Objectives: Sustainability, Profitability, Engagement, Innovation.</p>
      </section>

      {/* Mechanics */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">Mechanics</h3>
        <ul className="space-y-2">
          <li>• Liquidity Pool: Deposit $SUPRA + memecoins → stMEME</li>
          <li>• Staking: Stake stMEME/$SUPRA for fees + $MEPL</li>
          <li>• $MEPL: 2B supply, 12% burn/month for 2 years → ~47M circulating</li>
          <li>• AutoFi: Rebalance, fees, yields, missions</li>
          <li>• Governance: Vote on memecoins with $MEPL</li>
        </ul>
      </section>

      {/* Tokenomics */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">Tokenomics</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead><tr><th className="border p-2">Allocation</th><th className="border p-2">Amount</th></tr></thead>
          <tbody>
            <tr><td className="border p-2">Liquidity Incentives</td><td className="border p-2">800M (40%)</td></tr>
            <tr><td className="border p-2">Treasury</td><td className="border p-2">600M (30%)</td></tr>
            <tr><td className="border p-2">Team</td><td className="border p-2">400M (20%)</td></tr>
            <tr><td className="border p-2">Community</td><td className="border p-2">200M (10%)</td></tr>
          </tbody>
        </table>
        <p className="mt-4">Burn Impact: Reduces circulating supply by ~95%.</p>
      </section>

      {/* Profitability */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-4">Profitability ($10K Stake)</h3>
        <ul className="space-y-2">
          <li>• LPs: $210-500/year + airdrops</li>
          <li>• Stakers: $220-320/year</li>
          <li>• Treasury: $109K/year</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="bg-white p-4 text-center">
        <p>&copy; 2025 MemeVault. Built on Supra. Follow @Newton_crypt on X.</p>
      </footer>

      {/* Modal for Wallet Connect (Demo) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded">
            <h3>Wallet Connected (Demo)</h3>
            <p>StarKey Wallet: Connected! Ready to stake memecoins.</p>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;