import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import useFindExercise from "../../api/use-find-exercise";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/exercises/$id")({
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
