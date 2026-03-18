interface PageHeaderProps {
  hook: string
  also?: string
  description: string
}

export function PageHeader({ hook, also, description }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <h1 className="hook-title">{hook}</h1>
        {also && (
          <span style={{ fontSize: '11px', color: 'var(--dim)' }}>+ {also}</span>
        )}
      </div>
      <p className="hook-desc">{description}</p>
    </div>
  )
}
