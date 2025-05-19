'use client';

import { WalletDetails } from '../../components/WalletDetails';

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wallet Details</h1>
      <WalletDetails />
    </div>
  );
} 