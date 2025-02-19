import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workouts/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workouts/$id"!</div>
}
