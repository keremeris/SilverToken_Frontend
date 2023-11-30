export function WaitForTrade({ txHash, exchange, handleCancel }) {
  let txLink =
    exchange === "ethereum"
      ? "https://polygonscan.com/tx/"
      : "https://etherscan.io/tx/";
  txLink += txHash;

  return (
    <div className="top-1/2 relative h-80 w-80 flex flex-col bg-blue-100  items-center justify-center m-auto rounded-3xl">
      <div>Waiting for transaction ...</div>
      <div>
        <a href={txLink}> {txHash} </a>
      </div>
      <div>
        <button onClick={handleCancel}> Close Box </button>
      </div>
    </div>
  );
}
