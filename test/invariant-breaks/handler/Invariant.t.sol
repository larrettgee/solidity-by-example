//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console2} from "../../../lib/forge-std/src/Test.sol";
import {HandlerStatefulFuzzCatches} from "../../../contracts/invariant-breaks/HandlerStatefulFuzzCatches.sol";
import {StdInvariant} from "../../../lib/forge-std/src/StdInvariant.sol";
import {YeildERC20} from "../../../contracts/mocks/YeildERC20.sol";
import {MockUSDC} from "../../../contracts/mocks/MockUSDC.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Handler} from "./Handler.t.sol";

contract AttemptedBreak is StdInvariant, Test {
    HandlerStatefulFuzzCatches hsfc;
    YeildERC20 yerc;
    MockUSDC musdc;
    IERC20[] tokens;
    uint256 startingAmount;
    address user = makeAddr("user");

    Handler handler;

    function setUp() public {
        vm.startPrank(user);
        yerc = new YeildERC20();
        musdc = new MockUSDC();
        startingAmount = yerc.INITIAL_SUPPLY();
        musdc.mint(user, startingAmount);

        vm.stopPrank();

        tokens.push(yerc);
        tokens.push(musdc);

        handler = new Handler(hsfc, musdc, yerc, user);

        bytes4[] memory selectors = new bytes4[](4);
        selectors[0] = handler.depositU.selector;
        selectors[1] = handler.depositY.selector;
        selectors[2] = handler.withdrawU.selector;
        selectors[3] = handler.withdrawY.selector;

        // Implements the logic to hit the handler functions we built
        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));
        targetContract(address(handler));
    }

    function testStartingAmountTheSame() public view {
        assert(startingAmount == 1);
        assert(startingAmount == musdc.balanceOf(user));
    }

    function statefulFuzz_catchWithHandler() public {
        vm.startPrank(user);
        hsfc.withdrawToken(musdc);
        hsfc.withdrawToken(yerc);
        vm.stopPrank();

        assert(musdc.balanceOf(address(hsfc)) == 0);
        assert(yerc.balanceOf(address(hsfc)) == 0);

        assert(musdc.balanceOf(user) == startingAmount);
        assert(yerc.balanceOf(user) == startingAmount);
    }
}
