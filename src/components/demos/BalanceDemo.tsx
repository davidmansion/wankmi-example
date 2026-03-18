'use client'

import { useState } from 'react'
import { useWallet, useSolBalance } from '@wankmi/wankmi'
import { PublicKey } from '@solana/web3.js'
import { PageHeader } from '@/components/PageHeader'
import { CodeBlock } from '@/components/CodeBlock'

function isValidPublicKey(addr: string) {
  try { new PublicKey(addr); return true } catch { return false }
}

const CODE = `import { useSolBalance, useWallet } from '@wankmi/wankmi'

function BalanceDisplay() {
  const { publicKey } = useWallet()
  const { data: balance, isLoading, isError, refetch } = useSolBalance({
    address: publicKey,
    watch: true, // subscribe to on-chain changes via WebSocket
  })

  if (isLoading) return <span>Loading...</span>
  if (isError)   return <span>Error fetching balance</span>

  return (
    <div>
      <p>{balance?.formatted}</p>           // "1.234500 SOL"
      <p>{balance?.sol}</p>                 // 1.2345
      <p>{balance?.lamports.toString()}</p> // 1234500000n
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}`

export function BalanceDemo() {
  const { publicKey, connected } = useWallet()
  const [customAddress, setCustomAddress] = useState('')
  const [lookupAddress, setLookupAddress] = useState<PublicKey | null>(null)

  const targetAddress = lookupAddress ?? publicKey ?? null

  const { data: balance, isLoading, isFetching, isError, error, refetch } = useSolBalance({
    address: targetAddress,
    watch: true,
    enabled: !!targetAddress,
  })

  const handleLookup = () => {
    const addr = customAddress.trim()
    if (!addr) { setLookupAddress(null); return }
    if (isValidPublicKey(addr)) setLookupAddress(new PublicKey(addr))
  }

  return (
    <div className="fade-up">
      <PageHeader hook="useSolBalance"
        description="Fetch and reactively watch the SOL balance of any address. Supports WebSocket subscriptions for instant on-chain updates." />

      <div style={{ marginBottom: '28px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>live demo</div>
        <div className="card">
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>
              address <span style={{ color: 'var(--dim)' }}>(leave blank to use connected wallet)</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input className="input" placeholder="Any Solana address..." value={customAddress}
                onChange={e => setCustomAddress(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()} />
              <button className="btn btn-primary" onClick={handleLookup}>fetch</button>
            </div>
            {customAddress && !isValidPublicKey(customAddress) && (
              <div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '4px' }}>Invalid public key</div>
            )}
          </div>

          {!targetAddress && (
            <div style={{ fontSize: '11px', color: 'var(--dim)' }}>
              {connected ? 'Enter an address or use your connected wallet.' : 'Connect a wallet or enter any address above.'}
            </div>
          )}

          {targetAddress && isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="spinner" />
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Fetching balance...</span>
            </div>
          )}

          {isError && <div className="error-box">{error?.message ?? 'Failed to fetch balance'}</div>}

          {balance && !isLoading && (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-green">
                  <span className="dot" style={{ background: 'var(--green)' }} />
                  {isFetching ? 'syncing' : 'live · watch: true'}
                </span>
                <button className="btn btn-ghost" onClick={() => refetch()} style={{ fontSize: '10px', padding: '4px 10px' }}>refresh</button>
              </div>
              <div>
                {[
                  { k: 'balance.formatted', v: balance.formatted },
                  { k: 'balance.sol', v: balance.sol.toString() },
                  { k: 'balance.lamports', v: balance.lamports.toString() + 'n' },
                  { k: 'address', v: targetAddress?.toBase58().slice(0, 16) + '...' },
                ].map(({ k, v }) => (
                  <div className="card-row" key={k}>
                    <span className="card-key">{k}</span>
                    <span className="card-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="divider" />
      <div className="label" style={{ marginBottom: '10px' }}>usage</div>
      <CodeBlock code={CODE} />
    </div>
  )
}
