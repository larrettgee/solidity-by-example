//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "../../lib/forge-std/src/Test.sol";
import {StatefulFuzzCatches} from "../../contracts/invariant-breaks/StatefulFuzzCatches.sol";
import {StdInvariant} from "../../lib/forge-std/src/StdInvariant.sol";

contract StatefuluzzCatchesTest is StdInvariant, Test {
    StatefulFuzzCatches sfc;

    function setUp() public {
        sfc = new StatefulFuzzCatches();
        targetContract(address(sfc));
    }

    function test_stateful_fuzz(uint128 number) public {
        assert(sfc.doMoreMathAgain(number) != 0);
    }

    function statefulFuzz_catch() public view {
        assert(sfc.storedValue() != 0);
    }
}
