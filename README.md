# wankmi-example

Live interactive demos for every [@wankmi/wankmi](https://www.npmjs.com/package/@wankmi/wankmi) hook, running on Solana **devnet**.

**Live at:** https://example.wankmi.com

## Pages

| Route | Hook(s) |
|---|---|
| `/` | `useWallet` + `useConnection` |
| `/balance` | `useSolBalance` |
| `/tokens` | `useTokenAccounts` |
| `/send` | `useSendTransaction` |
| `/sign` | `useSignMessage` |

## Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

You'll need a Solana wallet extension (Phantom, Backpack, or Solflare) to interact with the live demos.

## Build & Deploy to Hostinger (example.wankmi.com)

### 1. Build static export

```bash
npm run build
# Produces: out/
```

### 2. Create subdomain in Hostinger hPanel

- Go to **Domains → Subdomains**
- Create `example.wankmi.com`
- Set document root to `public_html/example.wankmi.com`

### 3. Upload

**Via File Manager:**
Upload the contents of `out/` into `public_html/example.wankmi.com/`

**Via SSH:**
```bash
scp -r out/* user@your-server:~/public_html/example.wankmi.com/
```

### 4. SSL

In hPanel → SSL, install a Let's Encrypt cert for `example.wankmi.com`.

### 5. GitHub Actions (optional CI/CD)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: out/
          target: ~/public_html/example.wankmi.com/
          strip_components: 1
```

## Tech

- **Next.js 14** App Router, static export (`output: 'export'`)
- **@wankmi/wankmi** — real hooks, real devnet RPC calls
- **JetBrains Mono** — monospace throughout
- No mock state — every demo hits the actual Solana devnet
# example-app
# wankmi-example
