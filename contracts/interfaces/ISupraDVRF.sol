// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISupraDVRF {
    function getRandomNumber(address user) external returns (uint256, bytes memory);
}