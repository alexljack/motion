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
      <div>Hello {data?.first_name}!</div>
    </PageWrapper>
  );
}
