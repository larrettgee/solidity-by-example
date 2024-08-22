//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "../../lib/forge-std/src/Test.sol";
import {StatelessFuzzCatches} from "../../contracts/invariant-breaks/StatelessFuzzCatches.sol";

contract StatelessFuzzCatchesTest is Test {
    StatelessFuzzCatches sfc;

    function setUp() public {
        sfc = new StatelessFuzzCatches();
    }

    function test_stateless(uint128 random) public view {
        assert(sfc.doMath(random) != 0);
    }
}
