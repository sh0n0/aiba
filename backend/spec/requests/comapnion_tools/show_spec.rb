require 'rails_helper'

RSpec.describe CompanionToolsController, type: :request do
  describe 'GET /tools/:account_name/:tool_name' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:companion_tool) { create(:companion_tool, creator: account, published_at: Time.current) }
    let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

    context 'when the companion tool exists' do
      it 'returns the companion tool' do
        get "/tools/#{account.name}/#{companion_tool.name}", headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect(response.parsed_body['name']).to eq(companion_tool.name)
      end
    end

    context 'when the companion tool does not exist' do
      it 'returns a 404' do
        get "/tools/#{account.name}/nonexistent", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the account does not exist' do
      it 'returns a 404' do
        get "/tools/nonexistent/#{companion_tool.name}", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the companion tool is owned but not created by the account' do
      let!(:other_account) { create(:account) }
      let!(:other_companion_tool) { create(:companion_tool, creator: other_account) }
      let!(:other_companion_tool_ownership) { create(:companion_tool_ownership, account: other_account, companion_tool: other_companion_tool) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: other_companion_tool) }

      it 'returns a 404' do
        get "/tools/#{account.name}/#{other_companion_tool.name}", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the companion tool is not published' do
      let!(:companion_tool) { create(:companion_tool, creator: account, published_at: nil) }
      context 'when the requesting user is the account owner' do
        it 'returns the companion tool' do
          get "/tools/#{account.name}/#{companion_tool.name}", headers: auth_headers(user)
          expect(response).to have_http_status(200)
          expect(response.parsed_body['name']).to eq(companion_tool.name)
        end
      end

      context 'when the requesting user is not the account owner' do
        let!(:other_user) { create(:user) }
        it 'returns a 404' do
          get "/tools/#{account.name}/#{companion_tool.name}", headers: auth_headers(other_user)
          expect(response).to have_http_status(404)
        end
      end
    end
  end
end
