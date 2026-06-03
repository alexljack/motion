import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import useRegister from "../api/authentication/use-register";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

type FormData = {
  email: string;
  height: number;
  first_name: string;
  last_name: string;
  username: string;
  weight: number;
  password: string;
};

function RouteComponent() {
  const goTo = useNavigate();
  const methods = useForm<FormData>();

  const { isPending, mutate: register } = useRegister({
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (res) => {
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res));
      goTo({ to: "/" });
      // add toast
    },
  });

  const onSubmit = (formData: FormData) => {
    register(formData);
  };

  return (
    <div>
      Hello "/register"!
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label>
              Email
              <input
                disabled={isPending}
                placeholder="email"
                {...methods.register("email")}
              />
            </label>
            <label>
              First Name
              <input
                disabled={isPending}
                placeholder="name"
                {...methods.register("first_name")}
              />
            </label>
            <label>
              Last Name
              <input
                disabled={isPending}
                placeholder="name"
                {...methods.register("last_name")}
              />
            </label>
            <label>
              Username
              <input
                disabled={isPending}
                placeholder="name"
                {...methods.register("username")}
              />
            </label>
            <label>
              Height
              <input
                disabled={isPending}
                placeholder="height"
                type="number"
                {...methods.register("height")}
              />
            </label>
            <label>
              Weight
              <input
                disabled={isPending}
                placeholder="weight"
                type="number"
                {...methods.register("weight")}
              />
            </label>

            <div>
              <label>
                Password
                <input
                  disabled={isPending}
                  placeholder="password"
                  {...methods.register("password")}
                />
              </label>
            </div>
          </div>
          <button disabled={isPending} type="submit">
            Register
          </button>
        </form>
      </FormProvider>
      Already a user?
      <Link to="/auth">Register</Link>
    </div>
  );
}
