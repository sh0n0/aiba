require 'rails_helper'

RSpec.describe AccountController, type: :request do
  describe 'GET /account/:name/companions' do
    let!(:account) { create(:account) }
    let!(:user) { create(:user, account: account) }

    context 'when published companions created by the account exist' do
      page_size = AccountController.const_get(:COMPANIONS_PER_PAGE)

      let!(:companions) { create_list(:companion, 20, creator: account) }

      it 'returns a paginated list of companions' do
        get "/account/#{account.name}/companions"
        expect(response).to have_http_status(200)
        expect(response.parsed_body['companions'].size).to eq(page_size)
      end

      it 'returns the latest companions' do
        get "/account/#{account.name}/companions"
        expect(response).to have_http_status(200)
        expect(response.parsed_body['companions'].first['id']).to eq(companions.last.id)
        expect(response.parsed_body['companions'].last['id']).to eq(companions[companions.size - page_size].id)
      end
    end

    context 'when published companions created by the account do not exist' do
      let!(:companions) { create_list(:companion, 20, creator: build(:account)) }

      it 'returns an empty array' do
        get "/account/#{account.name}/companions"
        expect(response).to have_http_status(200)
        expect(response.parsed_body['companions']).to eq([])
      end
    end
  end
end
