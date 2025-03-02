require 'rails_helper'

RSpec.describe CompanionsController, type: :request do
  describe 'POST /companions/' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:companion_tool1) { create(:companion_tool, creator: account) }
    let!(:companion_tool2) { create(:companion_tool, creator: account) }

    context 'with valid params' do
      it 'creates a companion with tools' do
        params = {
          companion: {
            name: 'name',
            description: 'description',
            prompt: 'prompt',
            tools: [
              { creator_name: companion_tool1.creator.name, tool_name: companion_tool1.name },
              { creator_name: companion_tool2.creator.name, tool_name: companion_tool2.name }
            ]
          }
        }
        post '/companions', headers: auth_headers(user), params: params
        expect(response).to have_http_status(201)
        expect(account.created_companions.count).to eq(1)
        expect(account.created_companions.first.companion_tools.count).to eq(2)
      end
    end

    context 'without auth headers' do
      it 'returns a 401' do
        params = {
          companion: {
            name: 'name',
            description: 'description',
            prompt: 'prompt',
            tools: [
              { creator_name: companion_tool1.creator.name, tool_name: companion_tool1.name },
              { creator_name: companion_tool2.creator.name, tool_name: companion_tool2.name }
            ]
          }
        }
        post '/companions', params: params
        expect(response).to have_http_status(401)
        expect(Companion.count).to eq(0)
      end
    end
  end
end
