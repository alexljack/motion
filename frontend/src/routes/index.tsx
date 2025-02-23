import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <div className="p-2">
      <h1>Dashboard</h1>
      <h3>Welcome Home!</h3>
    </div>
  );
}

export default Homepage;
