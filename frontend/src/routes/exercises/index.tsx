import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Exercise, useListExercises } from "../../api/use-list-exercises";

export const Route = createFileRoute("/exercises/")({
  beforeLoad: async ({ location }) => {
    const user = localStorage.getItem("user");

    if (!user) {
      throw redirect({
        to: "/auth",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  component: ExerciseIndex,
});

function ExerciseIndex() {
  const { data } = useListExercises();

  return (
    <div>
      <div>Exercises</div>
      <div className="grid grid-cols-3">
        {data?.map((exercise: Exercise) => {
          console.log(exercise);
          return (
            <Link to="/exercises/$id" params={{ id: exercise._id }}>
              <div
                className="h-12 border bg-orange-500 text-center content-center cursor-pointer"
                key={exercise._id}
              >
                {exercise.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ExerciseIndex;
