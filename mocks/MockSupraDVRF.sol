// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockSupraDVRF {
    function getRandomNumber(address) external view returns (uint256, bytes memory) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp))) % 100, "");
    }
}