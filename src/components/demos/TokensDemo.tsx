'use client'

import { useState } from 'react'
import { useWallet, useTokenAccounts } from '@wankmi/wankmi'
import { PublicKey } from '@solana/web3.js'
import { PageHeader } from '@/components/PageHeader'
import { CodeBlock } from '@/components/CodeBlock'

function isValid(addr: string) { try { new PublicKey(addr); return true } catch { return false } }
function shorten(pk: PublicKey, n = 4) { const s = pk.toBase58(); return `${s.slice(0,n)}...${s.slice(-n)}` }

const CODE = `import { useTokenAccounts, useWallet } from '@wankmi/wankmi'

function TokenList() {
  const { publicKey } = useWallet()
  const { data: tokens, isLoading } = useTokenAccounts({
    address: publicKey,
    // mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // optional mint filter
  })

  return (
    <ul>
      {tokens?.map(t => (
        <li key={t.address.toBase58()}>
          {t.mint.toBase58()} — {t.formatted} (decimals: {t.decimals})
        </li>
      ))}
    </ul>
  )
}`

export function TokensDemo() {
  const { publicKey, connected } = useWallet()
  const [customAddress, setCustomAddress] = useState('')
  const [lookupAddress, setLookupAddress] = useState<PublicKey | null>(null)
  const [mintFilter, setMintFilter] = useState('')

  const targetAddress = lookupAddress ?? publicKey ?? null
  const resolvedMint = mintFilter && isValid(mintFilter) ? mintFilter : undefined

  const { data: tokens, isLoading, isError, error, refetch, isFetching } = useTokenAccounts({
    address: targetAddress,
    mint: resolvedMint,
    enabled: !!targetAddress,
  })

  const handleLookup = () => {
    const addr = customAddress.trim()
    if (!addr) { setLookupAddress(null); return }
    if (isValid(addr)) setLookupAddress(new PublicKey(addr))
  }

  return (
    <div className="fade-up">
      <PageHeader hook="useTokenAccounts"
        description="Fetch all SPL token accounts owned by an address. Optionally filter to a specific mint." />

      <div style={{ marginBottom: '28px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>live demo</div>
        <div className="card">
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>
              address <span style={{ color: 'var(--dim)' }}>(leave blank for connected wallet)</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input className="input" placeholder="Owner address..." value={customAddress}
                onChange={e => setCustomAddress(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()} />
              <button className="btn btn-primary" onClick={handleLookup}>fetch</button>
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>
              mint filter <span style={{ color: 'var(--dim)' }}>(optional)</span>
            </div>
            <input className="input" placeholder="Filter by mint address..."
              value={mintFilter} onChange={e => setMintFilter(e.target.value)} />
          </div>

          {!targetAddress && (
            <div style={{ fontSize: '11px', color: 'var(--dim)' }}>
              {connected ? 'Fetching your token accounts...' : 'Connect a wallet or enter an address above.'}
            </div>
          )}

          {targetAddress && isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="spinner" />
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Fetching token accounts...</span>
            </div>
          )}

          {isError && <div className="error-box">{error?.message ?? 'Failed to fetch token accounts'}</div>}

          {tokens && !isLoading && (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-green">
                  <span className="dot" style={{ background: 'var(--green)' }} />
                  {tokens.length} account{tokens.length !== 1 ? 's' : ''}{isFetching ? ' · syncing' : ''}
                </span>
                <button className="btn btn-ghost" onClick={() => refetch()} style={{ fontSize: '10px', padding: '4px 10px' }}>refresh</button>
              </div>

              {tokens.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--dim)' }}>No token accounts found.</div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>mint</th>
                        <th>account</th>
                        <th style={{ textAlign: 'right' }}>amount</th>
                        <th style={{ textAlign: 'right' }}>decimals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((t) => (
                        <tr key={t.address.toBase58()}>
                          <td style={{ color: 'var(--blue)' }}>{shorten(t.mint)}</td>
                          <td style={{ color: 'var(--muted)' }}>{shorten(t.address)}</td>
                          <td style={{ textAlign: 'right' }}>{t.formatted}</td>
                          <td style={{ textAlign: 'right', color: 'var(--muted)' }}>{t.decimals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
