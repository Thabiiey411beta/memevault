// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MEPLToken.sol";

contract StakingVault {
    address public supraToken;
    address public stMEME;
    address public meplToken;
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;
    uint256 public constant REWARD_RATE = 1e16; // 10% of fees per block
    uint256 public lastRewardBlock;
    uint256 public accumulatedRewards;

    event Stake(address indexed user, uint256 stMEMEAmount, uint256 supraAmount);
    event Unstake(address indexed user, uint256 stMEMEAmount, uint256 supraAmount);
    event ClaimRewards(address indexed user, uint256 meplAmount, uint256 supraAmount);

    constructor(address _supraToken, address _stMEME, address _meplToken) {
        supraToken = _supraToken;
        stMEME = _stMEME;
        meplToken = _meplToken;
        lastRewardBlock = block.number;
    }

    // Stake stMEME and $SUPRA
    function stake(uint256 stMEMEAmount, uint256 supraAmount) external {
        require(stMEMEAmount > 0 || supraAmount > 0, "Invalid stake amount");
        updateRewards();

        if (stMEMEAmount > 0) {
            IERC20(stMEME).transferFrom(msg.sender, address(this), stMEMEAmount);
        }
        if (supraAmount > 0) {
            IERC20(supraToken).transferFrom(msg.sender, address(this), supraAmount);
        }
        stakedBalances[msg.sender] += stMEMEAmount + supraAmount;
        totalStaked += stMEMEAmount + supraAmount;

        emit Stake(msg.sender, stMEMEAmount, supraAmount);
    }

    // Unstake
    function unstake(uint256 stMEMEAmount, uint256 supraAmount) external {
        require(stakedBalances[msg.sender] >= stMEMEAmount + supraAmount, "Insufficient balance");
        updateRewards();

        if (stMEMEAmount > 0) {
            IERC20(stMEME).transfer(msg.sender, stMEMEAmount);
        }
        if (supraAmount > 0) {
            IERC20(supraToken).transfer(msg.sender, supraAmount);
        }
        stakedBalances[msg.sender] -= stMEMEAmount + supraAmount;
        totalStaked -= stMEMEAmount + supraAmount;

        emit Unstake(msg.sender, stMEMEAmount, supraAmount);
    }

    // Claim rewards
    function claimRewards() external {
        updateRewards();
        uint256 reward = (stakedBalances[msg.sender] * accumulatedRewards) / totalStaked;
        accumulatedRewards -= reward;

        uint256 meplReward = reward / 2;
        uint256 supraReward = reward / 2;
        IERC20(meplToken).transfer(msg.sender, meplReward);
        IERC20(supraToken).transfer(msg.sender, supraReward);

        emit ClaimRewards(msg.sender, meplReward, supraReward);
    }

    // Update rewards from network fees
    function updateRewards() internal {
        if (block.number > lastRewardBlock) {
            uint256 newFees = IERC20(supraToken).balanceOf(address(this)) - totalStaked;
            accumulatedRewards += (newFees * REWARD_RATE) / 1e18;
            lastRewardBlock = block.number;
        }
    }
}