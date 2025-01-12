import React, { useState } from 'react'
import { CodeWallet } from './CodeWallet'

interface SliderTipsProps {
  defaultAmount?: number
  minAmount?: number
  maxAmount?: number
}

export const SliderTips: React.FC<SliderTipsProps> = ({
  defaultAmount = 1.00,
  minAmount = 0.10,
  maxAmount = 10.00
}) => {
  const [amount, setAmount] = useState(defaultAmount)
  const [showCodeWallet, setShowCodeWallet] = useState(false)

  return (
    <div className="my-6 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:flex-1 space-y-2">
          <div className="flex justify-between">
            <label htmlFor="tip-amount" className="text-sm font-medium">
              Tip Amount (USD)
            </label>
            <span className="text-sm font-medium">${amount.toFixed(2)}</span>
          </div>
          <input
            type="range"
            id="tip-amount"
            min={minAmount}
            max={maxAmount}
            step="0.10"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={showCodeWallet}
          />
        </div>
        <div className="w-[222px] h-[60px] flex-shrink-0">
          {!showCodeWallet ? (
            <button
              onClick={() => setShowCodeWallet(true)}
              className="w-full h-full bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Confirm ${amount.toFixed(2)} tip
            </button>
          ) : (
            <CodeWallet amount={amount} />
          )}
        </div>
      </div>
    </div>
  )
}