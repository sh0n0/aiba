import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppStore } from "@/store/store.ts";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const setAuth = useAppStore((state) => state.setAuth);
  const navigate = useNavigate({ from: "/login" });

  const onLoginClicked = async () => {
    // TODO: call login API
    setAuth("uid", "client", "accessToken");
    await navigate({ to: "/" });
  };

  return (
    <div className="-mt-12 flex h-screen flex-col items-center justify-center">
      <div className="grid gap-8">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input className="w-80" placeholder="aiba@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input className="w-80" placeholder="password" type="password" />
        </div>
      </div>
      <Button className="mt-12 w-80" onClick={onLoginClicked}>
        Login
      </Button>
    </div>
  );
}
