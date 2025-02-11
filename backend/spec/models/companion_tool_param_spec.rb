require 'rails_helper'

RSpec.describe CompanionToolParam, type: :model do
  describe "#to_json_schema" do
    context "when param_type is string" do
      it "returns a JSON schema for a string parameter" do
        companion_tool_param = build(:companion_tool_param, param_type: :string, name: "param1")
        expect(companion_tool_param.to_json_schema).to eq({ param1: { type: "string" } })
      end
    end

    context "when param_type is number" do
      it "returns a JSON schema for a number parameter" do
        companion_tool_param = build(:companion_tool_param, param_type: :number, name: "param2")
        expect(companion_tool_param.to_json_schema).to eq({ param2: { type: "number" } })
      end
    end

    context "when param_type is array" do
      it "returns a JSON schema for an array parameter" do
        companion_tool_param = build(:companion_tool_param, param_type: :array, name: "param3")
        expect(companion_tool_param.to_json_schema).to eq({ param3: { type: "array", items: { type: "string" } } })
      end
    end

    context "when param_type is boolean" do
      it "returns a JSON schema for a boolean parameter" do
        companion_tool_param = build(:companion_tool_param, param_type: :boolean, name: "param4")
        expect(companion_tool_param.to_json_schema).to eq({ param4: { type: "boolean" } })
      end
    end
  end
end
