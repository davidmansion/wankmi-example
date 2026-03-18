'use client'

import { PhantomAdapter, BackpackAdapter, SolflareAdapter } from '@wankmi/wankmi/adapters'
import type { WankmiConfig } from '@wankmi/wankmi'

export const wallets = [
  new PhantomAdapter(),
  new BackpackAdapter(),
  new SolflareAdapter(),
]

export const wankmiConfig: WankmiConfig = {
  network: 'devnet',
  wallets,
  autoConnect: false,
  staleTime: 30_000,
  commitment: 'confirmed',
}
