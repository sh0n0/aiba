import { Button } from "@/components/ui/button";
import { redirectToLoginIfUnauthorized } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tool/")({
  component: RouteComponent,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function RouteComponent() {
  return (
    <div className="mt-12 flex h-screen w-screen flex-col items-center">
      <Link to="/tool/create">
        <Button>Create</Button>
      </Link>
    </div>
  );
}
