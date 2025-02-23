import { createFileRoute, Link } from "@tanstack/react-router";
import { Exercise, useListExercises } from "../../api/use-list-exercises";

export const Route = createFileRoute("/exercises/")({
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
