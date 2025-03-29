import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import useRegister from "../api/authentication/use-register";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

type FormData = {
  email: string;
  height: number;
  name: string;
  weight: number;
  password: string;
};

function RouteComponent() {
  const goTo = useNavigate();
  const methods = useForm<FormData>();

  const { mutate: register } = useRegister({
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
    console.log(formData);
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
                // disabled={isPending}
                placeholder="email"
                {...methods.register("email")}
              />
            </label>
            <label>
              Name
              <input
                // disabled={isPending}
                placeholder="name"
                {...methods.register("name")}
              />
            </label>
            <label>
              Height
              <input
                // disabled={isPending}
                placeholder="height"
                type="number"
                {...methods.register("height")}
              />
            </label>
            <label>
              Weight
              <input
                // disabled={isPending}
                placeholder="weight"
                type="number"
                {...methods.register("weight")}
              />
            </label>

            <div>
              <label>
                Password
                <input
                  // disabled={isPending}
                  placeholder="password"
                  {...methods.register("password")}
                />
              </label>
            </div>
          </div>
          <button
            // disabled={isPending}
            type="submit"
          >
            Register
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
