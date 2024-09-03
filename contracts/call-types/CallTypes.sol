// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract A {
    uint public num;
    address public sender;

    function serVar(uint _num) public payable {
        num = _num;
        sender = msg.sender;
    }
}

contract CallTypes {
    uint public num;
    address public sender;

    function callSetVars(address _contract, uint _num) public payable {
        (bool success, ) = _contract.call(abi.encodeWithSignature("serVar(uint)", _num));
    }

    function delegateSetVars(address _contract, uint _num) public {
        (bool success, ) = _contract.delegatecall(abi.encodeWithSignature("serVar(uint)", _num));
    }

    function staticcallSetVars(address _contract, uint _num) public {
        (bool success, ) = _contract.staticcall(abi.encodeWithSignature("num()"));
        uint number = A(_contract).num();
    }
}
