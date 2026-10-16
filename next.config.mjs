import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  readingTime: true,
})

// Posts whose slug changed when they moved into Sanity (old solana.blog URL -> new slug).
const RENAMED = [
  ['breakpoint-2024-breakdown', 'solana-breakpoint-2024-breakdown'],
  ['breakpoint-in-amsterdam-is-here', 'breakpoint-2023-in-amsterdam-is-here'],
  ['colosseum-renaissance-hackathon-winners', 'solana-renaissance-hackathon-celebrating-the-winners-and-their-innovations'],
  ['colosseum-solana-hackathon-kicks-off', 'solana-renaissance-hackathon-kick-off'],
  ['comparing-ethereum-evm-to-solana-svm', 'comparing-evm-vs-svm-ecosystems-a-deep-dive-into-ethereum-and-solana'],
  ['firedancer-updates-from-breakpoint', 'firedancer-solanas-performance-beast-unleashed'],
  ['free-solana-development-training-now-at-solhack-com', 'free-solana-development-training-now-solhackcom'],
  ['hivemapper-decentralized-mapping', 'hivemapper-joins-solana-decentralized-mapping-gets-a-boost'],
  ['payments-with-decaf', 'decaf-financial-inclusion-on-solana'],
  ['powerledger-moving-to-solana-based-chain', 'power-ledger-moving-to-solana-based-chain'],
  ['radar-hackathon-winners', 'solana-radar-hackathon-winners-top-projects-of-2024'],
  ['reasons-why-defi-projects-should-build-on-solana-blockchain', '7-reasons-why-defi-projects-will-build-on-solana-blockchain'],
  ['scamlana-reputation-and-security-risks', 'scamlana-reputation-risk-solanas-biggest-scams-of-2024-2025'],
  ['solana-blinks', 'solana-blinks-simplifying-blockchain-interactions-with-solana-actions-and-blinks'],
  ['solana-builders-year-in-review', '2024-in-review-solanas-biggest-wins-for-builders'],
  ['solana-docs-app-paper-and-hardware-sol-wallets', 'inside-the-solana-docs-app-paper-and-hardware-sol-wallets'],
  ['solana-mobile-saga-sold-out', 'solana-mobile-saga-sells-out-a-win-for-builders'],
  ['solana-network-upgrades-quic-stake-weight-qos-fee-markets', 'solana-network-upgrades-quic-stake-weight-qos-amp-fee-markets'],
  ['token-spam-pump-fun', 'token-spam-metaplexs-2024-token-surge-and-pumpfuns-dark-side'],
  ['what-squadx-means-for-multisigs-and-daos', 'what-squadsx-means-for-multisigs-and-daos'],
  ['which-blockchain-will-scale-to-1000000-tps-first', 'poll-which-blockchain-will-scale-to-1000000-tps-first'],
  ['wtf-are-solana-token-extensions', 'solana-token-extensions-programmable-tokens-just-got-real'],
]

export default withNextra({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return RENAMED.map(([from, to]) => ({ source: `/${from}`, destination: `/${to}`, permanent: true }))
  },
})
