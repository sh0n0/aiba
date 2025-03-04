import { createCompanionToolFetcher } from "@/api/companionTool";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirectToLoginIfUnauthorized } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoaderCircle, Trash2 } from "lucide-react";
import { type Control, useFieldArray, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

type ParamType = "string" | "number" | "array" | "boolean";
type ToolParams = {
  paramType: ParamType;
  name: string;
  description: string;
};
type CompanionToolFormValues = {
  name: string;
  description: string;
  url: string;
  params: ToolParams[];
};

export const Route = createFileRoute("/tool/create")({
  component: RouteComponent,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/tool/create" });

  const form = useForm<CompanionToolFormValues>({
    defaultValues: {
      name: "",
      description: "",
      url: "",
      params: [],
    },
  });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control: form.control,
    name: "params",
  });

  const { trigger, isMutating, error } = useSWRMutation("companions", createCompanionToolFetcher);

  const onSubmitCompanion = async (data: { name: string; description: string; url: string; params: ToolParams[] }) => {
    const { name, description, url, params } = data;
    await trigger({ name, description, url, params });
    await navigate({ to: "/tool" });
  };

  return (
    <div className="mt-12 flex h-screen w-screen flex-col items-center">
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

          <FormLabel htmlFor="url">URL</FormLabel>
          <FormField
            control={form.control}
            name="url"
            render={({ field: { onChange, value } }) => <Input onChange={onChange} value={value} />}
          />

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Params</h3>
            {paramFields.map((param, paramIndex) => (
              <ParamCard key={param.id} control={form.control} paramIndex={paramIndex} removeParam={removeParam} />
            ))}
            <Button type="button" onClick={() => appendParam({ paramType: "string", name: "", description: "" })}>
              Add Param
            </Button>
          </div>

          <Button type="submit" disabled={isMutating}>
            {isMutating ? <LoaderCircle className="animate-spin" /> : "Create"}
          </Button>
          {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
        </form>
      </Form>
    </div>
  );
}

type ParamCardProps = {
  control: Control<CompanionToolFormValues>;
  paramIndex: number;
  removeParam: (index: number) => void;
};
const ParamCard = ({ control, paramIndex, removeParam }: ParamCardProps) => {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeParam(paramIndex)}
              className="text-red-500 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <FormItem>
            <FormLabel>Parameter Type</FormLabel>
            <FormField
              control={control}
              name={`params.${paramIndex}.paramType`}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
          </FormItem>

          <FormItem>
            <FormLabel>Parameter Name</FormLabel>
            <FormField
              control={control}
              name={`params.${paramIndex}.name`}
              render={({ field }) => <Input {...field} placeholder="Enter name" />}
            />
          </FormItem>

          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormField
              control={control}
              name={`params.${paramIndex}.description`}
              render={({ field }) => <Input {...field} placeholder="Describe this parameter" />}
            />
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};
