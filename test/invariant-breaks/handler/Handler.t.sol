// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console2} from "../../../lib/forge-std/src/Test.sol";
import {HandlerStatefulFuzzCatches} from "../../../contracts/invariant-breaks/HandlerStatefulFuzzCatches.sol";
import {YeildERC20} from "../../../contracts/mocks/YeildERC20.sol";
import {MockUSDC} from "../../../contracts/mocks/MockUSDC.sol";

contract Handler is Test {
    HandlerStatefulFuzzCatches hsf;
    MockUSDC musdc;
    YeildERC20 yerc;
    address user;

    constructor(HandlerStatefulFuzzCatches _hsf, MockUSDC _musdc, YeildERC20 _yerc, address _user) {
        hsf = _hsf;
        musdc = _musdc;
        yerc = _yerc;
        user = _user;
    }

    function depositY(uint256 _amount) public {
        uint256 amount = bound(_amount, 0, yerc.balanceOf(user));
        vm.startPrank(user);
        yerc.approve(address(hsf), amount);
        hsf.depositToken(yerc, amount);
        vm.stopPrank();
    }

    function depositU(uint256 _amount) public {
        uint256 amount = bound(_amount, 0, musdc.balanceOf(user));
        vm.startPrank(user);
        musdc.approve(address(hsf), amount);
        hsf.depositToken(musdc, amount);
        vm.stopPrank();
    }

    function withdrawY() public {
        vm.startPrank(user);
        hsf.withdrawToken(yerc);
        vm.stopPrank();
    }

    function withdrawU() public {
        vm.startPrank(user);
        hsf.withdrawToken(musdc);
        vm.stopPrank();
    }
}
