import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exercises/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/exercises/$id"!</div>;
}
