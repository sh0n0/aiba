require 'rails_helper'

RSpec.describe 'Ai::OpenaiApi' do
  describe "#generate_sentences" do
    context "when just returning a response", :vcr do
      it "returns without error" do
        Ai::OpenaiApi.instance.generate_sentences("You are an assistant.", "How are you?", [])
      end
    end

    context "when calling function", :vcr do
      let!(:companion_tool) { create(:companion_tool, name: "get_weather", description: "Get the weather in a city", url: "http://localhost:8000/weather") }
      let!(:companion_tool_params) { create(:companion_tool_param, companion_tool: companion_tool, name: "city", param_type: "string") }

      it "returns without error" do
        Ai::OpenaiApi.instance.generate_sentences("You are an assistant.", "How is the weather in New York?", [ companion_tool ])
      end
    end

    context "when calling function multiple times", :vcr do
      let!(:companion_tool) { create(:companion_tool, name: "get_weather", description: "Get the weather in a city", url: "http://localhost:8000/weather") }
      let!(:companion_tool_params) { create(:companion_tool_param, companion_tool: companion_tool, name: "city", param_type: "string") }

      it "returns without error" do
        Ai::OpenaiApi.instance.generate_sentences("You are an assistant.", "How is the weather in New York and Tokyo?", [ companion_tool ])
      end
    end
  end
end
