'use client';

import { useCurrentAccount, useCurrentWallet, useSuiClientQuery, useSuiClientContext, ConnectButton } from '@mysten/dapp-kit';
import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getFaucetHost, requestSuiFromFaucetV2 } from '@mysten/sui/faucet';
import { useState } from 'react';
import { toast } from 'sonner';

function NetworkSelector() {
  const ctx = useSuiClientContext();
  const currentNetwork = ctx.network;

  return (
    <div className="flex flex-col gap-2">
      <h3 className=" text-muted-foreground">Select Network</h3>
      <div className="flex gap-2">
        {Object.keys(ctx.networks).map((network) => (
          <Button
            key={network}
            variant={currentNetwork === network ? "default" : "outline"}
            size="sm"
            onClick={() => ctx.selectNetwork(network)}
          >
            {network}
          </Button>
        ))}
      </div>
    </div>
  );
}

function FaucetRequest() {
  const account = useCurrentAccount();
  const { network: currentNetwork } = useSuiClientContext();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    if (!account) return;
    
    try {
      setIsRequesting(true);
      await requestSuiFromFaucetV2({
        host: getFaucetHost(currentNetwork as 'testnet'),
        recipient: account.address,
      });
      toast.success('Successfully requested SUI from faucet');
    } catch (error) {
      console.error('Failed to request from faucet:', error);
      toast.error('Failed to request SUI from faucet');
    } finally {
      setIsRequesting(false);
    }
  };

  // Only show faucet for testnet
  if (!['testnet'].includes(currentNetwork)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className=" text-muted-foreground">Request Test SUI</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRequest}
        disabled={isRequesting}
      >
        {isRequesting ? 'Requesting...' : 'Request from Faucet'}
      </Button>
    </div>
  );
}

export function WalletDetails() {
  const account = useCurrentAccount();
  const { currentWallet } = useCurrentWallet();
  const { network: currentNetwork } = useSuiClientContext();
  const isSlushWallet = currentWallet?.name === SLUSH_WALLET_NAME;

  // Get detailed network info
  const { data: chainId } = useSuiClientQuery('getChainIdentifier');
  const { data: balance } = useSuiClientQuery('getBalance', {
    owner: account?.address || '',
  });

  const networkName = currentNetwork || 'Unknown Network';

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Not Connected</CardTitle>
          <CardDescription>Connect your wallet to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
          <CardDescription>Details about your connected wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className=" text-muted-foreground">Address</h3>
              <p className="text-sm">{account.address}</p>
            </div>
            <div>
              <h3 className=" text-muted-foreground">Wallet Type</h3>
              <p className="text-sm">{currentWallet?.name || 'Unknown'}</p>
            </div>
            <div>
              <h3 className=" text-muted-foreground">Is Slush Wallet</h3>
              <p className="text-sm">{isSlushWallet ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h3 className=" text-muted-foreground">Current Network</h3>
              <p className="text-sm">{networkName}</p>
            </div>
            <div>
              <h3 className=" text-muted-foreground">Chain ID</h3>
              <p className="text-sm">{String(chainId || 'Unknown')}</p>
            </div>
            <div>
              <h3 className=" text-muted-foreground">Balance</h3>
              <p className="text-sm">
                {balance ? `${Number(balance.totalBalance) / 1e9} SUI` : 'Loading...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Selection</CardTitle>
          <CardDescription>Switch between available networks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NetworkSelector />
          <FaucetRequest />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Actions</CardTitle>
          <CardDescription>Available actions for your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 