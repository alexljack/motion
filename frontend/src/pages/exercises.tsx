import { Link } from "@tanstack/react-router";

import { useListExercises, Exercise } from "../api/use-list-exercises";

const Exercises = () => {
  const { data } = useListExercises();

  return (
    <div className="border h-full w-full">
      <div></div>
      <div>Exercises</div>
      {data?.map((exercise: Exercise) => {
        console.log(exercise);
        return (
          <Link to={`/exercises/${exercise._id}`} key={exercise._id}>
            {exercise.name}
            {/* <div key={exercise._id}>{exercise.name}</div>); */}
          </Link>
        );
      })}
    </div>
  );
};

export default Exercises;
