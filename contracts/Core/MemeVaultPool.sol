// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/ISupraOracle.sol";
import "../libraries/SafeMath.sol";

contract MemeVaultPool is ERC20, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant AUTO_FI_ROLE = keccak256("AUTO_FI_ROLE");
    address public supraToken; // $SUPRA
    address[] public memecoins; // DOGE, SHIB, PEPE
    uint256 public supraWeight = 70; // 70% $SUPRA
    uint256 public memecoinWeight = 30; // 30% memecoins
    ISupraOracle public supraOracle;
    mapping(address => uint256) public balances;
    uint256 public totalLiquidity;
    uint256 public constant FEE_PRECISION = 1e4; // 10000 = 100%
    uint256 public dynamicFee = 30; // 0.3%
    address public treasury;

    event Deposit(address indexed user, uint256 supraAmount, uint256[] memecoinAmounts, uint256 stMEME);
    event Withdraw(address indexed user, uint256 stMEME, uint256 supraAmount, uint256[] memecoinAmounts);
    event Rebalance(uint256 newSupraWeight, uint256 newMemecoinWeight);
    event FeeCollected(uint256 amount);

    constructor(
        address _supraToken,
        address[] memory _memecoins,
        address _supraOracle,
        address _treasury,
        address _admin
    ) ERC20("MemeVault Staked Token", "stMEME") {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(AUTO_FI_ROLE, _admin); // AutoFi role for rebalancing
        supraToken = _supraToken;
        memecoins = _memecoins;
        supraOracle = ISupraOracle(_supraOracle);
        treasury = _treasury;
    }

    function deposit(uint256 supraAmount, uint256[] calldata memecoinAmounts) external {
        require(memecoinAmounts.length == memecoins.length, "Invalid memecoin amounts");
        uint256 totalValue = calculateDepositValue(supraAmount, memecoinAmounts);
        require(totalValue > 0, "No value deposited");

        IERC20(supraToken).transferFrom(msg.sender, address(this), supraAmount);
        for (uint256 i = 0; i < memecoins.length; i++) {
            IERC20(memecoins[i]).transferFrom(msg.sender, address(this), memecoinAmounts[i]);
        }

        uint256 stMEME = totalLiquidity == 0 ? totalValue : totalValue.mul(totalSupply()).div(totalLiquidity);
        _mint(msg.sender, stMEME);
        balances[msg.sender] = balances[msg.sender].add(stMEME);
        totalLiquidity = totalLiquidity.add(totalValue);

        emit Deposit(msg.sender, supraAmount, memecoinAmounts, stMEME);
    }

    function withdraw(uint256 stMEMEAmount) external {
        require(balances[msg.sender] >= stMEMEAmount, "Insufficient balance");
        uint256 share = stMEMEAmount.mul(1e18).div(totalSupply());
        uint256 supraAmount = IERC20(supraToken).balanceOf(address(this)).mul(share).div(1e18);
        uint256[] memory memecoinAmounts = new uint256[](memecoins.length);

        for (uint256 i = 0; i < memecoins.length; i++) {
            memecoinAmounts[i] = IERC20(memecoins[i]).balanceOf(address(this)).mul(share).div(1e18);
            IERC20(memecoins[i]).transfer(msg.sender, memecoinAmounts[i]);
        }
        IERC20(supraToken).transfer(msg.sender, supraAmount);

        _burn(msg.sender, stMEMEAmount);
        balances[msg.sender] = balances[msg.sender].sub(stMEMEAmount);
        totalLiquidity = totalLiquidity.sub(totalLiquidity.mul(share).div(1e18));

        emit Withdraw(msg.sender, stMEMEAmount, supraAmount, memecoinAmounts);
    }

    function collectFee(uint256 amount) external onlyRole(AUTO_FI_ROLE) {
        uint256 lpShare = amount.mul(70).div(100);
        uint256 stakerShare = amount.mul(20).div(100);
        uint256 treasuryShare = amount.mul(10).div(100);
        IERC20(supraToken).transfer(treasury, treasuryShare);
        IERC20(supraToken).transfer(address(this), lpShare + stakerShare);
        emit FeeCollected(amount);
    }

    function calculateDepositValue(uint256 supraAmount, uint256[] memory memecoinAmounts)
        internal
        view
        returns (uint256)
    {
        uint256 totalValue = supraOracle.getPrice(supraToken).mul(supraAmount);
        for (uint256 i = 0; i < memecoins.length; i++) {
            totalValue = totalValue.add(supraOracle.getPrice(memecoins[i]).mul(memecoinAmounts[i]));
        }
        return totalValue.div(1e18);
    }

    function rebalance(uint256 newSupraWeight, uint256 newMemecoinWeight) external onlyRole(AUTO_FI_ROLE) {
        require(newSupraWeight.add(newMemecoinWeight) == 100, "Invalid weights");
        supraWeight = newSupraWeight;
        memecoinWeight = newMemecoinWeight;
        emit Rebalance(newSupraWeight, newMemecoinWeight);
    }

    function setDynamicFee(uint256 newFee) external onlyRole(AUTO_FI_ROLE) {
        require(newFee >= 10 && newFee <= 100, "Fee out of range");
        dynamicFee = newFee;
    }
}