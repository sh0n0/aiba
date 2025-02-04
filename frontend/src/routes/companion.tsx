import { createCompanionFetcher } from "@/api/companion.ts";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormField, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/companion")({
  component: Companion,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function Companion() {
  const form = useForm({
    defaultValues: { name: "", description: "", prompt: "" },
  });
  const { trigger, isMutating, error } = useSWRMutation("companions", createCompanionFetcher);

  const onSubmitCompanion = async (data: {
    name: string;
    description: string;
    prompt: string;
  }) => {
    const { name, description, prompt } = data;
    await trigger({ name, description, prompt });
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCompanion)}>
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
            {isMutating ? "Creating..." : "Submit"}
          </Button>
          {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
        </form>
      </Form>
    </div>
  );
}
