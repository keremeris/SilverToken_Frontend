import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import ERC20_ABI from "../abis/erc20.json";
import { BLOCKCHAIN_INFO } from "../constants.js";

export async function allowance(token, account, spender, network) {
  const result = await readContract({
    address: token,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [account, spender],
    chainId: BLOCKCHAIN_INFO[network].chainId,
  });
  //console.log("here")
  return result;
}

export async function hasAllowance(tokenAddress, spender, account, network) {
  let allowanceAmt = await allowance(tokenAddress, account, spender, network);
  return allowanceAmt > 10 ** 40;
}

export async function approve(tokenAddress, spender, network) {
  const config = await prepareWriteContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, BigInt(10 ** 50)],
    chainId: BLOCKCHAIN_INFO[network].chainId,
  });
  await writeContract(config);
}

export async function getBalance(tokenAddress, sender, network) {
  if (!sender || !tokenAddress) {
    return 0;
  }
  const temp = await readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [sender],
    chainId: BLOCKCHAIN_INFO[network].chainId,
  });

  return parseFloat(temp.toString());
}

export const stringToBigint = (str, decimals) => {
  let [whole, fractional] = str.split(".");
  fractional = fractional ?? "0";
  fractional = fractional.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + fractional);
};
