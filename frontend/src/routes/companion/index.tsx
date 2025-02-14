import { fetchOpenCompanionsFetcher, fetchOwnedCompanionsFetcher } from "@/api/companion.ts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/companion/")({
  component: Companion,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function Companion() {
  const { data: ownedCompanions, error: errorOwned } = useSWR("owned_companions", fetchOwnedCompanionsFetcher);
  const { data: openCompanions, error: errorOpen } = useSWR("open_companions", fetchOpenCompanionsFetcher);

  if (errorOwned || errorOpen) {
    return <div>Error: {errorOwned?.message || errorOpen?.message}</div>;
  }

  if (!ownedCompanions || !openCompanions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center">
      <Tabs defaultValue="owned_companions">
        <div className="flex w-full justify-center">
          <TabsList>
            <TabsTrigger value="owned_companions">Owned Companions</TabsTrigger>
            <TabsTrigger value="open_companions">Open Companions</TabsTrigger>
          </TabsList>
          <Link to="/companion/create" className="ml-4">
            <Button>Create</Button>
          </Link>
        </div>
        <TabsContent value="owned_companions" className="w-screen px-12">
          <div className="flex justify-center gap-12">
            <CompanionList companions={ownedCompanions} />
          </div>
        </TabsContent>
        <TabsContent value="open_companions" className="w-screen px-12">
          <CompanionList companions={openCompanions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type Companion = {
  id: number;
  name: string;
  description: string;
  creator: {
    name: string;
    displayName: string;
    createdAt: string;
  };
};

const CompanionList = ({ companions }: { companions: Companion[] }) => {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companions.map((companion) => (
          <TableRow
            key={companion.id}
            onClick={async () =>
              await navigate({
                to: `/@${companion.creator.name}/${companion.name}`,
              })
            }
          >
            <TableCell>{companion.name}</TableCell>
            <TableCell>{companion.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
