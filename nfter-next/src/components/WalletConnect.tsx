'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
// import { SLUSH_WALLET_NAME } from '@mysten/slush-wallet';
import { NetworkSwitcher } from './NetworkSwitcher'; // Assuming this component is appropriately styled or compact

export function WalletConnect() {
  const account = useCurrentAccount();
  // const { currentWallet } = useCurrentWallet();
  // const isSlushWallet = currentWallet?.name === SLUSH_WALLET_NAME;
  // const { data: chainId } = useSuiClientQuery('getChainIdentifier');

  // User's original class for ConnectButton to maintain consistent styling
  const connectButtonClassName = "!bg-blue-600 hover:!bg-blue-700";

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex flex-col sm:flex-row items-center gap-2">        
          <NetworkSwitcher />
          <ConnectButton className={connectButtonClassName} />
        </div>
      ) : (
        <ConnectButton className={connectButtonClassName} />
      )}
    </div>
  );
}