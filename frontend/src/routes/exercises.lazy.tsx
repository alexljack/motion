import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/exercises")({
  component: Exercises,
});

function Exercises() {
  return <div className="p-2">Hello from About!</div>;
}
