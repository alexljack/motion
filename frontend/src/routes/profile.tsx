import { createFileRoute } from "@tanstack/react-router";
import PageWrapper from "../ui/page-wrapper/page-wrapper";
import useUserProfile from "../api/user/use-user-profile";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data } = useUserProfile();

  return (
    <PageWrapper pageName="Your Profile">
      <div className="flex flex-col gap-2">
        <p>Hello {data?.first_name}!</p>
        <input value={data?.height} />
        <input value={data?.weight} />
        <input value={data?.preferences.units} />
      </div>
    </PageWrapper>
  );
}
