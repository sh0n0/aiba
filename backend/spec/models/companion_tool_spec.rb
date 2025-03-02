require 'rails_helper'

RSpec.describe CompanionTool, type: :model do
  describe '.published' do
    let!(:published_companion_tool) { create(:companion_tool, published_at: Time.current) }
    let!(:unpublished_companion_tool) { create(:companion_tool, published_at: nil) }

    it 'returns only companion tools with a non-nil published_at' do
      expect(CompanionTool.published).to contain_exactly(published_companion_tool)
    end
  end

  describe '.with_name' do
    let!(:companion_tool1) { create(:companion_tool, name: "tool1") }
    let!(:companion_tool2) { create(:companion_tool, name: "tool2") }

    it 'returns the companion tool with the given name' do
      expect(CompanionTool.with_name("tool1")).to contain_exactly(companion_tool1)
    end
  end

  describe '.created_by' do
    let!(:account) { create(:account) }
    let!(:companion_tool1) { create(:companion_tool, creator: account) }
    let!(:companion_tool2) { create(:companion_tool, creator: build(:account)) }

    it "returns the companion tool created by the given account" do
      expect(CompanionTool.created_by(account)).to contain_exactly(companion_tool1)
    end
  end

  describe '.recent' do
    let!(:companion_tool1) { create(:companion_tool) }
    let!(:companion_tool2) { create(:companion_tool) }

    it 'returns companion tools in descending order of id' do
      expect(CompanionTool.recent).to eq([ companion_tool2, companion_tool1 ])
    end
  end

  describe '.find_by_account_and_tool_pairs!' do
    let!(:account) { create(:account) }
    let!(:companion_tool1) { create(:companion_tool, creator: account) }
    let!(:companion_tool2) { create(:companion_tool, creator: account) }

    context 'with valid creator and tool names' do
      it 'finds companion tools by account and tool pairs' do
        params = [
          { creator_name: companion_tool1.creator.name, tool_name: companion_tool1.name },
          { creator_name: companion_tool2.creator.name, tool_name: companion_tool2.name }
        ]
        companion_tools = CompanionTool.find_by_account_and_tool_pairs!(params)
        expect(companion_tools).to eq([ companion_tool1, companion_tool2 ])
      end

      context 'when params are empty' do
        it 'returns an empty array' do
          companion_tools = CompanionTool.find_by_account_and_tool_pairs!([])
          expect(companion_tools).to eq([])
        end
      end
    end

    context 'with an invalid tool name' do
      it 'raises an error' do
        params = [
          { creator_name: companion_tool1.creator.name, tool_name: companion_tool1.name },
          { creator_name: companion_tool2.creator.name, tool_name: 'invalid' }
        ]
        expect {
          CompanionTool.find_by_account_and_tool_pairs!(params)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'with an invalid creator name' do
      it 'raises an error' do
        params = [
          { creator_name: companion_tool1.creator.name, tool_name: companion_tool1.name },
          { creator_name: 'invalid', tool_name: companion_tool2.name }
        ]
        expect {
          CompanionTool.find_by_account_and_tool_pairs!(params)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe '#to_json_schema' do
    let!(:companion_tool) { create(:companion_tool) }
    let!(:companion_tool_params1) { create(:companion_tool_param, companion_tool: companion_tool, name: "param1", param_type: "string") }
    let!(:companion_tool_params2) { create(:companion_tool_param, companion_tool: companion_tool, name: "param2", param_type: "number") }

    it 'returns a JSON schema' do
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
