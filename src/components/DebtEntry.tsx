import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Debt } from '../utils/calculations';

interface DebtEntryProps {
  debt: Debt;
  onUpdate: (updates: Partial<Debt>) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
}

export function DebtEntry({ debt, onUpdate, onRemove, canRemove, index }: DebtEntryProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Debt #{index + 1}</h3>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 transition-colors"
            aria-label="Remove debt"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700">Debt Name</span>
          <input
            type="text"
            value={debt.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Credit Card"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Principal Amount (£)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={debt.principal || ''}
            onChange={(e) => onUpdate({ principal: Math.max(0, Number(e.target.value)) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Annual Interest Rate (%)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={debt.interestRate || ''}
            onChange={(e) => onUpdate({ interestRate: Math.max(0, Number(e.target.value)) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Minimum Monthly Payment (£)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={debt.minimumPayment || ''}
            onChange={(e) => onUpdate({ minimumPayment: Math.max(0, Number(e.target.value)) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
}