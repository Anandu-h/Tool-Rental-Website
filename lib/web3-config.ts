import { createConfig, http } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id"

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "ToolChain",
      appLogoUrl: "https://toolchain.example.com/logo.png",
    }),
    walletConnect({
      projectId,
      metadata: {
        name: "ToolChain",
        description: "Decentralized Tool Rental Platform",
        url: "https://toolchain.example.com",
        icons: ["https://toolchain.example.com/logo.png"],
      },
    }),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
