import React from 'react'

interface CodeWalletProps {
  address?: string
}

export const CodeWallet: React.FC<CodeWalletProps> = ({ address }) => {
  return (
    <div className="code-wallet-container">
      <p>Tip address: {address || 'Default address'}</p>
    </div>
  )
}