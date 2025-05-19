'use client';

import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet';
import { Button } from './ui/button';

interface ConnectButtonProps {
  connecting: boolean;
  connected: boolean;
  disconnect: () => void;
}

export function WalletConnect() {
  const account = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  const isSlushWallet = currentWallet?.name === SLUSH_WALLET_NAME;

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
            {isSlushWallet && <span className="ml-2 text-xs text-blue-500">(Slush)</span>}
          </span>
          <ConnectButton className="!bg-blue-600 hover:!bg-blue-700" />
        </div>
      ) : (
        <ConnectButton>
          {({ connecting, connected, disconnect }: ConnectButtonProps) => (
            <Button 
              variant="outline" 
              onClick={connected ? disconnect : undefined}
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet'}
            </Button>
          )}
        </ConnectButton>
      )}
    </div>
  );
} 