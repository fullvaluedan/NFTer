'use client';

import { useCurrentWallet } from '@mysten/dapp-kit';
import { Button } from './ui/button';
import Link from 'next/link';

export function NetworkSwitcher() {
  const { currentWallet } = useCurrentWallet();

  if (!currentWallet) return null;

  return (
    <Link href="/wallet">
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
      >
        View Wallet Details
      </Button>
    </Link>
  );
} 