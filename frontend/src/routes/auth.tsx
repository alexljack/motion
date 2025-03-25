import { FormProvider, useForm } from "react-hook-form";
import {
  createFileRoute,
  Link,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import useAuth from "../api/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

type FormData = {
  email: string;
  password: string;
};

function RouteComponent() {
  const methods = useForm<FormData>();
  const { mutate } = useAuth();
  const goTo = useNavigate();
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      goTo({ to: redirect });
    }
  }, [goTo, redirect]);

  const onSubmit = (formData: FormData) => {
    mutate(formData, {
      onError: (err) => {
        console.log(err);
        // add toast
      },
      onSuccess: (res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res));
        goTo({ to: redirect });
      },
    });
  };

  return (
    <div>
      Hello "/auth"!
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div>
              <label>
                Email
                <input placeholder="email" {...methods.register("email")} />
              </label>
            </div>
            <div>
              <label>
                Password
                <input
                  placeholder="password"
                  {...methods.register("password")}
                />
              </label>
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
