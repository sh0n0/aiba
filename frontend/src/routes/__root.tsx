import { useAppStore } from "@/store/store.ts";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => {
    const accessToken = useAppStore((state) => state.accessToken);
    const clearAll = useAppStore((state) => state.clearAll);

    return (
      <>
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/companion" className="[&.active]:font-bold">
            Companion
          </Link>
          <Link to="/settings/profile" className="[&.active]:font-bold">
            Settings
          </Link>
          {accessToken && (
            <Link to={"/"} params={{ logout: true }} onClick={() => clearAll()}>
              Logout
            </Link>
          )}
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});
