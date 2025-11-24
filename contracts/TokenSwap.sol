// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external returns (bool) {
        require(tokenIn != tokenOut, "Same token");
        require(amountIn > 0, "Amount 0");

        bool ok1 = IERC20(tokenIn).transferFrom(
            msg.sender,
            address(this),
            amountIn
        );
        require(ok1, "transferFrom failed");

        bool ok2 = IERC20(tokenOut).transfer(msg.sender, amountIn);
        require(ok2, "transfer out failed");

        return true;
    }

    function withdraw(address token, uint256 amount) external {
        require(msg.sender == owner, "not owner");
        IERC20(token).transfer(owner, amount);
    }
}
