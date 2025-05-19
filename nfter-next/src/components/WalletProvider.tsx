'use client';

import { createNetworkConfig, SuiClientProvider, WalletProvider as MystenWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerSlushWallet } from '@mysten/slush-wallet';

// Register Slush wallet
registerSlushWallet('NFTer');

// Create network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <MystenWalletProvider
          autoConnect
          preferredWallets={['slush']}
        >
          {children}
        </MystenWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 