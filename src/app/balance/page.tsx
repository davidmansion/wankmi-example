import { ClientOnly } from '@/components/ClientOnly'
import { BalanceDemo } from '@/components/demos/BalanceDemo'

export default function BalancePage() {
  return <ClientOnly><BalanceDemo /></ClientOnly>
}
