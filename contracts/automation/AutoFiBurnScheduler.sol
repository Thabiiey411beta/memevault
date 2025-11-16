// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/MEPLToken.sol";
import "../interfaces/ISupraAutoFi.sol";

contract AutoFiBurnScheduler {
    MEPLToken public meplToken;
    ISupraAutoFi public supraAutoFi;

    constructor(address _meplToken, address _supraAutoFi) {
        meplToken = MEPLToken(_meplToken);
        supraAutoFi = ISupraAutoFi(_supraAutoFi);
    }

    function scheduleBurn() external {
        supraAutoFi.scheduleTask(address(meplToken), abi.encodeWithSignature("burnMonthly()"), 30 days);
    }
}