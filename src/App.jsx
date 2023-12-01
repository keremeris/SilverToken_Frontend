// import HomePage from "./components/home";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { polygon, mainnet } from "wagmi/chains";

import { ExchangeLayout } from "./components/layout/ExchangeLayout";

const projectId = "3e361008433517ac47fb085f31fc15dd";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, polygon];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: mainnet });

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="w-full h-screen flex items-center justify-center">
          <ExchangeLayout />
        </div>
      </WagmiConfig>
    </>
  );
}

export default App;
