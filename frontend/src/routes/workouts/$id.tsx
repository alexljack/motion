import {
  createFileRoute,
  Link,
  redirect,
  useParams,
} from "@tanstack/react-router";
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
  console.log(data);
  return (
    <PageWrapper pageName={data?.name ?? "Loading..."}>
      <div className="w-full flex justify-between">
        <p className="text-lg">{data?.description}</p>
        <p className="text-lg">
          Duration: {data?.estimatedDurationMinutes} mins
        </p>
      </div>
      <div className="grid grid-cols-3">
        {data?.exercises.map((ex) => {
          return (
            <Link
              to="/exercises/$id"
              params={{ id: ex.exercise._id }}
              key={ex._id}
            >
              <div
                className="h-12 border bg-orange-500 text-center content-center cursor-pointer"
                key={ex._id}
              >
                <h3 className="text-black">{ex.exercise.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </PageWrapper>
  );
}
