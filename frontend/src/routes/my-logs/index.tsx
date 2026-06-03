import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
// import useListWorkouts from "../../api/workouts/use-list-workouts";
import useListLogs, {
  WorkoutSession,
} from "../../api/logged-workouts/use-list-logs";
import PageWrapper from "../../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/my-logs/")({
  beforeLoad: async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const goTo = useNavigate();
  // const { data } = useListWorkouts();
  const { data } = useListLogs();
  console.log(data);
  console.log("test");
  return (
    <PageWrapper pageName="Your Workouts">
      <div>
        <button
          className="p-4 bg-red-400"
          onClick={() => goTo({ to: "/my-logs/new" })}
        >
          Add workout
        </button>
      </div>
      {data?.workoutSessions.map((session) => {
        return <SessionCard key={session._id} session={session} />;
      })}
    </PageWrapper>
  );
}

function SessionCard({ session }: { session: WorkoutSession }) {
  return (
    <Link to="/my-logs/$id" params={{ id: session._id }}>
      <div className="flex gap-2 border p-2">
        <div>{session.name}</div>
        <div>{session.status}</div>
        <div>{session.createdAt}</div>
      </div>
    </Link>
  );
}
