'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@wankmi/wankmi'

const NAV = [
  { path: '/',        label: 'useWallet',         sub: 'useConnection' },
  { path: '/balance', label: 'useSolBalance',      sub: '' },
  { path: '/tokens',  label: 'useTokenAccounts',   sub: '' },
  { path: '/send',    label: 'useSendTransaction', sub: '' },
  { path: '/sign',    label: 'useSignMessage',     sub: '' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { connected, publicKey } = useWallet()

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
          <a href="https://wankmi.com" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--bright)', letterSpacing: '-0.02em' }}>wankmi</div>
            <div style={{ fontSize: '10px', color: 'var(--dim)', marginTop: '2px', letterSpacing: '0.08em' }}>EXAMPLE APP</div>
          </a>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="badge badge-yellow" style={{ alignSelf: 'flex-start' }}>
            <span className="dot" style={{ background: 'var(--yellow)' }} />
            devnet
          </span>
          {connected && publicKey && (
            <span className="badge badge-green" style={{ alignSelf: 'flex-start' }}>
              <span className="dot" style={{ background: 'var(--green)' }} />
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
          )}
        </div>

        <div style={{ padding: '12px 0 0' }}>
          <div className="label" style={{ padding: '0 16px', marginBottom: '6px' }}>hooks</div>
          <nav>
            {NAV.map(({ path, label, sub }) => {
              const active = pathname === path
              return (
                <Link key={path} href={path} style={{
                  display: 'block', padding: '7px 16px', textDecoration: 'none',
                  borderLeft: active ? '2px solid var(--bright)' : '2px solid transparent',
                  background: active ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'all 0.12s',
                }}>
                  <div style={{ fontSize: '11.5px', color: active ? 'var(--bright)' : 'var(--muted)', fontWeight: active ? 500 : 400 }}>
                    {label}
                  </div>
                  {sub && <div style={{ fontSize: '10px', color: 'var(--dim)', marginTop: '1px' }}>+ {sub}</div>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="https://wankmi.com" style={{ fontSize: '10px', color: 'var(--dim)', textDecoration: 'none' }}>← wankmi.com</a>
          <a href="https://github.com/wank-mi/wankmi" style={{ fontSize: '10px', color: 'var(--dim)', textDecoration: 'none' }}>GitHub ↗</a>
          <a href="https://www.npmjs.com/package/@wankmi/wankmi" style={{ fontSize: '10px', color: 'var(--dim)', textDecoration: 'none' }}>npm ↗</a>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  )
}
