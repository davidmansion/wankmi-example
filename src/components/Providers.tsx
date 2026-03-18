'use client'

import { WankmiProvider } from '@wankmi/wankmi'
import { PhantomAdapter, BackpackAdapter, SolflareAdapter } from '@wankmi/wankmi/adapters'
import { Shell } from '@/components/Shell'
import type { WankmiConfig } from '@wankmi/wankmi'

const config: WankmiConfig = {
  network: 'devnet',
  wallets: [new PhantomAdapter(), new BackpackAdapter(), new SolflareAdapter()],
  autoConnect: false,
  staleTime: 30_000,
  commitment: 'confirmed',
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WankmiProvider config={config}>
      <Shell>{children}</Shell>
    </WankmiProvider>
  )
}
