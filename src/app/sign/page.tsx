import { ClientOnly } from '@/components/ClientOnly'
import { SignDemo } from '@/components/demos/SignDemo'

export default function SignPage() {
  return <ClientOnly><SignDemo /></ClientOnly>
}
