// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "../core/MEPLToken.sol";

contract MemeVaultGovernor is Governor, GovernorVotes {
    constructor(MEPLToken _meplToken)
        Governor("MemeVaultGovernor")
        GovernorVotes(_meplToken)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 1 days;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 7 days;
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 1_000_000 * 1e18; // 1M $MEPL
    }

    function proposeMemecoinChange(address newMemecoin, address oldMemecoin) external {
        // Add logic to update MemeVaultPool.memecoins
    }
}