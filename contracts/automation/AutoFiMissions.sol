// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/StakingVault.sol";
import "../core/MEPLToken.sol";

contract AutoFiMissions {
    StakingVault public stakingVault;
    MEPLToken public meplToken;
    mapping(address => uint256) public missionProgress;
    mapping(address => uint256) public sentimentBoosts; // Token => Multiplier (e.g., 1.5x = 150)
    uint256 public constant MISSION_THRESHOLD = 1000 * 1e18; // $1000 stake
    uint256 public constant REWARD_AMOUNT = 100 * 1e18; // 100 $MEPL

    constructor(address _stakingVault, address _meplToken) {
        stakingVault = StakingVault(_stakingVault);
        meplToken = MEPLToken(_meplToken);
    }

    function checkMission(address user) external {
        if (stakingVault.stakedBalances(user) >= MISSION_THRESHOLD) {
            missionProgress[user] += 1;
            if (missionProgress[user] >= 30 days / 1 days) {
                uint256 reward = REWARD_AMOUNT * (sentimentBoosts[user] > 0 ? sentimentBoosts[user] : 100) / 100;
                meplToken.distributeRewards(user, reward);
                missionProgress[user] = 0;
            }
        }
    }

    // Set sentiment boost (called by oracle or off-chain)
    function setSentimentBoost(address token, uint256 multiplier) external {
        sentimentBoosts[token] = multiplier; // e.g., 150 for 1.5x
    }
}