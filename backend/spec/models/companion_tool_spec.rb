require 'rails_helper'

RSpec.describe CompanionTool, type: :model do
  describe "#to_json_schema" do
    let!(:companion_tool) { create(:companion_tool) }
    let!(:companion_tool_params1) { create(:companion_tool_param, companion_tool: companion_tool, name: "param1", param_type: "string") }
    let!(:companion_tool_params2) { create(:companion_tool_param, companion_tool: companion_tool, name: "param2", param_type: "number") }

    it "returns a JSON schema" do
      expect_json_schema = {
        type: "function",
        function: {
          name: companion_tool.name,
          description: companion_tool.description,
          parameters: {
            type: :object,
            properties: {
              param1: {
                type: "string"
              },
              param2: {
                type: "number"
              }
            }
          }
        }
      }

      expect(companion_tool.to_json_schema).to eq(expect_json_schema)
    end
  end
end
