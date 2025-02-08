import { createCompanionFetcher, fetchOpenCompanionsFetcher, fetchOwnedCompanionsFetcher } from "@/api/companion.ts";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormField, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/companion")({
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
        </div>
        <TabsContent value="owned_companions" className="w-screen px-12">
          <div className="flex justify-center gap-12">
            <CreateCompanionForm />
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

const CreateCompanionForm = () => {
  const form = useForm<{ name: string; description: string; prompt: string }>({
    defaultValues: { name: "", description: "", prompt: "" },
  });
  const { trigger, isMutating, error } = useSWRMutation("companions", createCompanionFetcher);

  const onSubmitCompanion = async (data: { name: string; description: string; prompt: string }) => {
    const { name, description, prompt } = data;
    await trigger({ name, description, prompt });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitCompanion)} className="w-full max-w-md">
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormField
          control={form.control}
          name="name"
          render={({ field: { onChange } }) => <Input onChange={onChange} />}
        />

        <FormLabel htmlFor="description">Description</FormLabel>
        <FormField
          control={form.control}
          name="description"
          render={({ field: { onChange } }) => <Input onChange={onChange} />}
        />

        <FormLabel htmlFor="prompt">Prompt</FormLabel>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field: { onChange } }) => <Textarea onChange={onChange} />}
        />

        <Button type="submit" disabled={isMutating}>
          {isMutating ? "Creating..." : "Create"}
        </Button>
        {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
      </form>
    </Form>
  );
};

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
            onClick={async () => await navigate({ to: `/@${companion.creator.name}/${companion.name}` })}
          >
            <TableCell>{companion.name}</TableCell>
            <TableCell>{companion.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
