'use client'

import { useWallet, useConnection } from '@wankmi/wankmi'
import { PageHeader } from '@/components/PageHeader'
import { CodeBlock } from '@/components/CodeBlock'

const SETUP_CODE = `import { WankmiProvider } from '@wankmi/wankmi'
import { PhantomAdapter, BackpackAdapter, SolflareAdapter } from '@wankmi/wankmi/adapters'

const config = {
  network: 'devnet',
  wallets: [new PhantomAdapter(), new BackpackAdapter(), new SolflareAdapter()],
}

function App() {
  return (
    <WankmiProvider config={config}>
      <YourApp />
    </WankmiProvider>
  )
}`

const HOOK_CODE = `import { useWallet, useConnection } from '@wankmi/wankmi'

function MyComponent() {
  const { wallets, connected, connecting, publicKey, select, connect, disconnect } = useWallet()
  const { connection, network } = useConnection()

  if (!connected) {
    return wallets.map(w => (
      <button key={w.name} onClick={() => { select(w.name); connect() }}>
        Connect {w.name}
      </button>
    ))
  }

  return (
    <div>
      <p>{publicKey?.toBase58()}</p>
      <p>{network} · {connection.rpcEndpoint}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}`

export function WalletDemo() {
  const { wallets, connected, connecting, publicKey, select, connect, disconnect, wallet } = useWallet()
  const { connection, network } = useConnection()

  const handleConnect = (name: string) => {
    select(name)
    setTimeout(() => connect(), 0)
  }

  return (
    <div className="fade-up">
      <PageHeader hook="useWallet" also="useConnection"
        description="Connect to Solana wallets and access the active connection. Supports Phantom, Backpack, and Solflare on devnet." />

      <div style={{ marginBottom: '28px' }}>
        <div className="label" style={{ marginBottom: '10px' }}>live demo</div>
        <div className="card">
          {!connected ? (
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>Select a wallet to connect</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {wallets.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>No wallets registered.</div>
                )}
                {wallets.map((w) => (
                  <button key={w.name} className="wallet-btn" onClick={() => handleConnect(w.name)} disabled={connecting}>
                    <div className="wallet-icon">
                      <img src={w.icon} alt={w.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <span>{w.name}</span>
                    {connecting && wallet?.name === w.name && <span className="spinner" style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="badge badge-green">
                  <span className="dot" style={{ background: 'var(--green)' }} />
                  connected · {wallet?.name}
                </span>
                <button className="btn btn-danger" onClick={disconnect} style={{ fontSize: '10px', padding: '4px 10px' }}>disconnect</button>
              </div>
              <div>
                {[
                  { k: 'publicKey', v: publicKey?.toBase58() ?? '—' },
                  { k: 'connected', v: 'true' },
                  { k: 'network', v: network },
                  { k: 'connection.rpcEndpoint', v: connection.rpcEndpoint },
                  { k: 'commitment', v: String(connection.commitment) },
                ].map(({ k, v }) => (
                  <div className="card-row" key={k}>
                    <span className="card-key">{k}</span>
                    <span className="card-val" title={v}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="label" style={{ marginBottom: '2px' }}>setup</div>
        <CodeBlock code={SETUP_CODE} />
        <div className="label" style={{ marginBottom: '2px', marginTop: '8px' }}>usage</div>
        <CodeBlock code={HOOK_CODE} />
      </div>
    </div>
  )
}
