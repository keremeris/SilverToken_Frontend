import { prepareWriteContract, writeContract } from "@wagmi/core";
import { BLOCKCHAIN_INFO } from "../constants.js";
import ERC20_ABI from "../abis/erc20.json";
import { stringToBigint } from "./util.js";
export const transferToken = async (token, amount, recipient, network) => {
  try {
    console.log(
      `transferToken enter: ${amount} ${recipient} ${network} ${token}}`
    );
    const decimals = BLOCKCHAIN_INFO[network].tokens[token].decimals;
    const tokenAddress = BLOCKCHAIN_INFO[network]["tokens"][token]["address"];

    const fullAmount = stringToBigint(amount, decimals);//BigInt(Math.floor(amount * 10 ** decimals));

    console.log(
      `tokenAddress: ${tokenAddress} ${decimals} ${fullAmount} ${BLOCKCHAIN_INFO[network].chainId}`
    );

    const config = await prepareWriteContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [recipient, fullAmount],
      chainId: BLOCKCHAIN_INFO[network].chainId,
      value: 0,
    });
    console.log(`config: ${config}`);

    const placeOrderResult = await writeContract(config);
    placeOrderResult["status"] = "placed";
    console.log(
      `placeOrderResult: ${JSON.stringify(placeOrderResult, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        } else return value;
      })}`
    );
    return placeOrderResult;
  } catch (e) {
    console.log(`transferToken error: ${e}`);
    return {
      status: false,
      message: `Failed. ${e?.shortMessage ? e.shortMessage : e}`,
    };
  }
};
