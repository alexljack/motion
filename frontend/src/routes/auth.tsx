import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/auth"!
      <div className="flex flex-col gap-2">
        <div>
          <label>Email</label>
          <input placeholder="email" />
        </div>
        <div>
          <label>Password</label>
          <input placeholder="password" />
        </div>
      </div>
      <button>Login</button>
    </div>
  );
}
