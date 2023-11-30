import ETHCoin from "./assets/images/coins/ethereum.svg";
import PolygonCoin from "./assets/images/coins/polygon.svg";
import SLVTCoin from "./assets/images/coins/SLVT.svg";
import USDCCoin from "./assets/images/coins/USDC.svg";
import USDC2Coin from "./assets/images/coins/USDC2.svg";
import SLVDCoin from "./assets/images/coins/SLVD.svg";
import MATICCoin from "./assets/images/coins/MATIC.svg";

export const BLOCKCHAIN_INFO = {
  ethereum: {
    tokens: {
      slvt: {
        address: "0x652594082f97392a1703D80985Ab575085f34a4e",
        decimals: 8,
        symbol: "SLVT",
        image: SLVTCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverToken.svg",
      },
      slvd: {
        address: "0xdba8e8021fe321af91fc3a08e223ef15908cb2bb",
        decimals: 8,
        symbol: "SLVD",
        image: SLVDCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverDollar.svg",
      },
      usdc: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        symbol: "USDC",
        image: USDCCoin,
        imageUrl: null,
      },
      weth: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
        symbol: "WETH",
        image: ETHCoin,
      },
    },
    pools: {
      slvt_usdc_10000: "0x72ed3F74a0053aD35b0fc8E4E920568Ca22781a8",
    },
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: 1,
    usdcSlvtSwapAddress: "0x1DfF5977A51E4Fd5916c05Ad086650eA43305C9a",
  },
  polygon: {
    tokens: {
      slvt: {
        address: "0x652594082f97392a1703D80985Ab575085f34a4e",
        decimals: 8,
        symbol: "SLVT",
        image: SLVTCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverToken.svg",
      },
      slvd: {
        address: "0xdba8e8021fe321af91fc3a08e223ef15908cb2bb",
        decimals: 8,
        symbol: "SLVD",
        image: SLVDCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverDollar.svg",
      },
      usdc: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: 6,
        symbol: "USDC",
        image: USDCCoin,
        imageUrl: null,
      },
    },
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: 137,
    usdcSlvtSwapAddress: "0x1DfF5977A51E4Fd5916c05Ad086650eA43305C9a",
  },
  1: {
    tokens: {
      slvt: {
        address: "0x652594082f97392a1703D80985Ab575085f34a4e",
        decimals: 8,
        symbol: "SLVT",
        image: SLVTCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverToken.svg",
      },
      slvd: {
        address: "0xdba8e8021fe321af91fc3a08e223ef15908cb2bb",
        decimals: 8,
        symbol: "SLVD",
        image: SLVDCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverDollar.svg",
      },
      usdc: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        symbol: "USDC",
        image: USDCCoin,
        imageUrl: null,
      },
      weth: {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
        symbol: "WETH",
        image: ETHCoin,
      },
    },
    pools: {
      slvt_usdc_10000: "0x72ed3F74a0053aD35b0fc8E4E920568Ca22781a8",
    },
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: 1,
    usdcSlvtSwapAddress: "0x1DfF5977A51E4Fd5916c05Ad086650eA43305C9a",
  },
  137: {
    tokens: {
      slvt: {
        address: "0x652594082f97392a1703D80985Ab575085f34a4e",
        decimals: 8,
        symbol: "SLVT",
        image: SLVTCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverToken.svg",
      },
      slvd: {
        address: "0xdba8e8021fe321af91fc3a08e223ef15908cb2bb",
        decimals: 8,
        symbol: "SLVD",
        image: SLVDCoin,
        imageUrl:
          "https://raw.githubusercontent.com/SylTi/contract-metadata/silvertoken/images/SilverDollar.svg",
      },
      usdc: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: 6,
        symbol: "USDC",
        image: USDCCoin,
        imageUrl: null,
      },
    },
    swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    chainId: 137,
    usdcSlvtSwapAddress: "0x1DfF5977A51E4Fd5916c05Ad086650eA43305C9a",
  },
};

export const COINS_INFO = {
  slvt: {
    name: "Silver Token",
    symbol: "SLVT",
    image: SLVTCoin,
    disabled: false,
  },
  usdc: { name: "USD Coin", symbol: "USDC", image: USDCCoin, disabled: false },
  slvd: {
    name: "Silver Dollar",
    symbol: "SLVD",
    image: SLVDCoin,
    disaabled: false,
  },
  weth: {
    name: "Ethereum (Wrapped)",
    symbol: "WETH",
    image: ETHCoin,
    disabled: true,
  },
};
