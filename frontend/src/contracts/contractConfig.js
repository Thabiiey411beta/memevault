import MemeVaultPoolABI from "./abi/MemeVaultPool.json";
import StakingVaultABI from "./abi/StakingVault.json";
import MEPLTokenABI from "./abi/MEPLToken.json";
import MemeIndexTokenABI from "./abi/MemeIndexToken.json";
import MemeVaultGovernorABI from "./abi/MemeVaultGovernor.json";

export const contractConfig = {
  pool: { address: process.env.REACT_APP_POOL_ADDRESS, abi: MemeVaultPoolABI },
  staking: { address: process.env.REACT_APP_STAKING_ADDRESS, abi: StakingVaultABI },
  mepl: { address: process.env.REACT_APP_MEPL_ADDRESS, abi: MEPLTokenABI },
  index: { address: process.env.REACT_APP_INDEX_ADDRESS, abi: MemeIndexTokenABI },
  governor: { address: process.env.REACT_APP_GOVERNOR_ADDRESS, abi: MemeVaultGovernorABI },
};