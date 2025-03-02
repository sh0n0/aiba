require 'rails_helper'

RSpec.describe CompanionToolsController, type: :request do
  describe 'POST /tools' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'with valid params' do
      it 'creates a companion tool with params' do
        params = {
          companion_tool: {
            name: "name",
            description: "description",
            url: "https://example.com",
            params: [
              { name: "param1", description: "description1", param_type: "string" },
              { name: "param2", description: "description2", param_type: "number" }
            ]
          }
        }
        post '/tools', headers: auth_headers(user), params: params
        expect(response).to have_http_status(201)
        expect(account.owned_companion_tools.count).to eq(1)
        expect(account.owned_companion_tools.first.companion_tool_params.count).to eq(2)
      end
    end

    context 'without auth headers' do
      it 'returns an error' do
        params = {
          companion_tool: {
            name: "name",
            description: "description",
            url: "https://example.com",
            params: [
              { name: "param1", description: "description1", param_type: "string" },
              { name: "param2", description: "description2", param_type: "number" }
            ]
          }
        }
        post '/tools', params: params
        expect(response).to have_http_status(401)
        expect(CompanionTool.count).to eq(0)
        expect(CompanionToolParam.count).to eq(0)
      end
    end

    context 'with invalid params' do
      it 'returns an error' do
        params = {
          companion_tool: {
            name: "name",
            description: "description",
            url: "https://example.com",
            params: [
              { name: "param1", description: "description1", param_type: "string" },
              { name: "param2", description: "description2", param_type: "invalid" }
            ]
          }
        }
        post '/tools', headers: auth_headers(user), params: params
        expect(response).to have_http_status(422)
        expect(CompanionTool.count).to eq(0)
        expect(CompanionToolParam.count).to eq(0)
      end
    end
  end
end
