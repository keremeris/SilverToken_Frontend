import { prepareWriteContract, writeContract } from "@wagmi/core";
import { BLOCKCHAIN_INFO } from "../constants.js";
import SWAP_ROUTER_ABI from "../abis/swapRouter.json";
import { allowance } from "./util.js";
import SLVT_ABI from "../abis/slvtToken.json";
import SLVD_ABI from "../abis/slvdToken.json";


export const swapExactInput = async (
  buyToken,
  sellToken,
  amount,
  recipient,
  network
) => {
  //return {'hash': "0xd4840aedc783b57ec5cce39ac4b9e81fd6f9bacded4444bb91d922db9b115b35", 'result': 'success'}

  const sellTokenAddress =
    BLOCKCHAIN_INFO[network]["tokens"][sellToken]["address"];
  const buyTokenAddress =
    BLOCKCHAIN_INFO[network]["tokens"][buyToken]["address"];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 40;
  const cntAddress =
    network === "ethereum"
      ? BLOCKCHAIN_INFO.ethereum.swapRouter
      : BLOCKCHAIN_INFO.polygon.swapRouter;

  console.log(
    `allowance: ${await allowance(
      sellTokenAddress,
      recipient,
      cntAddress,
      network
    )}`
  );


  const AMOUNT_OUT_MIN = 0;
  console.log(
    JSON.stringify(
      [
        [
          sellTokenAddress,
          buyTokenAddress,
          10000,
          recipient,
          deadline,
          AMOUNT_OUT_MIN,
          0,
        ],
      ],
      (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      }
    )
  );

  const zz = [
    sellTokenAddress,
    buyTokenAddress,
    10000,
    recipient,
    deadline,
    AMOUNT_OUT_MIN,
    0,
  ];

  console.log(
    `zz: ${JSON.stringify(zz, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      } else return value;
    })}`
  );

  try {
    const config = await prepareWriteContract({
      address: cntAddress,
      abi: SWAP_ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [
        [
          sellTokenAddress,
          buyTokenAddress,
          10000,
          recipient,
          deadline,
          AMOUNT_OUT_MIN,
          0,
        ],
      ],
      chainId: BLOCKCHAIN_INFO[network].chainId,
      value: 0,
    });

    const placeOrderResult = await writeContract(config);

    console.log(
      `placeOrderResult: ${JSON.stringify(placeOrderResult, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        } else return value;
      })}`
    );
    placeOrderResult["status"] = "placed";
    return placeOrderResult;
  } catch (e) {
    for (let x in e) {
      console.log(`error: ${x} ${e[x]}`);
    }
    console.log(`erroraaaaa: ${e.cause}`);
    console.log(`error shortMesaage: ${e?.shortMessage}`);
    const message = `Failed.  ${e?.shortMessage ? e.shortMessage : e}`;
    return { status: "error", message };
  }
};

/*
//struct ExactInputSingleParams {
//        address tokenIn;
//        address tokenOut;
//        uint24 fee;
//        address recipient;
//        uint256 deadline;
//        uint256 amountIn;
//        uint256 amountOutMinimum;
//        uint160 sqrtPriceLimitX96;
    }
 */

//amount Sold is in smallest unit of sellToken
//amountBought is in smallest unit of buyToken
export const swapSlvtSlvd = async (
  sellToken,
  buyToken,
  amountSold,
  amountBought,
  timestamp,
  signature,
  network
) => {
  const cntAddress = BLOCKCHAIN_INFO[network]["tokens"][sellToken].address;



  const functionName = buyToken === "slvd" ? "convertToSLVD" : "convertToSLVT";
  try {
    const config = await prepareWriteContract({
      address: cntAddress,
      abi: sellToken === "slvt" ? SLVT_ABI : SLVD_ABI,
      functionName,
      chainId: BLOCKCHAIN_INFO[network].chainId,
      value: 0,
    });

    const placeOrderResult = await writeContract(config);

    console.log(
      `swapslvtslvd: ${JSON.stringify(placeOrderResult, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        } else return value;
      })}`
    );
    placeOrderResult["status"] = "placed";
    return placeOrderResult;
  } catch (e) {
    console.log(`erroraaaaa: ${e.cause}`);
    console.log(`error shortMesaage: ${e?.shortMessage}`);
    const message = `Failed.  ${e?.shortMessage ? e.shortMessage : e}`;
    return { status: "error", message };
  }
};
