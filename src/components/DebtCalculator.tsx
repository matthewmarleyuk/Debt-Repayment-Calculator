import React, { useState, useCallback } from 'react';
import { PlusCircle, MinusCircle, Calculator, HelpCircle, ArrowDownCircle } from 'lucide-react';
import { DebtEntry } from './DebtEntry';
import { ResultsDisplay } from './ResultsDisplay';
import { calculateRepayment, type Debt, type RepaymentStrategy } from '../utils/calculations';

const DEFAULT_DEBT: Debt = {
  id: Date.now(),
  name: '',
  principal: 0,
  interestRate: 0,
  minimumPayment: 0
};

export function DebtCalculator() {
  const [debts, setDebts] = useState<Debt[]>([{ ...DEFAULT_DEBT }]);
  const [strategy, setStrategy] = useState<RepaymentStrategy>('snowball');
  const [extraPayment, setExtraPayment] = useState(0);
  const [oneTimePayment, setOneTimePayment] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const addDebt = useCallback(() => {
    setDebts(prev => [...prev, { ...DEFAULT_DEBT, id: Date.now() }]);
  }, []);

  const removeDebt = useCallback((id: number) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  }, []);

  const updateDebt = useCallback((id: number, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  }, []);

  const calculateResults = useCallback(() => {
    try {
      setError('');
      const validDebts = debts.filter(debt => 
        debt.principal > 0 && debt.interestRate >= 0 && debt.minimumPayment > 0
      );

      if (validDebts.length === 0) {
        throw new Error('Please add at least one valid debt.');
      }

      const results = calculateRepayment(validDebts, strategy, extraPayment, oneTimePayment);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [debts, strategy, extraPayment, oneTimePayment]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Debt Repayment Calculator
          </h1>
          <button
            onClick={() => window.open('https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt', '_blank')}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="Help information"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {debts.map((debt, index) => (
            <DebtEntry
              key={debt.id}
              debt={debt}
              onUpdate={(updates) => updateDebt(debt.id, updates)}
              onRemove={() => removeDebt(debt.id)}
              canRemove={debts.length > 1}
              index={index}
            />
          ))}

          <button
            onClick={addDebt}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add Another Debt
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Repayment Strategy</span>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as RepaymentStrategy)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="snowball">Debt Snowball (Smallest Balance First)</option>
                <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                <option value="custom">Custom Order (As Entered)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Monthly Extra Payment (£)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">One-Time Extra Payment (£)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={oneTimePayment}
                onChange={(e) => setOneTimePayment(Math.max(0, Number(e.target.value)))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex flex-col justify-end">
            {error && (
              <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg" role="alert">
                {error}
              </div>
            )}
            <button
              onClick={calculateResults}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Repayment Plan
            </button>
          </div>
        </div>
      </div>

      {results && <ResultsDisplay results={results} />}

      <div className="text-sm text-gray-500 mt-6">
        <p>* This calculator provides estimates only and should not be considered financial advice.</p>
        <p>* All calculations assume fixed interest rates and regular payments.</p>
      </div>
    </div>
  );
}