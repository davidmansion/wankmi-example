import { ClientOnly } from '@/components/ClientOnly'
import { SendDemo } from '@/components/demos/SendDemo'

export default function SendPage() {
  return <ClientOnly><SendDemo /></ClientOnly>
}
