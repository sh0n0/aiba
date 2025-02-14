import { createCompanionFetcher } from "@/api/companion.ts";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormField, FormLabel } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { createFileRoute } from "@tanstack/react-router";
import { type Control, useFieldArray, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/companion/create")({
  component: CreateCompanion,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function CreateCompanion() {
  return (
    <div className="flex h-screen flex-col items-center">
      <CreateCompanionForm />
    </div>
  );
}

type ParamType = "string" | "number" | "array" | "boolean";
type Tool = {
  name: string;
  description: string;
  url: string;
  params: { param_type: ParamType; name: string; description: string }[];
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

  const { trigger, isMutating, error } = useSWRMutation("companions", createCompanionFetcher);

  const onSubmitCompanion = async (data: { name: string; description: string; prompt: string; tools: Tool[] }) => {
    const { name, description, prompt, tools } = data;
    await trigger({ name, description, prompt, tools });
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
            <ToolCard key={tool.id} control={form.control} toolIndex={toolIndex} removeTool={removeTool} />
          ))}
          <Button type="button" onClick={() => appendTool({ name: "", description: "", url: "", params: [] })}>
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

type ToolCardProps = {
  control: Control<CompanionFormValues>;
  toolIndex: number;
  removeTool: (index: number) => void;
};

export const ToolCard: React.FC<ToolCardProps> = ({ control, toolIndex, removeTool }) => {
  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control,
    name: `tools.${toolIndex}.params`,
  });

  return (
    <div className="rounded border p-4">
      <FormLabel htmlFor={`tools.${toolIndex}.name`}>Tool Name</FormLabel>
      <FormField
        control={control}
        name={`tools.${toolIndex}.name`}
        render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
      />

      <FormLabel htmlFor={`tools.${toolIndex}.description`}>Tool Description</FormLabel>
      <FormField
        control={control}
        name={`tools.${toolIndex}.description`}
        render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
      />

      <FormLabel htmlFor={`tools.${toolIndex}.url`}>Tool URL</FormLabel>
      <FormField
        control={control}
        name={`tools.${toolIndex}.url`}
        render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
      />

      <div className="mt-2 space-y-2">
        <h4 className="font-medium text-md">Parameters</h4>
        {paramFields.map((param, paramIndex) => (
          <div key={param.id} className="rounded border p-2">
            <FormLabel htmlFor={`tools.${toolIndex}.params.${paramIndex}.name`}>Param Name</FormLabel>
            <FormField
              control={control}
              name={`tools.${toolIndex}.params.${paramIndex}.name`}
              render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
            />

            <FormLabel htmlFor={`tools.${toolIndex}.params.${paramIndex}.paran_type`}>Param Type</FormLabel>
            <FormField
              control={control}
              name={`tools.${toolIndex}.params.${paramIndex}.param_type`}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormLabel htmlFor={`tools.${toolIndex}.params.${paramIndex}.description`}>Param Description</FormLabel>
            <FormField
              control={control}
              name={`tools.${toolIndex}.params.${paramIndex}.description`}
              render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
            />

            <Button type="button" variant="destructive" onClick={() => removeParam(paramIndex)}>
              Remove Parameter
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendParam({ param_type: "string", name: "", description: "" })}>
          Add Parameter
        </Button>
      </div>

      <Button type="button" variant="destructive" onClick={() => removeTool(toolIndex)}>
        Remove Tool
      </Button>
    </div>
  );
};
