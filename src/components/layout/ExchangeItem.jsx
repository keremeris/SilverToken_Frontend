import { useState } from "react";
import { SelectBox } from "../select/selectBox";
import ETHCoin from "../../assets/images/coins/ethereum.svg";
import PolygonCoin from "../../assets/images/coins/polygon.svg";
import PropTypes from "prop-types";

ExchangeItem.propTypes = {
  options: PropTypes.array,
  type: PropTypes.string,
  amount: PropTypes.number,
  selectedToken: PropTypes.string,
  activeFilter: PropTypes.string,
  network: PropTypes.string,
  tokenChangeHandler: PropTypes.func,
  tokensMetaData: PropTypes.object,
  updateAmountHandler: PropTypes.func,
  doUpdateAmount: PropTypes.bool,
  maxHandler: PropTypes.func,
};
export function ExchangeItem({
  options,
  type,
  amount,
  selectedToken,
  activeFilter,
  network,
  tokenChangeHandler,
  tokensMetaData,
  updateAmountHandler,
  doUpdateAmount,
  maxHandler,
}) {
  const handleInput = (e) => {
    if (!doUpdateAmount) {
      return;
    }
    console.log("handleInput", typeof e.target.value);
    // Remove non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    updateAmountHandler(numericValue);
  };

  const formttedOptions = options.map((option) => {
    return {
      value: option,
      label: option.toUpperCase(),
      labelImage: tokensMetaData[option].image,
      isDisabled: tokensMetaData[option].disabled,
    };
  });

  const coinImage = network === "polygon" ? PolygonCoin : ETHCoin;
  const networkCapitalized = network
    ? network?.charAt(0)?.toUpperCase() + network?.slice(1)
    : "";

  const handleSelectToken = (exchange) => {
    console.log("handleSelectToken", JSON.stringify(exchange));
    tokenChangeHandler(exchange.value);
  };

  return (
    <div className="flex flex-col gap-2 w-full rounded-lg bg-gray-300 border border-gray-600 p-4">
      <div className="w-full flex items-center justify-between">
        {activeFilter === "swap" ? (
          <>
            <p className="font-mainRegular text-xs text-textSecondary">
              {type}
            </p>
            <p className="font-mainRegular text-xs text-textSecondary">
              {amount}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <p className="font-mainRegular text-xs text-textSecondary">
                {type}
              </p>

              <div className="flex items-center gap-2">
                <img src={coinImage} className="w-full max-w-[18px]" />
                <p>{networkCapitalized} network</p>
              </div>
            </div>
            <p className="font-mainRegular text-xs text-textSecondary">
              {amount}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        <input
          onInput={handleInput}
          value={amount}
          className="w-[100px] border-transparent bg-transparent outline-none placeholder:text-textSecondary text-textPrimary font-mainSemibold text-2xl"
          placeholder="0"
          type="text"
          disabled={!doUpdateAmount}
        />
        {maxHandler ? <button onClick={maxHandler} className={`${network === 'ethereum' ? 'border-blue-900' :  'border-purple-900' } hover:bg-gray-600 font-mainSemibold  text-xs border-2 rounded-3xl  p-1`} title="Exchange the maximum balance of your token.">Max</button> : ""}
        <SelectBox
          selected={
            formttedOptions.filter((value) => value.value === selectedToken)[0]
          }
          options={formttedOptions}
          rounded={true}
          placeholder="Select Token"
          onExchangeFilterChange={handleSelectToken}
        />
      </div>
    </div>
  );
}
