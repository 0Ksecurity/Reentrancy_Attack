//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

// This contract is vulnerable to re-entrancy attack.
/**
 * we use two Techniques to prevent Reentrancy Attack:
 * 1- Ensure all state changes happen before calling external contracts
 * 2- Use function modifiers that prevent re-entrancy or use openzeppelin/ReentrancyGuard
 */

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank {
    using Address for address payable;

    mapping(address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    //you can make modifier like this to avoid RA
    //  modifier noReentrant() {
    //     require(!locked, "No re-entrancy");
    //     locked = true;
    //     _;
    //     locked = false;
    // }

    function withdraw() external /* noReentrant or nonReentrant */ {
        // to avoide reentrancy Attack make sure to
        // doing all state changes before calling external contract
        // update this 3 line to :

        // uint256 depositedAmount = balanceOf[msg.sender];
        // balanceOf[msg.sender] = 0;
        // payable(msg.sender).sendValue(depositedAmount);
        // now your function will doing all state change before calling external contract
        uint256 depositedAmount = balanceOf[msg.sender];
        payable(msg.sender).sendValue(depositedAmount);
        balanceOf[msg.sender] = 0;
    }
}
