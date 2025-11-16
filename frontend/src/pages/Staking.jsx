import StakingForm from "../components/StakingForm";
import MissionDashboard from "../components/MissionDashboard";

function Staking() {
  return (
    <div className="container mt-4">
      <h2>Staking</h2>
      <StakingForm />
      <MissionDashboard />
    </div>
  );
}

export default Staking;