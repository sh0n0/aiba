import { loginFetcher } from "@/api/login";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormField, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAppStore } from "@/store/store.ts";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const setAuth = useAppStore((state) => state.setAuth);
  const navigate = useNavigate({ from: "/login" });
  const form = useForm({ defaultValues: { email: "", password: "" } });

  const { trigger, isMutating, error } = useSWRMutation("sign_in", loginFetcher);

  const onLoginClicked = async (data: { email: string; password: string }) => {
    const { email, password } = data;
    const { uid, client, accessToken } = await trigger({ email, password });
    setAuth(uid, client, accessToken);
    await navigate({ to: "/" });
  };

  return (
    <div className="-mt-12 flex h-screen flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLoginClicked)}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormField
            control={form.control}
            name="email"
            render={({ field: { onChange } }) => <Input type={"email"} autoComplete={"email"} onChange={onChange} />}
          />

          <FormLabel htmlFor="password">Password</FormLabel>
          <FormField
            control={form.control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input type={"password"} autoComplete={"current-password"} onChange={onChange} />
            )}
          />

          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Logging in..." : "Login"}
          </Button>
          {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
        </form>
      </Form>
    </div>
  );
}
