import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exercises')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/exercises/"!</div>
}
