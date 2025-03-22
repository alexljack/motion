import { FormProvider, useForm } from "react-hook-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import useAuth from "../api/use-auth";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

type FormData = {
  email: string;
  password: string;
};

function RouteComponent() {
  const methods = useForm<FormData>();
  const { data, mutate } = useAuth();

  const onSubmit = (formData: FormData) => {
    mutate(formData, {
      onSuccess: (res) => {
        console.log(res);
      },
    });
  };

  if (data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return (
    <div>
      Hello "/auth"!
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div>
              <label>Email</label>
              <input placeholder="email" {...methods.register("email")} />
            </div>
            <div>
              <label>Password</label>
              <input placeholder="password" {...methods.register("password")} />
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
      </FormProvider>
      New user?
      <Link to="/register">Register</Link>
    </div>
  );
}
