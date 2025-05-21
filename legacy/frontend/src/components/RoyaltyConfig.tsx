import React, { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';

interface RoyaltyConfigProps {
  onRoyaltyChange: (recipients: string[], percentages: number[]) => void;
}

export const RoyaltyConfig: React.FC<RoyaltyConfigProps> = ({ onRoyaltyChange }) => {
  const { address } = useWallet();
  const [recipients, setRecipients] = useState<string[]>([address || '']);
  const [percentages, setPercentages] = useState<number[]>([5]); // Default 5%

  const handleAddRecipient = () => {
    setRecipients([...recipients, '']);
    setPercentages([...percentages, 0]);
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    const newPercentages = percentages.filter((_, i) => i !== index);
    setRecipients(newRecipients);
    setPercentages(newPercentages);
    onRoyaltyChange(newRecipients, newPercentages);
  };

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
    onRoyaltyChange(newRecipients, percentages);
  };

  const handlePercentageChange = (index: number, value: number) => {
    const newPercentages = [...percentages];
    newPercentages[index] = value;
    setPercentages(newPercentages);
    onRoyaltyChange(recipients, newPercentages);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Royalty Configuration</h3>
      <p className="text-sm text-gray-600">
        Set up royalty recipients and their percentages. For the hackathon, we'll use the first recipient.
      </p>
      
      {recipients.map((recipient, index) => (
        <div key={index} className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block  text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => handleRecipientChange(index, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0x..."
            />
          </div>
          <div className="w-32">
            <label className="block  text-gray-700">
              Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={percentages[index]}
              onChange={(e) => handlePercentageChange(index, Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {index > 0 && (
            <button
              onClick={() => handleRemoveRecipient(index)}
              className="mt-6 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={handleAddRecipient}
        className="inline-flex items-center px-4 py-2 border border-transparent  rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Recipient
      </button>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className=" text-gray-700">Current Configuration</h4>
        <p className="text-sm text-gray-600 mt-1">
          Primary Recipient: {recipients[0]}
        </p>
        <p className="text-sm text-gray-600">
          Royalty Percentage: {percentages[0]}%
        </p>
      </div>
    </div>
  );
}; 