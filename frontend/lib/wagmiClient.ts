import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const rpcUrl =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  'https://eth-sepolia.g.alchemy.com/v2/hrOT4tHWSRwNB5mHC6CDf';

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
  connectors: [
    injected({
      // Rabby injects window.ethereum; shim helps clean disconnect UX
      shimDisconnect: true,
    }),
  ],
  ssr: true,
});
