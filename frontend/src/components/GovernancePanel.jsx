import { useState } from "react";
import { ethers } from "ethers";
import { contractConfig } from "../contracts/contractConfig";

function GovernancePanel() {
  const [newMemecoin, setNewMemecoin] = useState("");
  const [oldMemecoin, setOldMemecoin] = useState("");
  const [error, setError] = useState("");

  const proposeMemecoin = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const governorContract = new ethers.Contract(
        contractConfig.governor.address,
        contractConfig.governor.abi,
        signer
      );

      await governorContract.proposeMemecoinChange(newMemecoin, oldMemecoin);
      alert("Proposal submitted!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-3">
      <h3>Propose Memecoin Change</h3>
      <input
        type="text"
        placeholder="New Memecoin Address"
        value={newMemecoin}
        onChange={(e) => setNewMemecoin(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="text"
        placeholder="Old Memecoin Address"
        value={oldMemecoin}
        onChange={(e) => setOldMemecoin(e.target.value)}
        className="form-control mb-2"
      />
      <button onClick={proposeMemecoin} className="btn btn-primary">Propose</button>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default GovernancePanel;