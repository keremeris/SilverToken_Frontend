import { COINS_INFO } from "../constants";
import USDCCoin from "../assets/images/coins/USDC.svg";

function SendDescription(doPay, amount, token, tokenImage, isBridge, network) {
  if (isBridge && doPay === false) {
    network = network === "ethereum" ? "polygon" : "ethereum";
  }

  const bridgeText = ` on  ${
    network?.charAt(0).toUpperCase() + network?.slice(1)
  } network`;
  return (
    <div className="flex flex-col rounded-lg border p-3 bg-gray-300">
      <div className="text-sm">
        {`${doPay ? "You pay" : "You receive"} ${isBridge ? bridgeText : ""} `}
      </div>

      <div className="flex justify-between text-xl font-mainSemibold">
        <div className="    ">{`${amount.toFixed(5)} ${token}`} </div>
        <img src={tokenImage} alt="token_iamge" />
      </div>
    </div>
  );
}

export default function TradeConfirm({
  sellTokenName,
  buyTokenName,
  amount,
  amountReceive,
  network,
  handleConfirm,
  handleCancel,
  isBridge,
}) {
  amount = parseFloat(amount);
  amountReceive = parseFloat(amountReceive);

  return (
    <div className="flex flex-col bg-blue  w-80  gap-5 p-6 ">
      <div className="flex justify-between ">
        <div className="flex justify-center ml-20 mr mb-2 font-mainSemibold">
          Review {isBridge ? "Bridge" : "Swap"}
        </div>
        <button
          className="flex items-center mr-2 font-mainSemibold relative -top-1"
          onClick={handleCancel}
        >
          X
        </button>
      </div>
      {SendDescription(
        true,
        amount,
        sellTokenName.toUpperCase(),
        COINS_INFO[sellTokenName]?.image,
        isBridge,
        network
      )}
      {SendDescription(
        false,
        amountReceive,
        buyTokenName.toUpperCase(),
        COINS_INFO[buyTokenName]?.image,
        isBridge,
        network
      )}

      <button
        onClick={handleConfirm}
        className={`${network} p-4 py-3 font-mainSemibold text-white  border  w-full  rounded-lg`}
      >
        Confirm
      </button>
      <div className="text-red-500 text-xs">
        This transaction does not include network gas fees. Please double check
        the gas fees when you confirm the transaction in MetaMask
      </div>
    </div>
  );
}

function BridgeConfirmMessage({ network, amount, sellTokenName }) {
  return (
    <>
      <div className="flex flex-row space-x-2">
        <div>
          Send {amount} of {sellTokenName.toUpperCase()}
        </div>
        <img
          src={COINS_INFO[sellTokenName].image}
          className="w-full max-w-[18px]"
        />
      </div>
      <div>
        from {network?.charAt(0).toUpperCase() + network.slice(1)} blockchain to{" "}
        {network === "ethereum" ? "Polygon" : "Ethereum"} blockchain
      </div>
    </>
  );
}
