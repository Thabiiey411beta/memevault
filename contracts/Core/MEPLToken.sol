// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../libraries/SafeMath.sol";

contract MEPLToken is ERC20, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant AUTO_FI_ROLE = keccak256("AUTO_FI_ROLE");
    uint256 public constant TOTAL_SUPPLY = 2_000_000_000 * 1e18;
    uint256 public constant INITIAL_BURN_RATE = 12; // 12% monthly
    uint256 public constant REDUCED_BURN_RATE = 3; // 3% monthly
    uint256 public constant BURN_INTERVAL = 30 days;
    uint256 public constant PHASE_1_THRESHOLD = 500_000_000 * 1e18; // 500M $MEPL
    uint256 public constant FINAL_THRESHOLD = 100_000_000 * 1e18; // 100M $MEPL
    uint256 public lastBurnTimestamp;
    uint256 public deploymentTimestamp;
    bool public burnActive = true;

    event TokensBurned(uint256 amount, uint256 burnRate);

    constructor(address _admin) ERC20("MemeVault Governance Token", "MEPL") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(AUTO_FI_ROLE, _admin);
        _mint(address(this), TOTAL_SUPPLY);
        lastBurnTimestamp = block.timestamp;
        deploymentTimestamp = block.timestamp;
    }

    function burnMonthly() external onlyRole(AUTO_FI_ROLE) {
        require(burnActive, "Burn permanently stopped");
        require(block.timestamp >= lastBurnTimestamp.add(BURN_INTERVAL), "Burn interval not reached");

        uint256 circulatingSupply = totalSupply();
        uint256 burnRate = circulatingSupply > PHASE_1_THRESHOLD ? INITIAL_BURN_RATE : REDUCED_BURN_RATE;
        uint256 burnAmount = circulatingSupply.mul(burnRate).div(100);

        if (circulatingSupply.sub(burnAmount) <= FINAL_THRESHOLD) {
            burnAmount = circulatingSupply.sub(FINAL_THRESHOLD);
            burnActive = false;
        }

        _burn(address(this), burnAmount);
        lastBurnTimestamp = block.timestamp;
        emit TokensBurned(burnAmount, burnRate);
    }

    function distributeRewards(address recipient, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _transfer(address(this), recipient, amount);
    }
}