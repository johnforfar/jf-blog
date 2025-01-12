import React, { useEffect, useRef } from 'react'
import { elements } from '@code-wallet/elements'

interface CodeWalletProps {
  amount: number
}

export const CodeWallet: React.FC<CodeWalletProps> = ({ amount }) => {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) return

    const { button } = elements.create('button', {
      currency: 'usd',
      destination: process.env.NEXT_PUBLIC_CODE_WALLET_ADDRESS!,
      amount: amount,
    })

    if (!button) return
    button.mount(el.current)

    return () => button?.unmount()
  }, [amount])

  return <div ref={el} className="code-wallet-container" />
}