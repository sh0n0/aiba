import { loginFetcher } from "@/api/login";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppStore } from "@/store/store.ts";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const setAuth = useAppStore((state) => state.setAuth);
  const navigate = useNavigate({ from: "/login" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TODO: Use env variable for the URL
  const { trigger, isMutating, error } = useSWRMutation("http://localhost:3000/auth/sign_in", loginFetcher);

  const onLoginClicked = async () => {
    const { uid, client, accessToken } = await trigger({ email, password });
    setAuth(uid, client, accessToken);
    await navigate({ to: "/" });
  };

  return (
    <div className="-mt-12 flex h-screen flex-col items-center justify-center">
      <div className="grid gap-8">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            className="w-80"
            placeholder="aiba@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            className="w-80"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="mt-4 text-red-500">{error.message}</div>}
      <Button className="mt-12 w-80" onClick={onLoginClicked} disabled={isMutating}>
        {isMutating ? "Logging in..." : "Login"}
      </Button>
    </div>
  );
}
