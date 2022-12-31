import { BigNumber } from "ethers";

export const toTimestamp = (myDate: string) => {
  return BigNumber.from(new Date(myDate).getTime() / 1000).toNumber();
};
