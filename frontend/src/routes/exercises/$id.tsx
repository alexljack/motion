import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exercises/$id")({
  component: ExerciseView,
});

function ExerciseView() {
  return <div>Hello "/exercises/$id"!</div>;
}

export default ExerciseView;
