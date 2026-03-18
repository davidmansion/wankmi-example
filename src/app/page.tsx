import { ClientOnly } from '@/components/ClientOnly'
import { WalletDemo } from '@/components/demos/WalletDemo'

export default function WalletPage() {
  return <ClientOnly><WalletDemo /></ClientOnly>
}
