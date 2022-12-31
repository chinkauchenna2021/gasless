// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.12;

import "./DummyERC20.sol";

contract DummyLinkToken is DummyERC20("ChainLink Token (Dummy)", "LINK", 18) {
    function transferAndCall(address _to, uint _value, bytes memory /*_data*/)
        public
        returns (bool success)
    {
        super.transfer(_to, _value);
        return true;
    }
}