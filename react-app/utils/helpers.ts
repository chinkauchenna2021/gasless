import { BigNumber as BigDecimal } from "bignumber.js";
import { BigNumber as BigInteger, BigNumberish, ethers } from "ethers";

export enum VirtualFloorState {
  None,
  Active_Open_MaybeResolvableNever, // formerly Running
  Active_Open_ResolvableLater, // formerly Running
  Active_Closed_ResolvableNever, // formerly ClosedUnresolvable
  Active_Closed_ResolvableLater, // formerly ClosedPreResolvable
  Active_Closed_ResolvableNow, // formerly ClosedResolvable
  Claimable_Payouts, // formerly ResolvedWinners
  Claimable_Refunds_ResolvedNoWinners, // formerly CancelledResolvedNoWinners
  Claimable_Refunds_ResolvableNever, // formerly CancelledUnresolvable
  Claimable_Refunds_Flagged, // formerly CancelledFlagged
}

export const convertNumToHexdecimal = (num: string | number) => {
  return num.toString(16);
};

export const $ = (dollars: BigNumberish, millionths: BigNumberish = 0): BigInteger =>
  BigInteger.from(1000000).mul(dollars).add(millionths);

export const formatTimestamp = (timestamp: string | number): string => {
  return (
    new Date(parseInt(timestamp.toString()) * 1000).toISOString().slice(11, 19).replace(/-/g, "\u2011") +
    " " +
    new Date(parseInt(timestamp.toString()) * 1000).toISOString().slice(0, 10).replace(/-/g, "\u2011")
  );
};

export const convertTimestampToDate = (timeStamp: number | string) => {
  const t = Number(timeStamp);
  const dateFormat = new Date(t * 1000);
  return dateFormat.getDate() +
    "/" + (dateFormat.getMonth() + 1) +
    "/" + dateFormat.getFullYear() +
    " " + dateFormat.getHours() +
    ":" + dateFormat.getMinutes() +
    ":" + dateFormat.getSeconds();
}
export const getSystemTimestamp = (): number => Math.floor(Date.now() / 1000);

// Emulate what goes on in the contracts
export const emulateRng = (requestId: BigInteger, nOutcomes: BigInteger): number => {
  // node_modules/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol
  const word0 = BigInteger.from(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [requestId, 0]))
  );

  return word0.mod(nOutcomes).toNumber();
};

export const convertNumToBigInt = (base: number, decimals: number, amount: string | number): BigInteger => {
  const bigDecimalAmount = new BigDecimal(base).pow(decimals).multipliedBy(amount);

  // We use toFixed instead of toString because we do not want exponential notation, e.g. 1e+21
  // bigDecimal amount should never have fractional part, because the input-component is already limiting the
  // decimal places according to the payment-token (e.g. max 6 decimals for USDC)
  // However, just in case, we pass toFixed(decimals=0) to ensure that intString is always without decimals.
  const intString = bigDecimalAmount.toFixed(0, BigDecimal.ROUND_DOWN);

  return BigInteger.from(intString);
};
