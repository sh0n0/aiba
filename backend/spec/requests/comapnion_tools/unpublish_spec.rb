require 'rails_helper'

RSpec.describe CompanionToolsController, type: :request do
  describe 'POST /tools/:account_name/:tool_name/unpublish' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'when the companion tool is created by the account' do
      current_time = Time.current
      let!(:companion_tool) { create(:companion_tool, creator: account, published_at: current_time) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

      it 'unpublishes the companion' do
        post "/tools/#{account.name}/#{companion_tool.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(200)
        expect { companion_tool.reload }.to change { companion_tool.published_at }.from(current_time).to(nil)
      end
    end

    context 'without auth headers' do
      let!(:companion_tool) { create(:companion_tool, creator: account, published_at: Time.current) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

      it 'returns a 401' do
        post "/tools/#{account.name}/#{companion_tool.name}/unpublish"
        expect(response).to have_http_status(401)
        expect(companion_tool.reload.published_at).not_to be_nil
      end
    end

    context 'when the companion tool is not created by the account' do
      let!(:other_account) { create(:account) }
      let!(:other_user) { create(:user, account: other_account) }
      let!(:companion_tool) { create(:companion_tool, creator: other_account, published_at: Time.current) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

      it 'returns a 404' do
        post "/tools/#{account.name}/#{companion_tool.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
        expect(companion_tool.reload.published_at).not_to be_nil
      end
    end

    context 'when the companion tool is not published' do
      let!(:companion_tool) { create(:companion_tool, creator: account, published_at: nil) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

      it 'returns a 409' do
        post "/tools/#{account.name}/#{companion_tool.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(409)
      end
    end

    context 'when the companion tool does not exist' do
      it 'returns a 404' do
        post "/tools/#{account.name}/nonexistent/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
      end
    end

    context 'when the account does not exist' do
      let!(:companion_tool) { create(:companion_tool, creator: account, published_at: Time.current) }
      let!(:companion_tool_ownership) { create(:companion_tool_ownership, account: account, companion_tool: companion_tool) }

      it 'returns a 404' do
        post "/tools/nonexistent/#{companion_tool.name}/unpublish", headers: auth_headers(user)
        expect(response).to have_http_status(404)
        expect(companion_tool.reload.published_at).not_to be_nil
      end
    end
  end
end
