import { createCompanionFetcher } from "@/api/companion.ts";
import { fetchOwnedCompanionToolsFetcher } from "@/api/companionTool";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/companion/create")({
  component: CreateCompanion,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function CreateCompanion() {
  return (
    <div className="mt-12 flex h-screen flex-col items-center">
      <CreateCompanionForm />
    </div>
  );
}

type Tool = {
  id: string;
  creatorName: string;
  toolName: string;
};

type CompanionFormValues = {
  name: string;
  description: string;
  prompt: string;
  tools: Tool[];
};

const CreateCompanionForm = () => {
  const form = useForm<CompanionFormValues>({
    defaultValues: {
      name: "",
      description: "",
      prompt: "",
      tools: [],
    },
  });

  const {
    fields: toolFields,
    append: appendTool,
    remove: removeTool,
  } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  const { data: ownedTools } = useSWR("tools", fetchOwnedCompanionToolsFetcher);
  const { trigger, isMutating, error } = useSWRMutation("companions", createCompanionFetcher);

  const onSubmitCompanion = async (data: { name: string; description: string; prompt: string; tools: Tool[] }) => {
    if (!ownedTools) {
      return;
    }

    const { name, description, prompt, tools } = data;

    const selectedTools = ownedTools
      .filter((tool) => {
        return tools.some((selectedTool) => Number(selectedTool.id) === tool.id);
      })
      .map((tool) => {
        return {
          creatorName: tool.creator.name,
          toolName: tool.name,
        };
      });
    await trigger({ name, description, prompt, tools: selectedTools });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitCompanion)} className="w-full max-w-md space-y-4">
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormField
          control={form.control}
          name="name"
          render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
        />

        <FormLabel htmlFor="description">Description</FormLabel>
        <FormField
          control={form.control}
          name="description"
          render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
        />

        <FormLabel htmlFor="prompt">Prompt</FormLabel>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field: { onChange, value } }) => <Textarea onChange={onChange} value={value} />}
        />

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Tools</h3>
          {toolFields.map((tool, toolIndex) => (
            <Card className="relative" key={tool.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTool(toolIndex)}
                      className="text-red-500 hover:bg-red-100 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <FormItem>
                    <FormField
                      control={form.control}
                      name={`tools.${toolIndex}.id`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select tool" />
                          </SelectTrigger>
                          <SelectContent>
                            {ownedTools?.map((tool) => (
                              <SelectItem key={tool.id} value={tool.id.toString()}>
                                {tool.creator.name} / {tool.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button type="button" onClick={() => appendTool({ id: "", creatorName: "", toolName: "" })}>
            Add Tool
          </Button>
        </div>

        <Button type="submit" disabled={isMutating}>
          {isMutating ? "Creating..." : "Create"}
        </Button>
        {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
      </form>
    </Form>
  );
};
