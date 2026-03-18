'use client'

import { useWallet, useConnection, useSendTransaction } from '@wankmi/wankmi'
import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { CodeBlock } from '@/components/CodeBlock'

function isValid(addr: string) { try { new PublicKey(addr); return true } catch { return false } }

const STAGES = ['signing', 'sending', 'confirming', 'confirmed'] as const

const CODE = `import { useSendTransaction, useWallet } from '@wankmi/wankmi'
import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'

function SendSOL() {
  const { publicKey } = useWallet()
  const { sendTransaction, status, signature, isLoading, error, reset } = useSendTransaction()

  const handleSend = async (to: string, sol: number) => {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey(to),
        lamports: BigInt(Math.round(sol * LAMPORTS_PER_SOL)),
      })
    )
    await sendTransaction(tx)
  }

  // status: 'idle' | 'signing' | 'sending' | 'confirming' | 'confirmed' | 'error'
  return (
    <div>
      <button onClick={() => handleSend(recipient, 0.001)} disabled={isLoading}>
        {isLoading ? status : 'Send SOL'}
      </button>
      {signature && (
        <a href={'https://explorer.solana.com/tx/' + signature + '?cluster=devnet'}>
          View on Explorer
        </a>
      )}
    </div>
  )
}`

export function SendDemo() {
  const { publicKey, connected } = useWallet()
  const { sendTransaction, status, signature, isLoading, error, reset } = useSendTransaction()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('0.001')

  const toInvalid = to && !isValid(to)
  const canSend = connected && publicKey && isValid(to) && parseFloat(amount) > 0 && !isLoading
  const stageIndex = STAGES.indexOf(status as typeof STAGES[number])

  const handleSend = async () => {
    if (!publicKey || !canSend) return
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(to),
          lamports: BigInt(Math.round(parseFloat(amount) * LAMPORTS_PER_SOL)),
        })
      )
      await sendTransaction(tx)
    } catch { /* error in hook state */ }
  }

  return (
    <div className="fade-up">
      <PageHeader hook="useSendTransaction"
        description="Build, sign, and send Solana transactions. Automatically fetches a fresh blockhash and tracks the full confirmation lifecycle." />

      <div style={{ marginBottom: '28px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>live demo</div>
        <div className="card">
          {!connected && (
            <div className="badge badge-yellow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              Connect a wallet to send a transaction
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>recipient</div>
              <input className="input" placeholder="Destination address..."
                value={to} onChange={e => setTo(e.target.value)} disabled={isLoading} />
              {toInvalid && <div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '4px' }}>Invalid address</div>}
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>amount (SOL)</div>
              <input className="input" type="number" min="0" step="0.001"
                value={amount} onChange={e => setAmount(e.target.value)} disabled={isLoading} />
            </div>
          </div>

          {status !== 'idle' && (
            <div className="pipeline" style={{ marginBottom: '14px' }}>
              {STAGES.map((stage, i) => (
                <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`pipeline-step ${i < stageIndex ? 'done' : i === stageIndex ? 'active' : ''}`}>
                    {i < stageIndex ? '✓' : i === stageIndex ? <span className="spinner" /> : '○'}
                    <span style={{ marginLeft: '4px' }}>{stage}</span>
                  </div>
                  {i < STAGES.length - 1 && <span className="pipeline-arrow">→</span>}
                </div>
              ))}
            </div>
          )}

          {error && <div className="error-box" style={{ marginBottom: '12px' }}>{error.message}</div>}

          {status === 'confirmed' && signature && (
            <div className="success-box" style={{ marginBottom: '12px' }}>
              <div style={{ marginBottom: '4px' }}>Transaction confirmed ✓</div>
              <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank" rel="noreferrer"
                style={{ color: 'var(--green)', fontSize: '10px', wordBreak: 'break-all' }}>
                {signature.slice(0, 20)}...{signature.slice(-8)} ↗
              </a>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handleSend} disabled={!canSend}>
              {isLoading ? <><span className="spinner" />{status}</> : 'send transaction'}
            </button>
            {(status === 'confirmed' || status === 'error') && (
              <button className="btn btn-ghost" onClick={reset}>reset</button>
            )}
          </div>
        </div>
      </div>

      <hr className="divider" />
      <div className="label" style={{ marginBottom: '10px' }}>usage</div>
      <CodeBlock code={CODE} />
    </div>
  )
}
