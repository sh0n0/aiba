require 'rails_helper'

RSpec.describe StarsController, type: :request do
  describe 'DELETE /companions/:account_name/:companion_name/star' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:companion) { create(:companion, creator: account) }

    context 'when the companion is starred' do
      let!(:star) { create(:star, starrable: companion, account: account) }

      it 'deletes the star' do
        delete "/companions/#{account.name}/#{companion.name}/star", headers: auth_headers(user)
        expect(response).to have_http_status(204)
        expect(account.starred_companions.count).to eq(0)
      end
    end

    context 'without auth headers' do
      it 'returns 401' do
        delete "/companions/#{account.name}/#{companion.name}/star"
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'DELETE /tools/:account_name/:tool_name/star' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }
    let!(:companion_tool) { create(:companion_tool, creator: account) }

    context 'when the companion tool is starred' do
      let!(:star) { create(:star, starrable: companion_tool, account: account) }

      it 'deletes the star' do
        delete "/tools/#{account.name}/#{companion_tool.name}/star", headers: auth_headers(user)
        expect(response).to have_http_status(204)
        expect(account.starred_companion_tools.count).to eq(0)
      end
    end

    context 'without auth headers' do
      it 'returns 401' do
        delete "/tools/#{account.name}/#{companion_tool.name}/star"
        expect(response).to have_http_status(401)
      end
    end
  end
end
