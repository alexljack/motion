import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import useFindWorkout from "../../api/workouts/use-find-workout";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/workouts/$id")({
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
  component: WorkoutView,
  loader: () => <div>Loading...</div>,
});

function WorkoutView() {
  const { id } = useParams({ strict: false });
  const { data } = useFindWorkout(id ?? "");
  console.log("workout", data);
  return (
    <PageWrapper pageName={data?.name ?? "Loading..."}>
      <p>{data?.description}</p>
      <p>{data?.duration}</p>
      <div className="grid grid-cols-3">
        {data?.exercises.map((ex) => {
          return (
            <div
              className="h-12 border bg-orange-500 text-center content-center cursor-pointer"
              key={ex?._id}
            >
              <h3>{ex?.name}</h3>
              {/* <p>{ex?.description}</p>
              <p>{ex?.category}</p>
              <p>{ex?.difficulty}</p>
              <p>{ex?.equipment}</p> */}
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
