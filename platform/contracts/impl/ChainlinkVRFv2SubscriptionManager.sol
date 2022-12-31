// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.12;

import '@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

import "../common.sol";
import "./BaseRngApp.sol";

abstract contract ChainlinkVRFv2SubscriptionManager is 
    VRFConsumerBaseV2,
    BaseRngApp
{
    VRFCoordinatorV2Interface immutable internal _CHAINLINK_VRF_COORDINATOR;
    LinkTokenInterface immutable internal _CHAINLINK_TOKEN;

    uint256 public rngFee = 0;

    bytes32 immutable internal _CHAINLINK_KEY_HASH;

    uint64 immutable internal _CHAINLINK_SUBSCRIPTION_ID;
    uint16 immutable internal _CHAINLINK_MIN_REQUEST_CONFIRMATIONS;
    uint32 immutable internal _CHAINLINK_CALLBACK_GAS_LIMIT;


    constructor(DoubleDiceProtocol protocol, ChainlinkConfig memory chainlinkConfig)
        VRFConsumerBaseV2(chainlinkConfig.vrfCoordinator)
        BaseRngApp(protocol)
    {

        _CHAINLINK_VRF_COORDINATOR = VRFCoordinatorV2Interface(chainlinkConfig.vrfCoordinator);
        _CHAINLINK_KEY_HASH = chainlinkConfig.keyHash;
        _CHAINLINK_SUBSCRIPTION_ID = chainlinkConfig.subId;
        _CHAINLINK_MIN_REQUEST_CONFIRMATIONS = chainlinkConfig.minRequestConfirmations;
        _CHAINLINK_CALLBACK_GAS_LIMIT = chainlinkConfig.callbackGasLimit;

        _CHAINLINK_TOKEN = LinkTokenInterface(chainlinkConfig.linkToken);
    }

    function requestRandomWords(uint32 numWords) internal returns(uint256)  {
        uint256 requestId = _CHAINLINK_VRF_COORDINATOR.requestRandomWords(
            _CHAINLINK_KEY_HASH,
            _CHAINLINK_SUBSCRIPTION_ID,
            _CHAINLINK_MIN_REQUEST_CONFIRMATIONS,
            _CHAINLINK_CALLBACK_GAS_LIMIT,
            numWords
        );
        return requestId;
    }

    function getSubscriptionId() external view returns (uint64) {
        return _CHAINLINK_SUBSCRIPTION_ID;
    }

    function getKeyHash() external view returns (bytes32) {
        return _CHAINLINK_KEY_HASH;
    }

    function getCoordinator() public view returns (VRFCoordinatorV2Interface) {
        return _CHAINLINK_VRF_COORDINATOR;
    }

    function getRngFee() public view returns (uint256) {
        return rngFee;
    }

    function setRngFee(uint256 fee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        rngFee = fee;
    }


}