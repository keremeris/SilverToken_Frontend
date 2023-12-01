import { FilterBtn } from "../filters/filterBtn";
import { ExchangeItem } from "./ExchangeItem";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useNetwork } from "wagmi";
import { waitForTransaction, switchNetwork } from "@wagmi/core";

import EthereumCoin from "../../assets/images/coins/ethereum.svg";
import PolygonCoin from "../../assets/images/coins/polygon.svg";
import SwapVert from "../../assets/images/swap_vert.svg";
import { useState, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { BLOCKCHAIN_INFO, COINS_INFO } from "../../constants";
import { swapSlvtSlvd } from "../../api/swap";
import { transferToken } from "../../api/bridge";
import { getBalance } from "../../api/util";
import Modal from "../modal";
import TxStatus from "../txStatus";
import TradeConfirm from "../tradeConfirm";

import {
  getSlvtSlvdPrice,
  getSignatureSlvtToSlvd,
  getSignatureSlvdToSlvt,
} from "../../api/silverTokenBackend";
import { formatUnits } from "viem";

const BRIDGE_ADDRESS = "0x17b26226DBaBed1bEcA2ad676Eee19D9f7876a0B";

const SEND_TOKENS = {
  ethereum: ["slvt", "slvd", "usdc"],
  polygon: ["slvt", "slvd", "usdc"],
  bridge: ["slvt", "slvd"],
};

// Given the send token, return the receive token options
const RECEIVE_TOKENS = {
  ethereum: {
    slvt: ["slvd"],
    usdc: ["slvd"],
    slvd: ["slvt"],
    weth: [],
    "": ["slvt", "slvd"],
  },
  polygon: {
    slvt: ["slvd"],
    usdc: ["slvd"],
    slvd: ["slvt", "usdc"],
    "": ["slvt", "slvd"],
  },
  bridge: {
    slvt: ["slvt"],
    slvd: ["slvd"],
    "": ["slvt", "slvd"],
  },
};

const unimplimentedSwap = (sendToken, buyToken, network, type) => {
  return {
    status: "failed",
    message: `No implimentation of swap of ${sendToken.toUpperCase()} to ${buyToken.toUpperCase()} on chain ${network} for ${type}. Please contact support.`,
  };
};

const placeUsdcSlvdSwap = async (
  sellToken,
  sellAmount,
  address,
  whichNetwork
) => {
  return await transferToken(sellToken, sellAmount, address, whichNetwork);
};

export function ExchangeLayout() {
  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  const networks = [
    { value: "polygon", label: "Polygon", labelImage: PolygonCoin },
    { value: "ethereum", label: "Ethereum", labelImage: EthereumCoin },
  ];

  // swap options (Send)
  const [network, setNetwork] = useState(networks[0].value);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setNetwork(chain?.id === 1 ? "ethereum" : chain?.id === 137 ? "polygon" : "ethereum");
  }, [chain]);
  const [activeFilter, setActiveFilter] = useState("swap");
  const [amSubmitting, setAmSubmitting] = useState(false);
  const [sendToken, setSendToken] = useState("");
  const [receiveToken, setReceiveToken] = useState("");
  const [sendAmount, setSendAmount] = useState("0");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [tradeStatus, setTradeStatus] = useState({
    status: "",
    hash: "",
    message: "",
  });
  const [slvtSlvdPrice, setSlvtSlvdPrice] = useState(0);

  const { open } = useWeb3Modal();

  useEffect(() => {
    async function fetchData() {
      try {
        setSlvtSlvdPrice(
          await getSlvtSlvdPrice(
            1,
            sendToken === "slvt" && receiveToken === "slvd"
          )
        );
      } catch (e) {
        setSlvtSlvdPrice(0);
      }
    }
    fetchData();
  }, []);

  const handleSwitch = () => {
    console.log("handleSwitch");
    network === "ethereum" ? setNetwork("polygon") : setNetwork("ethereum");
  };

  const handleFilter = (val) => {
    if (val !== activeFilter) {
      setSendToken("");
      setReceiveToken("");
      //setSendToken("slvt");
      //setReceiveToken("slvt");
    }
    setActiveFilter(val);
  };

  const checkForNewSlvtSlvdPrice = async (tokenSend, tokenReceive) => {
    if (tokenSend === "slvt" && tokenReceive === "slvd") {
      setSlvtSlvdPrice(await getSlvtSlvdPrice(sendAmount ?? 1, true));
    } else if (tokenSend === "slvd" && tokenReceive === "slvt") {
      setSlvtSlvdPrice(await getSlvtSlvdPrice(sendAmount ?? 1, false));
    }
  };

  const changeSendToken = (val) => {
    setSendToken(val);
    checkForNewSlvtSlvdPrice(val, receiveToken);
    if (
      RECEIVE_TOKENS[activeFilter === "swap" ? network : "bridge"][
        val
      ].includes(receiveToken) === false
    ) {
      setReceiveToken("");
    }
  };

  const changeReceiveToken = (val) => {
    checkForNewSlvtSlvdPrice(sendToken, val);
    setReceiveToken(val);
  };

  const constExchanges = ["slvd", "usdc"];

  if (
    (constExchanges.includes(sendToken) &&
      constExchanges.includes(receiveToken)) ||
    (sendToken === "slvt" && receiveToken === "slvt")
  ) {
    if (sendAmount !== receiveAmount) {
      setReceiveAmount(sendAmount);
    }
  } else if (
    [sendToken, receiveToken].every((x) => ["slvt", "slvd"].includes(x))
  ) {
    if (slvtSlvdPrice === 0) {
      if (receiveAmount !== 0) {
        setReceiveAmount(0);
      }
    } else {
      const target =
        sendToken === "slvt"
          ? slvtSlvdPrice * sendAmount
          : sendAmount / slvtSlvdPrice;
      if (Math.abs(receiveAmount / target - 1) > 0.0001) {
        console.log(`setReceiveAmount: ${target}`);
        setReceiveAmount(target);
      }
    }
  } else {
    if (receiveAmount !== 0) {
      setReceiveAmount(0);
    }
  }

  const updateSendAmount = (val) => {
    setSendAmount(val);
  };

  const updateReceiveAmount = (val) => {
    console.log(`receive val: ${val} ${typeof val}`);
    //setReceiveAmount(val);
  };

  const doExchange = async () => {
    const usdcSlvd = ["slvd", "usdc"];
    if (activeFilter === "bridge" && sendToken === receiveToken) {
      return await bridge();
    }

    if (usdcSlvd.includes(sendToken) && usdcSlvd.includes(receiveToken)) {
      return await placeUsdcSlvdSwap(
        sendToken,
        sendAmount,
        BLOCKCHAIN_INFO[network].usdcSlvtSwapAddress,
        network
      );
    }
    const slvtSlvd = ["slvt", "slvd"];
    if (slvtSlvd.includes(sendToken) && slvtSlvd.includes(receiveToken)) {
      console.log(`enter exchange slvtSlvd}`);
      return await exchangeSlvtSlvd();
    } else {
      console.log(`unimplimentedSwap: ${sendToken} ${receiveToken}`);
    }

    return await unimplimentedSwap(
      sendToken,
      receiveToken,
      network,
      activeFilter
    );
  };

  const handleSendMax = async () => {
    if (chain?.id) {
      const balance = await getBalance(
        BLOCKCHAIN_INFO[chain?.id]?.tokens[sendToken]?.address,
        address,
        network
      );
      if (sendToken) {
        setSendAmount(
          formatUnits(
            balance.toString(),
            BLOCKCHAIN_INFO[chain?.id].tokens[sendToken].decimals
          )
        );
      } else {
        setSendAmount(0)
      }
    }
  };

  const exchangeSlvtSlvd = async () => {
    try {
      const swapData =
        sendToken === "slvt"
          ? await getSignatureSlvtToSlvd(address, sendAmount)
          : await getSignatureSlvdToSlvt(address, sendAmount);
      return await swapSlvtSlvd(
        sendToken,
        receiveToken,
        sendToken === "slvt" ? swapData.slvtAmount : swapData.slvdAmount,
        receiveToken === "slvt" ? swapData.slvtAmount : swapData.slvdAmount,
        swapData.timestamp,
        swapData.signature,
        network
      );
    } catch (e) {
      return {
        status: "failed",
        message: `failed ${e}`,
      };
    }
  };


  const bridge = async () => {
    return await transferToken(sendToken, sendAmount, BRIDGE_ADDRESS, network);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTradeStatus({
      status: "",
      hash: "",
      message: "",
    });
  };

  const getTransactionState = async (txHash) => {
    // if you call waitForTransaction immediately after sending a transaction, it will fail
    // so we wait 12 seconds before calling it
    await new Promise((r) => setTimeout(r, 12000));

    const MAX_WAIT_TIME = 60000;
    try {
      await waitForTransaction({
        network: BLOCKCHAIN_INFO[network].chainId,
        hash: txHash,
        timeout: MAX_WAIT_TIME,
      });

      return {
        status: true,
        message: "",
      };
    } catch (e) {
      return {
        status: false,
        message: e?.shortMessage ? e.shortMessage : e,
      };
    }
  };

  const addPolygonNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Polygon Mainnet",
          rpcUrls: ["https://polygon-rpc.com/"],
          blockExplorerUrls: ["https://polygonscan.com/"],
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
        },
      ],
    });
  };

  const selectCorrectNetwork = async () => {
    let desiredNetwork = 1;
    try {
      desiredNetwork = network === "ethereum" ? 1 : 137;
      if (desiredNetwork === chain.id) {
        return;
      }
      const message = `Please switch your wallet to ${network.charAt(0).toUpperCase() + network.slice(1)
        }`;
      setTradeStatus({ status: "waiting", message: message, hash: "" });
      await switchNetwork({ chainId: desiredNetwork });
    } catch (e) {
      for (const x in e) {
        console.log(`selectCorrectNetwork: ${x} ${typeof e[x]}`);
      }
      if (
        e?.name &&
        e?.name?.search("ChainNotConfiguredForConnectorError") >= 0 &&
        desiredNetwork === 137
      ) {
        await addPolygonNetwork();
        await switchNetwork({ chainId: desiredNetwork });
      }
    }
  };

  const haveEnoughTokens = async () => {
    const sendTokenAddress = BLOCKCHAIN_INFO[network].tokens[sendToken].address;
    const balance = await getBalance(sendTokenAddress, address, network);
    const decimals = BLOCKCHAIN_INFO[network].tokens[sendToken].decimals;
    const wholeSendAmount = BigInt(Math.floor(sendAmount * 10 ** decimals));
    if (balance < wholeSendAmount) {
      return {
        status: false,
        message: `You do not have enough ${sendToken.toUpperCase()} to complete this transaction. Please deposit more ${sendToken.toUpperCase()} and try again.
        Balance: ${(Number(balance) / 10 ** decimals).toFixed(
          4
        )}, SendAmount: ${sendAmount}`,
      };
    } else {
      return {
        status: true,
        message: "",
      };
    }
  };

  const handleSubmit = async () => {
    const waitForMetamask =
      "Waiting for transaction to be accepted by wallet...";
    const waitForMining =
      "Waiting for transaction to be added to the blockchain...";
    try {
      setAmSubmitting(true);

      await selectCorrectNetwork();

      const checkEnough = await haveEnoughTokens();
      if (!checkEnough || checkEnough?.status === false) {
        setTradeStatus({
          status: "failed",
          message: `${checkEnough?.message}`,
          hash: "",
        });
        setAmSubmitting(false);
        console.log(`not enough`);
        return;
      }

      setTradeStatus({ status: "waiting", message: waitForMetamask, hash: "" });
      const result = await doExchange();

      if (result?.status !== "placed" || !result?.hash) {
        setTradeStatus({
          status: "failed",
          message: `${result?.message}`,
          hash: result?.hash,
        });
        setAmSubmitting(false);
        return;
      }

      setTradeStatus({
        status: "waiting",
        message: waitForMining,
        hash: result?.hash,
      });

      const tx_state = await getTransactionState(result?.hash);

      if (tx_state.status) {
        const message =
          "Transaction Successful. Network can take up to 30 minutes to send the tokens. Please email support@silvertoken.com if your tokens are not received.";
        setTradeStatus({
          status: "success",
          message: `${message} ${tx_state.message}`,
          hash: result?.hash,
        });
        setAmSubmitting(false);
        return;
      } else {
        setTradeStatus({
          status: "failed",
          message: `Your transaction was unsuccessful ${tx_state.message}`,
          hash: result?.hash,
        });
        setAmSubmitting(false);
        return;
      }
    } catch (e) {
      setAmSubmitting(false);
      setTradeStatus({
        status: "failed",
        message: `Your transaction was unsuccessful ${e}`,
        hash: "",
      });
    }
  };

  function requestSwap() {
    if (amSubmitting) {
      alert("Please wait for the previous transaction to complete");
      return;
    } else {
      setShowModal(true);
      handleSubmit();
    }
  }

  return (
    <>
      {showModal ? (
        <Modal>
          {tradeStatus.status === "" ? (
            <TradeConfirm
              sellTokenName={sendToken}
              buyTokenName={receiveToken}
              amount={sendAmount}
              amountReceive={receiveAmount}
              network={network}
              handleConfirm={handleSubmit}
              handleCancel={handleCloseModal}
              isBridge={activeFilter === "bridge"}
            />
          ) : (
            <TxStatus
              txHash={tradeStatus.hash}
              network={network}
              handleCancel={handleCloseModal}
              message={tradeStatus.message}
              state={tradeStatus.status}
            />
          )}
        </Modal>
      ) : (
        <></>
      )}

      <div className="w-full max-w-[360px] bg-linearWhite p-6 border border-gray-200 rounded-2xl">
        <div className="w-full flex items-center justify-between">
          <ul className="flex items-center gap-4">
            <FilterBtn
              text="swap"
              activeFilter={activeFilter}
              onFilter={handleFilter}
            />
            <FilterBtn
              text="bridge"
              activeFilter={activeFilter}
              onFilter={handleFilter}
            />
          </ul>
          {activeFilter === "swap" ? (
            <button
              onClick={() => {
                open({ view: "Networks" });
              }}
            >
              {chain?.name || 'Polygon'}
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="relative w-full flex flex-col gap-2 mt-4 mb-2">
          <ExchangeItem
            activeFilter={activeFilter}
            type="Send"
            amount={parseFloat(sendAmount)}
            selectedToken={sendToken}
            options={SEND_TOKENS[activeFilter === "swap" ? network : "bridge"]}
            network={network}
            tokenChangeHandler={changeSendToken}
            tokensMetaData={COINS_INFO}
            updateAmountHandler={updateSendAmount}
            doUpdateAmount={true}
            maxHandler={handleSendMax}
          />

          {activeFilter === "bridge" ? (
            <div
              onClick={handleSwitch}
              className={`${network === "ethereum" ? "bg-blue-300" : "bg-purple-300"
                } absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[32px] h-[32px] rounded-[12px] flex items-center justify-center cursor-pointer`}
            >
              <img src={SwapVert} alt="swap vertical" />
            </div>
          ) : (
            <></>
          )}
          {
            <ExchangeItem
              activeFilter={activeFilter}
              type="Receive"
              amount={parseFloat(receiveAmount)}
              selectedToken={receiveToken}
              options={
                RECEIVE_TOKENS[activeFilter === "swap" ? network : "bridge"]?.[sendToken]
              }
              tokensMetaData={COINS_INFO}
              tokenChangeHandler={changeReceiveToken}
              updateAmountHandler={updateReceiveAmount}
              doUpdateAmount={false}
              network={
                activeFilter === "swap"
                  ? network
                  : network === "ethereum"
                    ? "polygon"
                    : "ethereum"
              }
              maxHandler={null}
            />
          }
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              isConnected ? requestSwap(true) : open({ view: "Connect" });
            }}
            className={`${network} border w-full py-3 rounded-lg disabled:opacity-50 disabled:text-black`}
            disabled={
              !isConnected || (sendAmount > 0 && sendToken && receiveToken)
                ? false
                : true
            }
            title={
              !isConnected || (sendAmount > 0 && sendToken && receiveToken)
                ? ""
                : "Please make sure to select tokens and enter send amount"
            }
          >
            <p className="font-mainSemibold text-white">
              {isConnected
                ? activeFilter === "Swap"
                  ? "Swap"
                  : "Bridge"
                : "Connect Wallet!!!"}
            </p>
          </button>
        </div>

        <div className="flex items-center mt-4">
          <p className="mx-auto font-mainRegular text-sm text-textSecondary text-center">
            Powered by Silver Token
          </p>
          <a
            href="http://silvertoken.com/widget-help"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.625 11.25C8.625 11.3736 8.58835 11.4945 8.51967 11.5972C8.451 11.7 8.35338 11.7801 8.23918 11.8274C8.12498 11.8747 7.99931 11.8871 7.87807 11.863C7.75683 11.8389 7.64547 11.7794 7.55806 11.6919C7.47065 11.6045 7.41113 11.4932 7.38701 11.3719C7.3629 11.2507 7.37527 11.125 7.42258 11.0108C7.46988 10.8966 7.54999 10.799 7.65277 10.7303C7.75555 10.6617 7.87639 10.625 8 10.625C8.16576 10.625 8.32473 10.6908 8.44195 10.8081C8.55916 10.9253 8.625 11.0842 8.625 11.25ZM8 4.625C6.6875 4.625 5.625 5.57812 5.625 6.75V7C5.625 7.09946 5.66451 7.19484 5.73484 7.26516C5.80516 7.33549 5.90055 7.375 6 7.375C6.09946 7.375 6.19484 7.33549 6.26517 7.26516C6.33549 7.19484 6.375 7.09946 6.375 7V6.75C6.375 5.99187 7.10375 5.375 8 5.375C8.89625 5.375 9.625 5.99187 9.625 6.75C9.625 7.50813 8.89625 8.125 8 8.125C7.90055 8.125 7.80516 8.16451 7.73484 8.23483C7.66451 8.30516 7.625 8.40054 7.625 8.5V9C7.625 9.09946 7.66451 9.19484 7.73484 9.26517C7.80516 9.33549 7.90055 9.375 8 9.375C8.09946 9.375 8.19484 9.33549 8.26517 9.26517C8.33549 9.19484 8.375 9.09946 8.375 9V8.84875C9.50688 8.6875 10.375 7.8075 10.375 6.75C10.375 5.57812 9.3125 4.625 8 4.625ZM14.375 8C14.375 9.26086 14.0011 10.4934 13.3006 11.5418C12.6001 12.5901 11.6045 13.4072 10.4396 13.8897C9.27473 14.3722 7.99293 14.4985 6.7563 14.2525C5.51967 14.0065 4.38376 13.3994 3.4922 12.5078C2.60064 11.6162 1.99348 10.4803 1.7475 9.2437C1.50152 8.00707 1.62776 6.72527 2.11027 5.56039C2.59278 4.39551 3.40988 3.39988 4.45824 2.69938C5.50661 1.99889 6.73915 1.625 8 1.625C9.69015 1.62698 11.3105 2.29927 12.5056 3.49439C13.7007 4.6895 14.373 6.30985 14.375 8ZM13.625 8C13.625 6.88748 13.2951 5.79994 12.677 4.87492C12.0589 3.94989 11.1804 3.22892 10.1526 2.80318C9.12476 2.37743 7.99376 2.26604 6.90262 2.48308C5.81148 2.70012 4.8092 3.23585 4.02253 4.02252C3.23586 4.80919 2.70013 5.81147 2.48309 6.90262C2.26604 7.99376 2.37744 9.12476 2.80318 10.1526C3.22892 11.1804 3.94989 12.0589 4.87492 12.677C5.79995 13.2951 6.88748 13.625 8 13.625C9.49134 13.6233 10.9211 13.0302 11.9757 11.9756C13.0302 10.9211 13.6233 9.49134 13.625 8Z"
                fill="black"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
