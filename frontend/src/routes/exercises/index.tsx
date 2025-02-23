import { createFileRoute } from "@tanstack/react-router";
import { Exercise, useListExercises } from "../../api/use-list-exercises";

export const Route = createFileRoute("/exercises/")({
  component: ExerciseIndex,
});

function ExerciseIndex() {
  const { data } = useListExercises();
  return (
    <div>
      Hello "/exercises/"!
      <div>Exercises</div>
      {data?.map((exercise: Exercise) => {
        console.log(exercise);
        return <div key={exercise._id}>{exercise.name}</div>;
      })}
    </div>
  );
}

export default ExerciseIndex;
