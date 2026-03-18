import { ClientOnly } from '@/components/ClientOnly'
import { TokensDemo } from '@/components/demos/TokensDemo'

export default function TokensPage() {
  return <ClientOnly><TokensDemo /></ClientOnly>
}
