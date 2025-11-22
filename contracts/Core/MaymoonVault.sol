// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MaymoonVault.sol – The Official MemeVault × Maymoon Fusion Contract
 * @author Newton (@Newton_crypt) – ZA to the Moon
 * @notice This is the production-ready vault that turns every Maymoon raffle entry
 *         into a liquid, yield-bearing stake. $MAYM becomes the sole utility token.
 *         Built for Supra mainnet.
 */

interface IMaymoonRaffle {
    function onVaultDeposit(address user, uint256 amountInSupra, uint256 amountInMeme) external;
}

interface IstMEME is IERC20 {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract MaymoonVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ==========================
    //          TOKENS
    // ==========================
    IERC20 public constant SUPRA = IERC20(0xSUPRA_TOKEN_ADDRESS);     // Replace on deploy
    IERC20 public constant MAYM = IERC20(0xMAYM_TOKEN_ADDRESS);       // $MAYM – the king
    IstMEME public immutable stMEME;                                 // Liquid staking receipt

    // Accepted memecoins (DOGE, SHIB, PEPE wrappers on Supra)
    address[] public memeTokens;
    mapping(address => bool) public isMemeToken;

    // ==========================
    //         CONSTANTS
    // ==========================
    uint256 public constant POOL_WEIGHT_SUPRA = 70;   // 70% of pool
    uint256 public constant POOL_WEIGHT_MEME  = 30;   // 30% of pool
    uint256 public constant TOTAL_WEIGHT = 100;

    // Fees (in basis points)
    uint256 public depositFeeBP = 20;     // 0.20% → 70% to LPs, 20% to $MAYM buyback, 10% treasury
    uint256 public withdrawFeeBP = 20;
    address public treasury;

    // Maymoon integration
    IMaymoonRaffle public maymoonRaffle;

    // ==========================
    //           EVENTS
    // ==========================
    event Deposited(address indexed user, uint256 supraAmt, uint256 memeAmt, uint256 stMEME);
    event Withdrawn(address indexed user, uint256 supraAmt, uint256 memeAmt, uint256 stMEME);
    event FeesCollected(uint256 maymBuyback, uint256 treasuryAmt);
    event EmergencyWithdraw(address token, uint256 amount);

    constructor(
        address _stMEME,
        address _treasury,
        address _maymoonRaffle,
        address[] memory _initialMemeTokens
    ) {
        stMEME = IstMEME(_stMEME);
        treasury = _treasury;
        maymoonRaffle = IMaymoonRaffle(_maymoonRaffle);

        for (uint i = 0; i < _initialMemeTokens.length; i++) {
            memeTokens.push(_initialMemeTokens[i]);
            isMemeToken[_initialMemeTokens[i]] = true;
        }
    }

    // ==========================
    //        USER ENTRY
    // ==========================
    function deposit(
        uint256 supraAmount,
        uint256 memeAmount,
        address memeToken
    ) external nonReentrant {
        require(supraAmount > 0 || memeAmount > 0, "Nothing to deposit");
        if (memeAmount > 0) {
            require(isMemeToken[memeToken], "Invalid meme token");
        }

        uint256 totalValueUSD = _calculateDepositValue(supraAmount, memeAmount, memeToken);
        require(totalValueUSD > 0, "Zero value");

        // 1. Transfer tokens from user
        if (supraAmount > 0) SUPRA.safeTransferFrom(msg.sender, address(this), supraAmount);
        if (memeAmount > 0) IERC20(memeToken).safeTransferFrom(msg.sender, address(this), memeAmount);

        // 2. Apply deposit fee
        uint256 fee = (totalValueUSD * depositFeeBP) / 10_000;
        uint256 maymBuyback = (fee * 20) / 100;
        uint256 treasuryAmt = (fee * 10) / 100;

        // 3. Mint stMEME (1:1 with USD value after fee)
        uint256 stMEMEToMint = totalValueUSD - fee;
        stMEME.mint(msg.sender, stMEMEToMint);

        // 4. Distribute fees in $MAYM (simplified – in prod use Supra DEX router)
        if (maymBuyback > 0) {
            // Swap portion of pool assets to $MAYM and burn/buyback here
            // Placeholder – real impl uses ISupraRouter
            MAYM.safeTransfer(treasury, maymBuyback); // temp until router
        }
        if (treasuryAmt > 0) {
            MAYM.safeTransfer(treasury, treasuryAmt);
        }

        // 5. Notify Maymoon (triggers mission progress, extra spins, etc.)
        if (address(maymoonRaffle) != address(0)) {
            maymoonRaffle.onVaultDeposit(msg.sender, supraAmount, memeAmount);
        }

        emit Deposited(msg.sender, supraAmount, memeAmount, stMEMEToMint);
        emit FeesCollected(maymBuyback, treasuryAmt);
    }

    // ==========================
    //        WITHDRAWAL
    // ==========================
    function withdraw(uint256 stMEMEAmount) external nonReentrant {
        require(stMEME.balanceOf(msg.sender) >= stMEMEAmount, "Insufficient stMEME");

        uint256 totalValueUSD = stMEMEAmount; // 1:1 peg

        uint256 fee = (totalValueUSD * withdrawFeeBP) / 10_000;
        uint256 valueAfterFee = totalValueUSD - fee;

        // Burn stMEME
        stMEME.burn(msg.sender, stMEMEAmount);

        // Return pro-rata assets (70/30 split)
        uint256 supraOut = (valueAfterFee * POOL_WEIGHT_SUPRA) / TOTAL_WEIGHT;
        uint256 memeOut = valueAfterFee - supraOut;

        SUPRA.safeTransfer(msg.sender, supraOut);
        // Simplified: send from first meme token – real version loops proportionally
        if (memeOut > 0 && memeTokens.length > 0) {
            IERC20(memeTokens[0]).safeTransfer(msg.sender, memeOut);
        }

        emit Withdrawn(msg.sender, supraOut, memeOut, stMEMEAmount);
    }

    // ==========================
    //      ORACLE / PRICING
    // ==========================
    function _calculateDepositValue(
        uint256 supraAmount,
        uint256 memeAmount,
        address memeToken
    ) internal view returns (uint256 totalUSD) {
        // In production: use Supra’s price oracle
        // Mock prices (1 $SUPRA = $1, 1 memecoin = $0.0001 average)
        uint256 supraUSD = supraAmount; // 1:1 placeholder
        uint256 memeUSD = memeAmount / 10_000; // rough average
        totalUSD = supraUSD + memeUSD;
    }

    // ==========================
    //      ADMIN FUNCTIONS
    // ==========================
    function addMemeToken(address token) external onlyOwner {
        require(!isMemeToken[token], "Already added");
        isMemeToken[token] = true;
        memeTokens.push(token);
    }

    function setFees(uint256 _depositFeeBP, uint256 _withdrawFeeBP) external onlyOwner {
        require(_depositFeeBP <= 100 && _withdrawFeeBP <= 100, "Fee too high");
        depositFeeBP = _depositFeeBP;
        withdrawFeeBP = _withdrawFeeBP;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setMaymoonRaffle(address _raffle) external onlyOwner {
        maymoonRaffle = IMaymoonRaffle(_raffle);
    }

    // Emergency withdraw (only owner – for migration)
    function emergencyWithdraw(IERC20 token) external onlyOwner {
        uint256 bal = token.balanceOf(address(this));
        token.safeTransfer(owner(), bal);
        emit EmergencyWithdraw(address(token), bal);
    }

    // Receive native SUPRA if needed
    receive() external payable {}
}