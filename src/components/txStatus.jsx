import { useConnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { BLOCKCHAIN_INFO } from "../constants.js";

export default function TxStatus({ txHash, network, handleCancel, message, state }) {
  const { connectors } = useConnect({
    connector: new InjectedConnector(),
  });
  const { chain } = useNetwork();


  async function addTokenstoMetamask() {
    const tokens = ["slvt", "slvd", "usdc"];
    for (let x of tokens) {
      await watchAsset(x);
    }
  }
  async function watchAsset(token) {
    if (connectors.length) {
      const network = chain.id === 1 ? "ethereum" : "polygon";
      console.log(`network: ${network} ${token}`)
      await connectors[0].watchAsset({
        address: BLOCKCHAIN_INFO[network].tokens[token].address,
        decimals: BLOCKCHAIN_INFO[network].tokens[token].decimals,
        symbol: BLOCKCHAIN_INFO[network].tokens[token].symbol,
        image: BLOCKCHAIN_INFO[network].tokens[token].imageUrl,
      });


    }
  }

  let txLink =
    network === "ethereum"
      ? "https://etherscan.io/tx/"
      : "https://polygonscan.com/tx/";
  txLink += txHash;

  let messageColor = "text-black";
  if (state === "success") {
    messageColor = "text-green-700";
  } else if (state === "failed") {
    messageColor = "text-red-700";
  }

  var longest = message?.split(" ").reduce(function (a, b) {
    return a.length > b.length ? a : b;
  });

  const wordbreakType = longest.length > 30 ? "break-keep" : "break-words";

  return (
    <div className=' flex flex-col space-y-4 p-4 '>

      <div className="flex justify-between ">
        <div className={`${"wordbreakType"} font-mainSemibold ${messageColor}`}>
          {message?.slice(0, 250)}
        </div>
        <button
          className="flex items-center mr-2 font-mainSemibold absolute top-4 right-1"
          onClick={handleCancel}
        >
          X
        </button>
      </div>
      <div>
        {txHash ? (
          <a
            href={`${txLink}`}
            className={"text-blue-900 break-all"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-black text-sm"> transaction link:</span>
            <div className="underline text-xs"> {txHash} </div>
          </a>
        ) : (
          <> </>
        )}
      </div>

      {state === "success" ? ""
        :
        <button
          className={`${network} p-4 py-3 font-mainSemibold text-white  border  w-full  rounded-lg`}
          onClick={handleCancel}
        > Close Box </button>
      }
    </div>
  );
}
