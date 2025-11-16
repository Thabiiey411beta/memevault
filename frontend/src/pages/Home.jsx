import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function Home() {
  const [tvl, setTvl] = useState(0);
  const [burnStatus, setBurnStatus] = useState({ supply: 0, nextBurn: 0, burnActive: true });

  useEffect(() => {
    const fetchData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const poolContract = new ethers.Contract(
        contractConfig.pool.address,
        contractConfig.pool.abi,
        provider
      );
      const meplContract = new ethers.Contract(
        contractConfig.mepl.address,
        contractConfig.mepl.abi,
        provider
      );

      const totalLiquidity = await poolContract.totalLiquidity();
      setTvl(ethers.utils.formatEther(totalLiquidity));

      const supply = await meplContract.totalSupply();
      const lastBurn = await meplContract.lastBurnTimestamp();
      const deployment = await meplContract.deploymentTimestamp();
      const burnActive = (await provider.getBlock("latest")).timestamp <= deployment + (2 * 365 * 24 * 60 * 60);
      setBurnStatus({
        supply: ethers.utils.formatEther(supply),
        nextBurn: lastBurn + 30 * 24 * 60 * 60,
        burnActive
      });
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Welcome to MemeVault</h2>
      <p>Total Value Locked: ${tvl}</p>
      <h3>$MEPL Token</h3>
      <p>Current Supply: {burnStatus.supply} $MEPL</p>
      <p>Next Burn: {burnStatus.burnActive ? new Date(burnStatus.nextBurn * 1000).toLocaleString() : "Burn Ended"}</p>
      <p>Burn Active: {burnStatus.burnActive ? "Yes" : "No"}</p>
    </div>
  );
}

export default Home;