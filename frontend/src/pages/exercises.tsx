import { useListExercises, Exercise } from "../api/use-list-exercises";

const Exercises = () => {
  const { data } = useListExercises();

  return (
    <div className="border h-full w-full">
      <div></div>
      <div>Exercises</div>
      {data?.map((exercise: Exercise) => {
        console.log(exercise);
        return <div key={exercise._id}>{exercise.name}</div>;
      })}
    </div>
  );
};

export default Exercises;
