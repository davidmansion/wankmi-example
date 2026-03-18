'use client'

import { useState } from 'react'
import { useWallet, useSignMessage } from '@wankmi/wankmi'
import { PageHeader } from '@/components/PageHeader'
import { CodeBlock } from '@/components/CodeBlock'

const CODE = `import { useSignMessage } from '@wankmi/wankmi'

function SignDemo() {
  const { signMessage, result, isLoading, error, reset, status } = useSignMessage()

  const handleSign = async () => {
    // Pass a string or Uint8Array — hook handles encoding
    const { signatureBase58, signature } = await signMessage('Sign in to wankmi')
    // Send signatureBase58 to your backend for SIWS verification
  }

  return (
    <div>
      <button onClick={handleSign} disabled={isLoading}>
        {isLoading ? 'Awaiting signature...' : 'Sign message'}
      </button>
      {result && <p>{result.signatureBase58}</p>}
    </div>
  )
}`

export function SignDemo() {
  const { connected } = useWallet()
  const { signMessage, result, isLoading, error, reset, status } = useSignMessage()
  const [message, setMessage] = useState('Sign in to wankmi 🟢')

  const handleSign = async () => {
    try { await signMessage(message) } catch { /* error in hook state */ }
  }

  return (
    <div className="fade-up">
      <PageHeader hook="useSignMessage"
        description="Sign arbitrary messages with the connected wallet. Returns the raw signature and a base58-encoded string for backend verification." />

      <div style={{ marginBottom: '28px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>live demo</div>
        <div className="card">
          {!connected && (
            <div className="badge badge-yellow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              Connect a wallet to sign a message
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>message</div>
            <textarea className="input" value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={isLoading || status === 'signed'} />
          </div>

          {error && <div className="error-box" style={{ marginBottom: '12px' }}>{error.message}</div>}

          {result && status === 'signed' && (
            <div className="fade-up" style={{ marginBottom: '14px' }}>
              <div style={{ marginBottom: '10px' }}>
                <span className="badge badge-green">
                  <span className="dot" style={{ background: 'var(--green)' }} />
                  signed
                </span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                {[
                  { k: 'status', v: status },
                  { k: 'signature.length', v: result.signature.length + ' bytes' },
                  { k: 'signatureBase58', v: result.signatureBase58.slice(0, 24) + '...' },
                ].map(({ k, v }) => (
                  <div className="card-row" key={k}>
                    <span className="card-key">{k}</span>
                    <span className="card-val" title={result.signatureBase58}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '6px' }}>full signature (base58)</div>
              <div style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '5px',
                padding: '10px 12px', fontSize: '10px', color: 'var(--text)',
                wordBreak: 'break-all', lineHeight: 1.8,
              }}>
                {result.signatureBase58}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            {status !== 'signed' ? (
              <button className="btn btn-primary" onClick={handleSign}
                disabled={!connected || isLoading || !message.trim()}>
                {isLoading ? <><span className="spinner" />awaiting signature...</> : 'sign message'}
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={reset}>sign again</button>
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
