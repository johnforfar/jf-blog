import React, { useEffect, useRef } from 'react'
import { elements } from '@code-wallet/elements'

export const CodeWallet: React.FC = () => {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) return

    const button = elements.create('button', {
      currency: 'usd',
      destination: process.env.NEXT_PUBLIC_CODE_WALLET_ADDRESS!,
      amount: Number(process.env.NEXT_PUBLIC_CODE_WALLET_AMOUNT || 0.05),
    }).button

    if (!button) return

    button.mount(el.current)

    return () => button?.unmount()
  }, [])

  return <div ref={el} className="code-wallet-container" />
}