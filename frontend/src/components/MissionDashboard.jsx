import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";
import axios from "axios";

function MissionDashboard() {
  const [missions, setMissions] = useState([]);
  const [sentimentBoosts, setSentimentBoosts] = useState({});
  const [burnStatus, setBurnStatus] = useState({ supply: 0, nextBurn: 0, burnActive: true });

  useEffect(() => {
    const fetchMissions = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const missionContract = new ethers.Contract(
        contractConfig.missions.address,
        contractConfig.missions.abi,
        provider
      );
      const progress = await missionContract.missionProgress(await provider.getSigner().getAddress());
      setMissions([{ name: "Stake $1000 for 30 Days", progress }]);
    };

    const fetchSentiment = async () => {
      const response = await axios.get("https://api.supra.com/sentiment?tokens=DOGE,SHIB,PEPE");
      setSentimentBoosts(response.data);
    };

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

    fetchMissions();
    fetchSentiment();
    fetchBurnStatus();
  }, []);

  return (
    <div className="card p-3">
      <h3>Gamified Missions</h3>
      {missions.map((mission, index) => (
        <p key={index}>{mission.name}: {mission.progress}/30 days</p>
      ))}
      <h3>Social Sentiment Boosts</h3>
      {Object.entries(sentimentBoosts).map(([token, boost]) => (
        <p key={token}>{token}: {boost}x Reward Multiplier</p>
      ))}
      <h3>$MEPL Burn Status</h3>
      <p>Current Supply: {burnStatus.supply} $MEPL</p>
      <p>Next Burn: {burnStatus.burnActive ? new Date(burnStatus.nextBurn * 1000).toLocaleString() : "Burn Ended"}</p>
      <p>Burn Active: {burnStatus.burnActive ? "Yes" : "No"}</p>
    </div>
  );
}

export default MissionDashboard;