'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider, SuiClientProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from '@mysten/sui/client';
import { useState } from 'react';

// Create network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },  
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure QueryClient is not recreated on every render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          autoConnect
          preferredWallets={['slush']}
          slushWallet={{
            name: 'NFTer'
          }}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
} 