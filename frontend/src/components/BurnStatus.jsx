import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function BurnStatus() {
  const [burnStatus, setBurnStatus] = useState({ supply: 0, nextBurn: 0, burnActive: true });

  useEffect(() => {
    const fetchBurnStatus = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const meplContract = new ethers.Contract(
        contractConfig.mepl.address,
        contractConfig.mepl.abi,
        provider
      );

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

    fetchBurnStatus();
  }, []);

  return (
    <div className="card p-3">
      <h3>$MEPL Burn Status</h3>
      <p>Current Supply: {burnStatus.supply} $MEPL</p>
      <p>Next Burn: {burnStatus.burnActive ? new Date(burnStatus.nextBurn * 1000).toLocaleString() : "Burn Ended"}</p>
      <p>Burn Active: {burnStatus.burnActive ? "Yes" : "No"}</p>
    </div>
  );
}

export default BurnStatus;