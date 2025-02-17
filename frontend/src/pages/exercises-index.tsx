import React from "react";
// import useFindExercise from "../api/use-find-exercise";
import { getRouteApi } from "@tanstack/react-router";

const ExerciseIndex = () => {
  const routeApi = getRouteApi("/exercises");
  console.log(routeApi);
  //   const { id } = useParams();
  //   const { data } = useFindExercise(id);
  return <div>ExerciseView</div>;
};

export default ExerciseIndex;
