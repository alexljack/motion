import { createFileRoute, useParams } from "@tanstack/react-router";
import useFindExercise from "../../api/use-find-exercise";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/exercises/$id")({
  component: ExerciseView,
  loader: () => <div>Loading...</div>,
});

function ExerciseView() {
  const { id } = useParams({ strict: false });
  const { data } = useFindExercise(id ?? "");
  return (
    <PageWrapper pageName={data?.name ?? "Loading..."}>
      <div>
        <p>{data?.category}</p>
        <p>{data?.difficulty}</p>
        <p>{data?.description}</p>
        <p>{data?.equipment}</p>
      </div>
    </PageWrapper>
  );
}

export default ExerciseView;
