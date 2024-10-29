import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BanknoteIcon, Calendar, Percent } from 'lucide-react';

interface ResultsDisplayProps {
  results: {
    totalMonths: number;
    totalInterest: number;
    totalPaid: number;
    monthlyPayments: Array<{
      month: number;
      balance: number;
      interestPaid: number;
      principalPaid: number;
    }>;
  };
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const years = Math.floor(results.totalMonths / 12);
  const months = results.totalMonths % 12;

  const chartData = results.monthlyPayments.map((payment) => ({
    month: payment.month,
    'Remaining Balance': payment.balance,
    'Interest Paid': payment.interestPaid,
    'Principal Paid': payment.principalPaid,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Repayment Summary</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-medium">Time to Pay Off</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {years > 0 ? `${years} years ` : ''}
            {months > 0 ? `${months} months` : ''}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <BanknoteIcon className="w-5 h-5" />
            <h3 className="font-medium">Total Interest</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            £{results.totalInterest.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <Percent className="w-5 h-5" />
            <h3 className="font-medium">Total Amount</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            £{results.totalPaid.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="h-[400px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="Remaining Balance" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="Interest Paid" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="Principal Paid" stroke="#9333ea" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}